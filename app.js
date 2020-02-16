const express = require('express');
const morgan = require('morgan');

const app = express();

// router - controller - handler
const AppError = require('./utils/appError');
const globalError = require('./controllers/errorHandler');
const toursRouter = require('./routes/tourRoutes');
const authRouter = require('./routes/authRoutes');

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
app.use('/api/v1/auth', authRouter);

// ERROR 404 page not found error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} not found in this server `, 404));
});

// global error handling middleware
app.use(globalError);

module.exports = app;
