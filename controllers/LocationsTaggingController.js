const fileHelper = require('../util/file');
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
exports.updateTaggedLocation = (req, res) => {
  const geoTagId = req.params.taggedLocationId;
  const updateLatitude = req.body.latitude;
  const updateLongitude = req.body.longitude;
  const updateTrashScale = req.body.trashScale;
  const picture = req.file;
  const pictureUrl = picture.path;
  console.log(pictureUrl);
  GeoTags.findById(geoTagId)
    .then(taggedLocation => {
      console.log(taggedLocation.photo[0]);
      console.log(taggedLocation.pictureUrl);
      taggedLocation.latitude = updateLatitude;
      taggedLocation.longitude = updateLongitude;
      taggedLocation.trashScale = updateTrashScale;
      if (picture) {
        fileHelper.deleteFile(taggedLocation.photo[0].toString());
        taggedLocation.photo = pictureUrl;
      }
      return taggedLocation.save().then(result => {
        console.log('Location updated!');
        console.log(result);
        res.status(200).json({
          status: 'success',
          message: 'Geo tag updated',
          data: result
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        status: 'fail',
        message: 'some error occur',
        err: err
      });
      console.log(err);
    });
};
