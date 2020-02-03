const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const { fileStorage, fileFilter } = require('./util/fileUploads');
const geoTagsRouter = require('./routes/geoTags');
const taggedLocationsRouter = require('./routes/taggedLocations');

app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/v1', geoTagsRouter);
app.use('/api/v1', taggedLocationsRouter);

mongoose
  .connect(process.env.MONGODB_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log('db connected');
  })
  .catch(err => {
    console.log(err);
  });

app.listen(8080, () => {
  console.log('app is listening on port 8080');
});
