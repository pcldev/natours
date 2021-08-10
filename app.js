const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');
const tourRouter = require('./routers/tourRouters');
const userRouter = require('./routers/userRouter');
const reviewRouter = require('./routers/reviewRouter');
const bookingRouter = require('./routers/bookingRoutes');
const viewRouter = require('./routers/viewRoute');

//Start express application
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWARES
//Serving static files
app.use(express.static(path.join(__dirname, 'public')));

//Security HTTP header
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour',
});

//Limite requests from some API
app.use('/api', limiter);

//Body parser,reading data from body into req,body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

//Data sanitization againts NOSQL query injection
app.use(mongoSanitize());

//Data sanitize againts XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

app.use(compression());

//Test middelware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//Khi '/api/v1/tours' được truy vấn thì các resquest dưới sẽ không bao giờ được đọc
//Nếu để app.all lên đầu '*' với việc chỉ định toàn bộ thì các request cũng sẽ không được thực thi
//Ví dụ '/api/v1/tours' khi dưới app.all thì luôn trả về " Can't find ${req.originalUrl} on this server " cho dù truy vấn có đúng hay không đi chăng nữa
//Cách thức hoạt động cũng giống như Middelware nó sẽ chạy lần lượt

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
