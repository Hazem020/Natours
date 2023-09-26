const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render('overview.pug', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: 'reviews',
      fields: 'review rating user',
    })
    .exec();
  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  let booking;
  if (res.locals.user) {
    booking = await Booking.findOne({
      user: res.locals.user.id,
      tour: tour.id,
    });
  }
  let booked = false;
  if (booking) {
    booked = true;
  }
  res.status(200).render('tour.pug', {
    title: `${tour.name} Tour`,
    tour,
    booked,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login.pug', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: ' Your Account',
  });
};
exports.updateUserData = catchAsync(async (req, res, next) => {
  const user = await User.findOneAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: ' Your Account',
    user,
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });
  // console.log(tours);
  res.status(200).render('overview.pug', {
    title: 'My Tours',
    tours,
  });
});
