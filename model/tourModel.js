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
//index ở đây là để đặt trước
//VD : muốn truy vấn đến giá tiền như nào thì nó sẽ chỉ cần truy vẫn từng đó dữ liệu mà không cần phải quét hết toàn bộ tài liệu

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

//Virtual poplulate
//Chúng ta có thể tạo reviews trong Schema nhưng nó làm hiệu xuất bị giảm vì dùng populate nên tạo 1 virtual
//__ trong Schema có thể là 1 cách hữu ích
//VD: reviews:{
//  {
//   type: mongoose.Schema.ObjectId,
//         ref: 'Review',
// }
//}
//Có thẻ dùng như trên thay vì dùng virtual populate nhưng hiệu suất sẽ giảm
tourSchema.virtual('reviews', {
  ref: 'Review',
  //Đầu tiên sẽ ref (đề cập) đến Review trong reviewModel
  foreignField: 'tour',
  //tour này là được đề cập đến trong reviewModel
  localField: '_id',
  //_id được đề cập tới đây là id của tour
  //cần _id để có thể connect Review và Tour
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
