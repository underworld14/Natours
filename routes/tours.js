const express = require("express");

const router = express.Router();

// require the controllers
const toursControllers = require("../controllers/tours");

// params middleware
router.param("id", toursControllers.checkId);

// our routes here
router
  .route("/")
  .get(toursControllers.getAllTours)
  .post(toursControllers.bodyCheck, toursControllers.postTours); //body check middleware

router
  .route("/:id")
  .get(toursControllers.getTourById)
  .delete(toursControllers.deleteTour);

module.exports = router;
