const express = require('express');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
} = require('./../controller/tourController');

const { protect, restrictTo } = require('./../controller/authController');

const reviewRouter = require('./../routers/reviewRouter');

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);
//use ở đây được sử dụng để liên kết sang reivewRouter
//Vd :{{URL}}api/v1/tours/:tourId/reviews

//param(tên,callback) tên ở đây sẽ tìm trong route ví dụ param(id,checkId) id ở đây sẽ là '/:id' nếu route là '/:user_id' thì param sẽ để là param('user_id',callback)

tourRouter.route('/top-5-cheap').get(aliasTopTours, getAllTours);

tourRouter.route('/tour-stats').get(getToursStats);

tourRouter
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

tourRouter
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

tourRouter.route('/distances/:latlng/unit/:unit').get(getDistances);

tourRouter
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = tourRouter;
