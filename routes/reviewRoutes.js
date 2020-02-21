const Router = require('express').Router();
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { protected } = authController;
const { getAllReviews, postReviews, getReviewsById } = reviewController;

Router.route('/')
  .get(getAllReviews)
  .post(protected, postReviews);

Router.route('/:id').get(protected, getReviewsById);

module.exports = Router;
