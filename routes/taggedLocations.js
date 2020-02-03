const express = require('express');
const router = express.Router();
const taggedLocationsController = require('../controllers/taggedLocationsController');
router.get('/taggedLocations', taggedLocationsController.getShowGeoTags);
router.get(
  '/taggedLocations/:taggedLocationId',
  taggedLocationsController.getSingleTaggedLocation
);
router.post(
  '/taggedLocations/:taggedLocationId',
  taggedLocationsController.editTaggedLocation
);

module.exports = router;
