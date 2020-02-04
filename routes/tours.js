const express = require('express');

const router = express.Router();

// require the controllers
const toursControllers = require('../controllers/tours');

// params middleware
// router.param("id", toursControllers.checkId);

// our routes here
router
  .route('/')
  .get(toursControllers.getAllTours)
  .post(toursControllers.postTour);

router.route('/tours-stats').get(toursControllers.getToursStats);
router.route('/monthly-plan/:year').get(toursControllers.getMonthlyPlan);

router
  .route('/top-cheap')
  .get(toursControllers.aliasTopCheaps, toursControllers.getAllTours);

router
  .route('/:id')
  .get(toursControllers.getTourById)
  .patch(toursControllers.updateTour)
  .delete(toursControllers.deleteTour);

module.exports = router;
