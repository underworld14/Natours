const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');

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

exports.createData = Model =>
  catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data
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
