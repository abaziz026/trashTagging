const GeoTags = require('../models/geoTagsModel');

exports.getOneTagLocation = (req, res) => {
  const geoTagId = req.params.geoTagId;
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

exports.getManyTagLocation = (req, res) => {
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