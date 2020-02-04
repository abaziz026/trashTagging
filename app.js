const path = require('path');
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const { fileStorage, fileFilter } = require('./util/fileUploads');
const geoTagController = require('./controllers/geoTagShowController');
const deletegeoTagController = require('./controllers/deleteGeoTagController');
const taggedLocationsController = require('./controllers/LocationsTaggingController');

app.use(express.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));



app.get('/api/v1/geotags/:geotagId',  geoTagController.getOneTagLocation);
app.get('/api/v1/geotags/?offset=*&limit=*', geoTagController.getManyTagLocation);
app.post('/api/v1/geotags/:taggedLocationId', taggedLocationsController.updateTaggedLocation);
app.post('/api/v1/geotags/',taggedLocationsController.postTagLocation);
app.delete('/api/v1/geotags/:geotagId', deletegeoTagController.deleteTagLocation);



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

app.listen(3000, () => {
  console.log('app is listening on port 3000');
});
