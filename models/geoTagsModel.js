var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var geoTagsSchema = new Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  trashScale: {
    type: Number,
    required: true
  },
  photos: {
    type: []
  },
  createdAt: { type: Date, default: Date.now() }
});
module.exports = mongoose.model('GeoTags', geoTagsSchema);
