const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  // status: Boolean,
  statusLiking: {
    type: Boolean,
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Like tour must belong to a tour'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Like tour must belong to an user'],
  },
});

likeSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  }).populate({
    path: 'tour',
    select: 'name',
  });
  next();
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
