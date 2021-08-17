const express = require('express');
const {
  getCheckoutSession,
  getAllBooking,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controller/bookingController');
const {
  isLoggedIn,
  protect,
  restrictTo,
} = require('../controller/authController');

const router = express.Router();

router.use(protect);

router.post('/checkout-session/:tourID', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide'));

router.route('/').get(getAllBooking).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

module.exports = router;
