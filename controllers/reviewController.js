const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');
const Booking = require('../models/bookingModel');

// FUNCTION TO RESTRICT USER FROM REVIEWING A TOUR THEY HAVE NOT BOOKED
exports.restrictUser = async (req, res, next) => {
  const tourID = req.params.tourID || req.body.tour;
  const userID = req.user.id || req.body.user;
  if (!tourID || !userID) {
    return next(new AppError('Invalid request', 400));
  }
  const bookings = await Booking.find({ user: req.user.id });
  const tourIDs = bookings.map((el) => el.tour.id);
  if (!tourIDs.includes(tourID)) {
    return next(new AppError('You can only review tours you have booked', 400));
  }
  const review = await Review.findOne({ tour: tourID, user: userID });
  if (review) {
    return next(new AppError('You have already reviewed this tour', 400));
  }
  next();
};
// FUNCTION TO ADD REVIEW
exports.addReview = catchAsync(async (req, res) => {
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({ status: 'success', data: { review: newReview } });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
});

// FUNCTION TO GET ALL REVIEWS
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourID) filter = { tour: req.params.tourID };
  const reviews = await Review.find(filter);
  if (!reviews) return next(new AppError('No reviews found', 404));
  res.status(200).json({
    status: 'success',
    data: { reviews },
  });
});

// FUNCTION TO GET SPICIFIC REVIEW
exports.getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.ID);
  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);
