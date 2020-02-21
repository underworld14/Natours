const Users = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await Users.find();

  res.status(200).json({
    status: 'success',
    results: user.length,
    user
  });
});
