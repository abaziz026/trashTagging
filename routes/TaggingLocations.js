const express = require('express');
const router = express.Router();
const taggedLocationsController = require('../controllers/LocationsTaggingController');


router.post(
  '/:taggedLocationId',
  taggedLocationsController.updateTaggedLocation
);
router.post(
  '/',
   taggedLocationsController.postTagLocation
  
);

module.exports = router;
