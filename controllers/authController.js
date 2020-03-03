const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const Users = require('../models/usersModel');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');
const sendEmail = require('../utils/mailer');

const generateToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES
  });
};

const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + Number(process.env.JWT_EXPIRES_COOKIE)),
    secure: false,
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
};

exports.signUp = catchAsync(async (req, res, next) => {
  const user = await Users.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword
  });

  const token = generateToken(user._id);
  sendTokenCookie(res, token);
  // remove password from the response
  user.password = undefined;

  res.status(201).json({
    status: 'success',
    token,
    user
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

  if (!user) next(new AppErr('Please enter correct email and password', 400));

  const checkpassword = await user.testPassword(password, user.password);

  if (!checkpassword) {
    return next(new AppErr('Please enter correct email and password', 400));
  }

  // if everything ok sent it to the client
  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  // remove password from the response
  user.password = undefined;

  res.status(200).json({
    status: 'success',
    user,
    token
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await Users.findById(req.user._id);

  res.status(200).json({
    message: 'success',
    user
  });
});

exports.processUsrImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 80 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppErr('Dont update password here !', 400));
  }

  const newData = req.body;
  if (req.file) {
    newData.photo = `${req.protocol}://${req.get('host')}/img/users/${req.file.filename}`;
  }

  const data = await Users.findByIdAndUpdate(req.user._id, req.body, {
    runValidators: false,
    new: true
  });

  res.status(201).json({
    status: 'success',
    message: 'Users successfull updated',
    data
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  // check curent password and inputed password
  const user = await Users.findById(req.user._id).select('+password');
  const checkPassword = await user.testPassword(oldPassword, user.password);

  // check curent password and inputed password
  if (!checkPassword) {
    return next(new AppErr('your password is not match'));
  }

  user.password = newPassword;
  user.confirmPassword = confirmNewPassword;
  await user.save();

  const token = generateToken(user._id);

  res.status(201).json({
    status: 'success',
    message: 'Password successfull updated',
    token
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await Users.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppErr('There is no user with that email !', 404));
  }

  const resetToken = user.createResetPassword(user._id);

  // send a email
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password ?, submit a PATCH with yout new password and password confirm to ${resetUrl}`;

  await sendEmail({
    email: user.email,
    subject: 'Password reset token valid for 10 min',
    message
  }).catch(() => {
    return next(new AppErr('Email verification sent failed, please try again later !', 500));
  });

  res.status(200).json({
    status: 'success',
    message: 'Reset Password sucessfull sent to your email !'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const decodedToken = await promisify(jwt.verify)(req.params.token, 'secretPassword');

  const user = await Users.findById(decodedToken.id);

  if (!user) {
    return next(new AppErr('Your request token is invalid !', 401));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  res.status(201).json({
    status: 'success',
    message: 'Password sucessfull reseted, please login again',
    user
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  console.log('enter this function');
  const { password } = req.body;

  const user = await Users.findById(req.user._id).select('+password');
  const checkPassword = await user.testPassword(password, user.password);

  // check curent password and inputed password
  if (!checkPassword) {
    return next(new AppErr('your password confirmation is incorrect !', 400));
  }

  user.active = false;
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    status: 'success',
    message: 'action success'
  });
});

exports.protected = catchAsync(async (req, res, next) => {
  // get the tokens
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    next(new AppErr('You are not loged in, Please login first !', 401));
  }

  // verify the tokens
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user is available
  const user = await Users.findById(decoded.id);

  if (!user) {
    next(new AppErr('Users is not available, please try login again !', 401));
  }

  // check if user actualy the password // feature not available
  // const isChanged = user.testUpdatePassword(decoded.iat);
  // if (isChanged) {
  //   next(
  //     new AppErr(
  //       'Users was actualy changed the password, please try login again !',
  //       401
  //     )
  //   );
  // }

  // grant access to user
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppErr('You dont have a permission to perform this action', 403));
    }

    next();
  };
};
