const Review = require('./../model/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = async (req, res, next) => {
  //Allow nested routes
  // console.log(tour);
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  //Nếu không có tour và user thì không thể tạo review
  //Gán tour =tourId với tourId là id của tour đang review
  //Gán user=req.user.id với req.user.id là req.user đã được login với "protect" middelware
  next();
};

exports.getAllReivews = factory.getAll(Review);

exports.getReview = factory.getOne(Review);

exports.createReview = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
