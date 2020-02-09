const express = require('express');
const morgan = require('morgan');

const app = express();

const AppError = require('./utils/appError');

// router
const toursRouter = require('./routes/tours');

// middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.reqTime = new Date().toUTCString();
  next();
});

// declare route
app.use('/api/v1/tours', toursRouter);

// ERROR 404 page not found error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} not found in this server `, 404));
});

// global error handling middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });

  next();
});

module.exports = app;
