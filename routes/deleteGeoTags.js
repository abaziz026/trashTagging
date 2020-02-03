const express = require('express');
const router = express.Router();
const deletegeoTagController = require('../controllers/deleteGeoTagController');
router.get('/:geotagId', deletegeoTagController.deleteTagLocation);
module.exports = router;