const AppError = require('../utils/appError');

const validatorErr = err => {
  const message = `${err.message}`;
  return new AppError(message, 400);
};

const duplicateErr = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  // console.log(value);
  const message = `Invalid duplicate value ${value}, please input another value !`;
  return new AppError(message, 400);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'ValidationError') error = validatorErr(error);
    if (error.code === 11000) error = duplicateErr(error);

    if (error.isOperational) {
      // operational trusted err to send to the client
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message
      });
    } else {
      // programming or another unknown errors dont send the details to the clients
      // log to the console
      console.error('ERROR', error);

      // send general message
      res.status(500).json({
        status: 'error',
        message: 'something went very wrong'
      });
    }
  }
};
