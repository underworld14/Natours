const ApiFeatures = require('../utils/apiFeatures');
const Tours = require('../models/tours');

exports.aliasTopCheaps = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err
    });
  }
};

exports.getTourById = (req, res) => {
  const { id } = req.params;

  Tours.findById(id)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err
      });
    });
};

exports.postTour = async (req, res) => {
  Tours.create(req.body)
    .then(data => {
      res.status(201).json({
        status: 'success',
        data
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err
      });
    });
};

exports.updateTour = (req, res) => {
  const { id } = req.params;

  Tours.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })
    .then(data => {
      res.status(201).json({
        status: 'success',
        data
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err
      });
    });
};

exports.deleteTour = (req, res) => {
  const { id } = req.params;

  Tours.findByIdAndDelete(id)
    .then(() => {
      res.status(202).json({
        status: 'success'
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err
      });
    });
};

exports.getToursStats = (req, res) => {
  Tours.aggregate([
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
  ])
    .then(data => {
      res.status(200).json({
        status: 'success',
        data
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err
      });
    });
};

exports.getMonthlyPlan = (req, res) => {
  const year = Number(req.params.year);
  console.log(year);
  Tours.aggregate([
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
  ])
    .then(data => {
      res.status(200).json({
        status: 'success',
        data
      });
    })
    .catch(err => {
      res.status(400).json({
        status: 'error',
        message: err
      });
    });
};
