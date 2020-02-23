const express = require('express');

const router = express.Router();

// require the controllers
const authControllers = require('../controllers/authController');
const toursControllers = require('../controllers/tourControllers');
// const reviewsControllers = require('../controllers/reviewController');

const { protected, restrictTo } = authControllers;

// params middleware
// router.param("id", toursControllers.checkId);

// review router and nesting are here !!
const reviewRoutes = require('../routes/reviewRoutes');
// post tour/:tourId/reviews
router.use('/:tourId/reviews', reviewRoutes); //post tour review

// our tour routes here
router
  .route('/')
  .get(protected, toursControllers.getAllTours)
  .post(toursControllers.postTour);

router.route('/tours-stats').get(toursControllers.getToursStats);
router.route('/monthly-plan/:year').get(toursControllers.getMonthlyPlan);

router.route('/top-cheap').get(toursControllers.aliasTopCheaps, toursControllers.getAllTours);

router
  .route('/:id')
  .get(toursControllers.getTourById)
  .patch(toursControllers.updateTour)
  .delete(protected, restrictTo('admin', 'lead-guide'), toursControllers.deleteTour);

module.exports = router;
