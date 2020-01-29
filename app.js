const express = require('express');
const morgan = require('morgan');

const app = express();

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

module.exports = app;
