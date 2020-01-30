const Tours = require('../models/tours');

exports.getAllTours = (req, res) => {
  Tours.find()
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
