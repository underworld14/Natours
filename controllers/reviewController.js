const Reviews = require('../models/reviewsModels');
const catchAsync = require('../utils/catchAsync');

exports.postReviews = catchAsync(async (req, res, next) => {
  const post = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour,
    user: req.user._id
  };

  const review = await Reviews.create(post);

  res.status(201).json({
    status: 'success',
    message: 'review successfull written !',
    review
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const review = await Reviews.find();

  res.status(200).json({
    status: 'success',
    results: review.length,
    review
  });
});

exports.getReviewsById = catchAsync(async (req, res, next) => {
  const review = await Reviews.findById(req.params.id);

  res.status(200).json({
    status: 'success',
    review
  });
});
