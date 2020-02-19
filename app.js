const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongooseSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();

// router - controller - handler
const AppError = require('./utils/appError');
const globalError = require('./controllers/errorHandler');
const toursRouter = require('./routes/tourRoutes');
const authRouter = require('./routes/authRoutes');

// middleware
// http secure headers
app.use(helmet());

// development logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100
});

app.use('/api', limiter);

// body parser
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// prevent data sanitize
app.use(mongooseSanitize());
app.use(xss());

// prevent parameter p
app.use(
  hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'difficulty', 'price']
  })
);

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
