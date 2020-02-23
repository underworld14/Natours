const Router = require('express').Router({ mergeParams: true });
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const { protected, restrictTo } = authController;
const { getAllReviews, postReviews, deleteReview, updateReview } = reviewController;

Router.route('/')
  .get(getAllReviews)
  .post(protected, restrictTo('user'), postReviews);

Router.route('/:id')
  .delete(protected, restrictTo('user', 'admin'), deleteReview) // only admin and creator can delete the data
  .patch(protected, restrictTo('user', 'admin'), updateReview); // only creator can update the data

module.exports = Router;
