const express = require('express');

const router = express.Router();

// require the controllers
const authControllers = require('../controllers/authController');
const toursControllers = require('../controllers/tourControllers');
// const reviewsControllers = require('../controllers/reviewController');
const { upToursImg } = require('../utils/uploadImage');

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
  .get(toursControllers.getAllTours)
  .post(protected, restrictTo('admin', 'lead-guide'), toursControllers.postTour);

router.route('/tours-stats').get(toursControllers.getToursStats);
router.route('/monthly-plan/:year').get(toursControllers.getMonthlyPlan);

router.route('/top-cheap').get(toursControllers.aliasTopCheaps, toursControllers.getAllTours);

router.get('/tours-within/:dist/:latlng/:unit', toursControllers.getWithIn);

router.get('/get-distances/:latlng/:unit', toursControllers.getDistances);

router
  .route('/:id')
  .get(toursControllers.getTourById)
  .patch(
    protected,
    restrictTo('admin', 'lead-guide'),
    upToursImg,
    toursControllers.processTourImg,
    toursControllers.updateTour
  )
  .delete(protected, restrictTo('admin', 'lead-guide'), toursControllers.deleteTour);

module.exports = router;
