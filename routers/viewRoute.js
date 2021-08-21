const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getAccount,
  getMyTours,
  getMyReviews,
  crudTours,
  editTour,
} = require('../controller/viewController');
const {
  isLoggedIn,
  protect,
  isBooked,
} = require('../controller/authController');

const { checkLikeTour } = require('../controller/likeController.js');
const { createBookingCheckout } = require('../controller/bookingController');

const router = express.Router();

router.get('/', createBookingCheckout, isLoggedIn, getOverview);

router.get('/tour/:slug/:tourId', isLoggedIn, isBooked, checkLikeTour, getTour);

router.get('/login', isLoggedIn, getLoginForm);
router.get('/signup', isLoggedIn, getSignupForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);
router.get('/my-reviews', protect, getMyReviews);
router.get('/manage-tours', protect, crudTours);
router.get('/manage-tours/:tourId', protect, editTour);
// router.get('/check', check);
module.exports = router;
