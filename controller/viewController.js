const Tour = require('../model/tourModel');
const Bookings = require('../model/bookingModel');
const Reviews = require('../model/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();
  // 2) Build template

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  // res
  //   .status(200)
  //   .set(
  //     'Content-Security-Policy',
  //     "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  //   )
  //   .render('tour', {
  //     title: `${tour.title} Tour`,
  //     tour,
  //   });
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('_login', {
    title: 'Log into your account',
  });
};

/* res.render('file_pug',{Object truyền vào})*/

exports.getSignupForm = (req, res) => {
  res.status(200).render('_signup', {
    title: 'Sign up account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('_account', {
    title: 'Your account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Bookings.find({ user: req.user.id });
  // 2) Find tours with the returned ID
  const tourID = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourID } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.getMyReviews = catchAsync(async (req, res) => {
  // 1) Find all reviews
  const reviews = await Reviews.find({ user: req.user.id });
  // 2) Find tours with the returned ID
  const tourId = reviews.map((el) => el.tour);

  const tours = await Tour.find({ _id: { $in: tourId } });
  res.status(200).render('_review', {
    title: 'My Reviews',
    reviews,
  });
});

exports.crudTours = catchAsync(async (req, res) => {
  // 1) Find all tours
  const tours = await Tour.find({});
  res.status(200).render('_crudTours', {
    title: 'All Tours',
    tours,
  });
});

exports.editTour = catchAsync(async (req, res) => {
  // 1) find tour wanted to edit
  const tour = await Tour.findById(req.params.tourId);
  res.status(200).render('_editTour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
