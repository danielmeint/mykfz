'use strict';

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const VehicleController = require('../controllers/vehicle');

router.get('/', VehicleController.list); // List all vehicles
router.post('/', middlewares.checkAuthentication, VehicleController.create); // Create a new vehicle
router.get('/:vehicleId', VehicleController.read); // Read a vehicle by Id
router.put(
    '/:vehicleId',
    middlewares.checkAuthentication,
    VehicleController.update
); // Update a vehicle by Id
router.delete(
    '/:vehicleId',
    middlewares.checkAuthentication,
    VehicleController.remove
); // Delete a vehicle by Id

// process related
router.get('/:vehicleId/processes/', VehicleController.listProcesses); // List all processes of the vehicle
router.post(
    '/:vehicleId/processes',
    middlewares.checkAuthentication,
    VehicleController.createProcess
); // Create a new process for specified vehicle
router.get('/:vehicleId/processes/:processId', VehicleController.readProcess); // Read a specific process by vehicleId and processId
router.put('/:vehicleId/processes/:processId', VehicleController.updateProcess); // Update a specific process by vehicleId and processId

module.exports = router;
