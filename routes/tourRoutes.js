const express = require('express');

const router = express.Router();

// require the controllers
const authControllers = require('../controllers/authController');
const toursControllers = require('../controllers/tourControllers');
const { upToursImg } = require('../utils/uploadImage');

const { protected, restrictTo } = authControllers;
const {
  processTourImg,
  postTour,
  getAllTours,
  getTourById,
  updateTour,
  deleteTour,
  aliasTopCheaps,
  getToursStats,
  getMonthlyPlan,
  getWithIn,
  getDistances
} = toursControllers;

// params middleware
// router.param("id", toursControllers.checkId);

// review router and nesting are here !!
const reviewRoutes = require('../routes/reviewRoutes');

router.use('/:tourId/reviews', reviewRoutes); //post tour review

// our tour routes here
router
  .route('/')
  .get(getAllTours)
  .post(protected, restrictTo('admin', 'lead-guide'), upToursImg, processTourImg, postTour);

router
  .route('/:id')
  .get(getTourById)
  .patch(protected, restrictTo('admin', 'lead-guide'), upToursImg, processTourImg, updateTour)
  .delete(protected, restrictTo('admin', 'lead-guide'), deleteTour);

router.route('/tours-stats').get(getToursStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/top-cheap').get(aliasTopCheaps, getAllTours);
router.get('/tours-within/:dist/:latlng/:unit', getWithIn);
router.get('/get-distances/:latlng/:unit', getDistances);

module.exports = router;
