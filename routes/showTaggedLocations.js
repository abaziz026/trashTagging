const express = require('express');
const router = express.Router();
const showGeoTagController = require('../controllers/showGeoTagController');
router.get('/taggedLocations', showGeoTagController.getShowGeoTags);

module.exports = router;
