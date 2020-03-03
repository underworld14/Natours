const sharp = require('sharp');

const ApiFeatures = require('../utils/apiFeatures');
const Tours = require('../models/toursModels');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');
const factory = require('./handlerFactory');

exports.aliasTopCheaps = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const getTours = new ApiFeatures(Tours.find(), req.query)
    .filtering()
    .sorting()
    .limitFields()
    .paginate();

  const tours = await getTours.query;
  res.status(200).json({
    status: 'success',
    results: tours.length,
    tours
  });
});

exports.getTourById = catchAsync(async (req, res, next) => {
  const data = await Tours.findById(req.params.id).populate({
    path: 'reviews',
    select: 'review'
  });

  if (!data) {
    return next(new AppErr('No data found with that ID !', 404));
  }

  res.status(200).json({
    status: 'success',
    data
  });
});

exports.postTour = factory.createData(Tours);

exports.processTourImg = catchAsync(async (req, res, next) => {
  if (req.files.imageCover) {
    const coverName = `tours-${req.params.id}-${Date.now()}-covers.jpeg`;
    req.body.imageCover = `${req.protocol}://${req.get('host')}/img/tours/${coverName}`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 80 })
      .toFile(`public/img/tours/${coverName}`);
  }

  if (req.files.images) {
    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const filename = `tours-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
        const resName = `${req.protocol}://${req.get('host')}/img/tours/${filename}`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 80 })
          .toFile(`public/img/tours/${filename}`);

        req.body.images.push(resName);
      })
    );
  }

  next();
});

exports.updateTour = factory.updateData(Tours);

exports.deleteTour = factory.deleteOne(Tours);

exports.getToursStats = catchAsync(async (req, res, next) => {
  const data = await Tours.aggregate([
    // {
    //   $match: { ratingsAverage: { $gte: 5.0 } }
    // },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
    // {
    //   $match: { _id: { $ne: 'EASY' } }
    // }
  ]);
  res.status(200).json({
    status: 'success',
    data
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = Number(req.params.year);
  const data = await Tours.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        total: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: { _id: 0 }
    },
    {
      $sort: { month: 1 }
    },
    { $limit: 12 }
  ]);
  res.status(200).json({
    status: 'success',
    data
  });
});

exports.getWithIn = catchAsync(async (req, res, next) => {
  const { dist, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? dist / 3963.2 : dist / 6378.1;

  console.log(lat, lng);

  if (!lat || !lng) {
    return next(new AppErr('Please Provide langtitude, latitude right format !', 400));
  }

  const data = await Tours.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  });

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    return next(new AppErr('Please Provide langtitude, latitude right format !', 400));
  }

  const data = await Tours.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    results: data.length,
    data
  });
});
