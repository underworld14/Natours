const path = require('path');
const express = require('express');
const cors = require('cors');
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
const userRouter = require('./routes/userRoutes');
const toursRouter = require('./routes/tourRoutes');
const authRouter = require('./routes/authRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// middleware
// cors
app.use(cors());

// http secure headers
app.use(helmet());

// view engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

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

// template engine routes
app.get('/', (req, res) => {
  res.status(200).render('base', {
    title: 'Natours',
    tour: 'Jalan Jalan di Malang'
  });
});

// declare route
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/reviews', reviewRouter);

// ERROR 404 page not found error handling
app.all('*', (req, res, next) => {
  next(new AppError(`Page ${req.originalUrl} not found in this server `, 404));
});

// global error handling middleware
app.use(globalError);

module.exports = app;
