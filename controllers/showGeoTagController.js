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
