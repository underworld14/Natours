const express = require('express');

const router = express.Router();

// require the controllers
const authControllers = require('../controllers/authController');
const toursControllers = require('../controllers/tourControllers');

// params middleware
// router.param("id", toursControllers.checkId);

// our routes here
router
  .route('/')
  .get(authControllers.protected, toursControllers.getAllTours)
  .post(toursControllers.postTour);

router.route('/tours-stats').get(toursControllers.getToursStats);
router.route('/monthly-plan/:year').get(toursControllers.getMonthlyPlan);

router.route('/top-cheap').get(toursControllers.aliasTopCheaps, toursControllers.getAllTours);

router
  .route('/:id')
  .get(toursControllers.getTourById)
  .patch(toursControllers.updateTour)
  .delete(
    authControllers.protected,
    authControllers.restrictTo('admin', 'lead-guide'),
    toursControllers.deleteTour
  );

module.exports = router;