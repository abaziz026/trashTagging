const GeoTags = require('../models/geoTagsModel');

exports.postTagLocation = (req, res) => {
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const trashScale = req.body.trashScale;
  const picture = req.file;
  const pictureUrl = picture.path;

  console.log(`${latitude}  ${longitude}  ${picture}`);
  console.log('location tag');
  res.send('post tag location ');
  const geoTag = new GeoTags({
    latitude: latitude,
    longitude: longitude,
    trashScale: trashScale,
    photo: pictureUrl
  });
  geoTag
    .save()
    .then(result => {
      console.log('trash tag created');
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
};
exports.getTagLocation = (req, res) => {
  console.log(
    'get tagged location form to be implemented for the front end mean showing form to get data.'
  );
  res.send(
    'get tagged location form to be implemented for the front end mean showing form to get data.'
  );
};
