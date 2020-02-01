const Tours = require('../models/tours');

exports.getAllTours = async (req, res) => {
  try {
    // 1a filtering query
    const queryObj = { ...req.query };
    const exclude = ['page', 'limit', 'sort', 'fields'];
    exclude.forEach(el => delete queryObj[el]);

    //1b advanced filtering (gt\gte\lt\lte)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    // 2. sorting queries
    let sortQuery;
    if (req.query.sort) {
      sortQuery = req.query.sort.split(',').join(' ');
    } else {
      sortQuery = '-createdAt';
    }

    let selectQuery;
    if (req.query.fields) {
      selectQuery = req.query.fields.split(',').join(' ');
    } else {
      selectQuery = '-__v';
    }

    // 4. pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const totalTours = await Tours.countDocuments();
      if (skip >= totalTours) {
        throw new Error("The Page doesn't exist !");
      }
    }

    // execute all the queries
    const query = Tours.find(JSON.parse(queryStr))
      .sort(sortQuery)
      .select(selectQuery)
      .skip(skip)
      .limit(limit);

    const tours = await query;
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
