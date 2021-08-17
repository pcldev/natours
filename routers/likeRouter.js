const express = require('express');

const {
  createLikeTour,
  getAllLikes,
  updateLiking,
  checkLikeTour,
} = require('../controller/likeController');
const { protect, restrictTo } = require('../controller/authController');

const router = express.Router();

router.post('/post-like/:tourId', protect, checkLikeTour, createLikeTour);
router.get('/getAllLikes', protect, restrictTo('admin'), getAllLikes);
router.patch('/updateLiking/:tourId', protect, updateLiking);

module.exports = router;
