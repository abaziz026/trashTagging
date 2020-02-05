const fileHelper = require('../util/file');
const GeoTags = require('../models/geoTagsModel');

exports.getOneTag = (req, res) => {
  const geoTagId = req.params.geoTagId;
  console.log(geoTagId);
  GeoTags.findById(geoTagId)
    .then(data => {
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

exports.deleteTag = (req, res) => {
  const geoTagId = req.params.taggedLocationId;
  console.log(geoTagId);
  return GeoTags.findOneAndDelete({ geoTagId: geoTagId }, options)
    .then(deletedDocument => {
      if (deletedDocument) {
        console.log(
          `Successfully deleted document that had the form: ${deletedDocument}.`
        );
      } else {
        console.log('No document matches the provided query.');
      }
      return deletedDocument;
    })
    .catch(err => console.error(`Failed to find and delete document: ${err}`));
};

exports.getManyTags = async (req, res) => {
  try {
    const offset = req.query.offset ? parseInt(req.query.offset) : 0;
    const size = req.query.size ? parseInt(req.query.size) : 10;

    const geoTags = await GeoTags.find()
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(size);
    console.log(geoTags);
    res.status(200).json({ status: 'success', data: geoTags });
  } catch (error) {
    console.log(error);
    res.json({
      status: 'error',
      error: error
    });
  }
};

exports.postTag = (req, res) => {
  try {
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;
    const trashScale = req.body.trashScale;

    const picture = req.file;
    const pictureUrl = picture.path;

    const geoTag = new GeoTags({
      latitude: latitude,
      longitude: longitude,
      trashScale: trashScale,
      photos: pictureUrl
    });
    geoTag
      .save()
      .then(result => {
        res.status(201).json({
          status: 'New Geo tag Created.',
          data: {
            Latitude: result.latitude,
            Longitude: result.longitude,
            TrashScale: result.trashScale,
            photo: result.photos
          }
        });
      })
      .catch(err => {
        console.log(err);
      });
  } catch (error) {
    console.log(error);
    res.json({ error: error });
  }
};

exports.updateTag = (req, res) => {
  const geoTagId = req.params.taggedLocationId;
  const updateLatitude = req.body.latitude;
  const updateLongitude = req.body.longitude;
  const updateTrashScale = req.body.trashScale;
  const picture = req.file;
  const pictureUrl = picture.path;
  console.log(pictureUrl);
  GeoTags.findById(geoTagId)
    .then(taggedLocation => {
      taggedLocation.latitude = updateLatitude;
      taggedLocation.longitude = updateLongitude;
      taggedLocation.trashScale = updateTrashScale;
      if (picture) {
        fileHelper.deleteFile(taggedLocation.photo[0].toString());
        taggedLocation.photo = pictureUrl;
      }
      return taggedLocation.save().then(result => {
        console.log('Location updated!');

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
    });
};
