const jwt = require('jsonwebtoken');
const Users = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const data = await Users.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = generateToken(data._id);

  res.status(201).json({
    status: 'success',
    token,
    data
  });
});

exports.signIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check email and password are available
  if (!email || !password) {
    return next(new AppErr('Please provide email and password', 400));
  }

  // check is user exist and password is correct
  const user = await Users.findOne({ email }).select('+password');
  const checkpassword = await user.testPassword(password, user.password);

  if (!user || !checkpassword) {
    return next(new AppErr('Please enter correct email and password', 400));
  }

  // if everything ok sent it to the client
  const token = generateToken(user._id);
  res.status(200).json({
    status: 'success',
    user: {
      name: user.name,
      email: user.email,
      photo: user.photo
    },
    token
  });
});
