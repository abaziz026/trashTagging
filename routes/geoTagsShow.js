const express = require('express');
const router = express.Router();
const geoTagController = require('../controllers/geoTagShowController');
router.get('/:geotagId', geoTagController.getOneTagLocation);
router.get('/?offset=*&limit=*', geoTagController.getManyTagLocation);
module.exports = router;
