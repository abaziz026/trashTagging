const fileHelper = require('../util/file');
const GeoTags = require('../models/geoTagsModel');
exports.getShowGeoTags = (req, res) => {
  GeoTags.find()
    .then(geotags => {
      console.log(geotags);

      res.status(200).json({ status: 'success', data: geotags });
    })
    .catch(err => {
      res.json({
        status: 'failed',
        error: err
      });
    });
};
exports.getSingleTaggedLocation = (req, res) => {
  const geoTagId = req.params.taggedLocationId;
  console.log(geoTagId);
  GeoTags.findById(geoTagId)
    .then(data => {
      console.log(data);
      res.status(200).json({
        status: 'success',
        data: data
      });
    })
    .catch(err => {
      res.status(404).json({
        status: 'failed',
        err: err
      });
    });
};
exports.editTaggedLocation = (req, res) => {
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
