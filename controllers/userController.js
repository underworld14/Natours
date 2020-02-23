const Users = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');
const factory = require('./handlerFactory');

exports.createUser = factory.createData(Users);

exports.getAllUsers = factory.getAll(Users);

exports.getUser = factory.getOne(Users);

exports.updateUser = factory.updateData(Users);

exports.updatePassword = catchAsync(async (req, res, next) => {
  const data = await Users.findById(req.params.id);

  if (!data) return new AppErr('Users not found', 404);

  data.password = req.body.password;
  data.confirmPassword = req.body.confirmPassword;
  await data.save();

  // remove from response
  data.password = undefined;

  res.status(201).json({
    status: 'success',
    data
  });
});

exports.deleteUser = factory.deleteOne(Users);
