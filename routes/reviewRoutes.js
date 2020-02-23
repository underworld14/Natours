const Router = require('express').Router({ mergeParams: true });
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { protected, restrictTo } = authController;
const { getAllReviews, postReviews } = reviewController;

Router.route('/')
  .get(getAllReviews)
  .post(protected, restrictTo('user'), postReviews);

module.exports = Router;
