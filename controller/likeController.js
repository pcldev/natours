const Like = require('./../model/likeModel');
const catchAsync = require('./../utils/catchAsync');

exports.checkLikeTour = catchAsync(async (req, res, next) => {
  const data = await Like.find({
    tour: req.params.tourId,
    user: req.user.id,
  });
  if (data.length === 0) return next();
  if (data[0].statusLiking === true) res.locals.liked = true;
  next();
});

exports.createLikeTour = catchAsync(async (req, res) => {
  const check = await Like.findOne({
    tour: req.params.tourId,
    user: req.user.id,
  });
  if (!check) {
    const tourId = req.params.tourId;
    const userId = req.user.id;
    const data = await Like.create({
      statusLiking: true,
      tour: tourId,
      user: userId,
    });
    res.status(200).json({
      status: 'success',
      data,
    });
  } else {
    check.statusLiking = true;
    await check.save();
  }
});

exports.getAllLikes = catchAsync(async (req, res) => {
  const data = await Like.find({});
  res.status(200).json({
    status: 'success',
    data,
  });
});

exports.updateLiking = catchAsync(async (req, res) => {
  // const data = await Like.findByIdAndUpdate(req.params.likingId, {
  //   statusLiking: false,
  // });
  const data = await Like.findOne({
    tour: req.params.tourId,
    user: req.user.id,
  });
  data.statusLiking = false;
  await data.save();
  res.status(201).json({
    status: 'success',
    data,
  });
});
