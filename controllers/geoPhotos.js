const GeoTags = require('../models/geoTagsModel');
var fs = require('fs');
var crypto = require('crypto');
function generateChecksum(str, algorithm, encoding) {
  return crypto
    .createHash(algorithm || 'md5')
    .update(str, 'utf8')
    .digest(encoding || 'hex');
}
exports.addPhotos = async (req, res) => {
  try {
    const geoTagId = req.params.geotagId;
    const picture = req.file;
    const data = fs.readFileSync(picture.path, function (err, data) {
      if (err) throw err;
      return data;
    });

    const photoDetails = {
      "photourl": picture.path,
      "checksum": generateChecksum(data)
    };

    const geotag = await GeoTags.findById(geoTagId);

    geotag.photos.push(photoDetails);
    geotag.save();
    res.status(200).json(geotag);
  } catch (error) {
    res.status(501).json({
      status: 'No data Found',
      message: 'Cannot find data by this id or some thing wrong in the picture upload',
      err: error
    });
  }
};



exports.deletePhoto = async (req, res) => {
  try {
    const checksum = req.params.checksum;
    const geotagId = req.params.geotagId;

    const geotag = await GeoTags.findById(geotagId);
    const newPhotos = [];
    const photos = geotag.photos;
    for (var i = 0; i <= photos.length; ++i) {
      if (photos[i] != null && photos[i].checksum == checksum) {
        const photoInDirectory = photos[i].photourl;

        fs.unlink(photoInDirectory, function (error) {
          if (error) {
            throw error;
          }
        });
      }
      else {
        newPhotos.push(photos[i]);
      }
    }
    var filterednewPhotos = newPhotos.filter(function (el) { return el; });
    geotag.photos = filterednewPhotos;
    geotag.save();
    res.status(201).json({
      message: "deletion successfull",
      geotag: geotag
    });
  } catch (error) {
    res.status(501).json({
      message: "some thing went wrong in deletion of photo",
      error: error
    })
  }

}