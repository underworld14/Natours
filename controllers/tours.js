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
