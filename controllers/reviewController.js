const Reviews = require('../models/reviewsModels');
const catchAsync = require('../utils/catchAsync');
const AppErr = require('../utils/appError');

exports.postReviews = catchAsync(async (req, res, next) => {
  const post = {
    review: req.body.review,
    rating: req.body.rating,
    tour: req.body.tour || req.params.tourId,
    user: req.body.user || req.user._id
  };

  const review = await Reviews.create(post);

  res.status(201).json({
    status: 'success',
    message: 'review successfull written !',
    review
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const review = await Reviews.find(filter);

  res.status(200).json({
    status: 'success',
    results: review.length,
    review
  });
});

exports.deleteReview = async (req, res, next) => {
  const data = await Reviews.findById(req.params.id);

  if (!data) return next(new AppErr('no data found !', 404));

  if (req.user.role !== 'admin') {
    if (req.user._id.toString() !== data.user._id.toString()) {
      return next(new AppErr('You are not allowed to delete this data !', 400));
    }
  }

  await Reviews.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: 'success'
  });
};

exports.updateReview = catchAsync(async (req, res, next) => {
  const data = await Reviews.findById(req.params.id);

  if (data.user._id.toString() !== req.user._id.toString()) {
    return next(new AppErr('You are not allowed to edit this data !', 400));
  }

  data.review = req.body.review;
  data.rating = req.body.rating;

  await data.save();

  res.status(201).json({
    status: 'success',
    data
  });
});
