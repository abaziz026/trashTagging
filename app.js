const path = require('path');
require('dotenv').config();
const express = require('express');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const AppError = require('./util/appError');
const multer = require('multer');
const app = express();
const { fileStorage, fileFilter } = require('./util/fileUploads');
const {
  getOneTag,
  getManyTags,
  postTag,
  updateTag,
  deleteTag
} = require('./controllers/geoTags');
const userRouter = require('./routes/userRoutes');

//Global middleware

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.urlencoded({ extended: false, limit: '20kb' }));
app.use(express.json({ limit: '20kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());
//if i move the this middleware down the multer middleware then user image upload
//will not work because i am running double multer middleware for geotags and user
// with separate configurations.
app.use('/api/v1/users', userRouter);
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/images', express.static(path.join(__dirname, 'images')));

//API EndPoints
app.get('/api/v1/geotags/:geotagId', getOneTag);
app.get('/api/v1/geotags/', getManyTags);
app.post('/api/v1/geotags/:geotagId', updateTag);
app.post('/api/v1/geotags/', postTag);
app.delete('/api/v1/geotags/:geotagId', deleteTag);

mongoose
  .connect(process.env.MONGODB_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(result => {
    console.log('db connected');
  })
  .catch(err => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log('app is listening on port 3000');
});
