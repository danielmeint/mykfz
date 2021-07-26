'use strict';

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const DistrictController = require('../controllers/district');

router.get('/', DistrictController.list); // List all districts
router.get('/user/:user', DistrictController.readByUser); // Read a district by associated user
router.get('/:districtId', DistrictController.read); // Read a district by Id
router.put(
    '/:districtId',
    middlewares.checkAuthentication,
    DistrictController.update
); // Update a district by Id
router.get('/:districtId/processes', DistrictController.readProcesses); // Read processes related to district
router.get('/:districtId/users', DistrictController.readUsers); // Read users related to district
router.get('/:districtId/vehicles', DistrictController.readVehicles); // Read vehicles related to district

module.exports = router;
