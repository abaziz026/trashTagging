const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const { fileStorage, fileFilter } = require('./util/fileUploads');
const geoTagsShowRouter = require('./routes/geoTagsShow');
const PostingtaggedLocationsRouter = require('./routes/TaggingLocations');
const deletetagRouter=require('./routes/deleteGeoTags');

app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));


app.get('/api/v1/geotags/', geoTagsShowRouter);
app.post('/api/v1/geotags/', PostingtaggedLocationsRouter);
app.delete('/api/v1/geotags/', deletetagRouter);

mongoose
  .connect(process.env.MONGODB_URI_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(result => {
    console.log('db connected by this');
  })
  .catch(err => {
    console.log(err);
  });

app.listen(8080, () => {
  console.log('app is listening on port 8080');
});
