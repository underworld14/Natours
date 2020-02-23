const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');

exports.createData = Model =>
  catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res, next) => {
    const data = await Model.find();

    res.status(200).json({
      status: 'success',
      results: data.length,
      data
    });
  });

exports.getOne = Model =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data
    });
  });

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data) {
      return next(new AppErr('No data found with that ID !', 404));
    }

    res.status(201).json({
      status: 'success'
    });
  });

exports.updateData = Model =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
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
