const express = require('express');
const router = express.Router();
const geoTagController = require('../controllers/geoTagController');
router.get('/geotags', geoTagController.getTagLocation);
router.post('/geotags', geoTagController.postTagLocation);
module.exports = router;
