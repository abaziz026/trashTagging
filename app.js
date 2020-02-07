const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const { addPhotos, deletePhoto } = require('./controllers/geoPhotos');
const { fileStorage, fileFilter } = require('./util/fileUploads');
const {
  getOneTag,
  getManyTags,
  postTag,
  updateTag,
  deleteTag
} = require('./controllers/geoTags');
app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/api/v1/geotags/:geotagId', getOneTag);
app.get('/api/v1/geotags/', getManyTags);
app.post('/api/v1/geotags/:geotagId', updateTag);
app.post('/api/v1/geotags/', postTag);
app.post('/api/v1/geotags/:geotagId/addPhotos', addPhotos);
app.delete('/api/v1/geotags/:geotagId', deleteTag);

app.delete('/api/v1/geotags/:geotagId/Photos/:checksum', deletePhoto);

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
const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`app is listening on ${port}`);
});

