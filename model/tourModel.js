const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
    },
    duration: {
      type: Number,
      required: [true, 'A tour muse have a duration'],
    },
    slug: String,
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      lowercase: true,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy ,medium or difficulty',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });
//index ??? ????y l?? ????? ?????t tr?????c
//VD : mu???n truy v???n ?????n gi?? ti???n nh?? n??o th?? n?? s??? ch??? c???n truy v???n t???ng ???? d??? li???u m?? kh??ng c???n ph???i qu??t h???t to??n b??? t??i li???u

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

//Virtual poplulate
//Ch??ng ta c?? th??? t???o reviews trong Schema nh??ng n?? l??m hi???u xu???t b??? gi???m v?? d??ng populate n??n t???o 1 virtual
//__ trong Schema c?? th??? l?? 1 c??ch h???u ??ch
//VD: reviews:{
//  {
//   type: mongoose.Schema.ObjectId,
//         ref: 'Review',
// }
//}
//C?? th??? d??ng nh?? tr??n thay v?? d??ng virtual populate nh??ng hi???u su???t s??? gi???m
tourSchema.virtual('reviews', {
  ref: 'Review',
  //?????u ti??n s??? ref (????? c???p) ?????n Review trong reviewModel
  foreignField: 'tour',
  //tour n??y l?? ???????c ????? c???p ?????n trong reviewModel
  localField: '_id',
  //_id ???????c ????? c???p t???i ????y l?? id c???a tour
  //c???n _id ????? c?? th??? connect Review v?? Tour
});

//DOC Middelware
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   const guidePromise = this.guides.map(async (id) => User.findById(id));
//   this.guides = await Promise.all(guidePromise);
//   next();
// });

//QUERY Middelware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'role _id name email photo',
  });
  next();
});

// tourSchema.post(/^find/, function (doc, next) {
//   console.log(`Query took ${Date.now() - this.start} miliseconds`);
//   next();
// });

//AGGREGATION Middelware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
