const Tour = require('../model/tourModel');
const User = require('../model/userModel');
const Booking = require('../model/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const factory = require('./handlerFactory');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const { quantity } = req.body;

  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);
  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourID
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}/${
      tour.id
    }`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: quantity ? quantity : 1,
      },
    ],
  });
  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  //This is only TEMPORARY, because it's UNSECURE,everyone can make booking without paying
  const { tour, user, price } = req.query;
  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
  // res.redirect(`${req.protocol}://${req.get('host')}`); *
  // Trang sẽ được load về req.originalUrl.split('?')[0] sau khi create Booking xong
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBooking = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
