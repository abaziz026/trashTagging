const GeoTags = require('../models/geoTagsModel');

exports.deleteTagLocation = (req, res) => {
  const geoTagId = req.params.taggedLocationId;
  console.log(geoTagId);
  return GeoTags.findOneAndDelete({geoTagId:geoTagId}, options)
  .then(deletedDocument => {
    if(deletedDocument) {
      console.log(`Successfully deleted document that had the form: ${deletedDocument}.`)
    } else {
      console.log("No document matches the provided query.")
    }
    return deletedDocument
  })
  .catch(err => console.error(`Failed to find and delete document: ${err}`))
};
