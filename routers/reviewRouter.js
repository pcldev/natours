const express = require('express');
const {
  getAllReivews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
  getReview,
} = require('./../controller/reviewController');
const { protect, restrictTo } = require('./../controller/authController');

const router = express.Router({ mergeParams: true });
//Cần mergeParams để cho phép các route khác liên kết với router này

router.use(protect);

router
  .route('/')
  .get(getAllReivews)
  .post(restrictTo('user'), setTourUserIds, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);
module.exports = router;
