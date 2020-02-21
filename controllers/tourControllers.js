const ApiFeatures = require('../utils/apiFeatures');
const Tours = require('../models/toursModels');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');

exports.aliasTopCheaps = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.query);
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

exports.postTour = catchAsync(async (req, res, next) => {
  const data = await Tours.create(req.body);
  res.status(201).json({
    status: 'success',
    data
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const data = await Tours.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!data) {
    return next(new AppErr('No data found with that ID !', 404));
  }

  res.status(201).json({
    status: 'success',
    data
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const data = await Tours.findByIdAndDelete(req.params.id);

  if (!data) {
    return next(new AppErr('No data found with that ID !', 404));
  }

  res.status(202).json({
    status: 'success'
  });
});

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
