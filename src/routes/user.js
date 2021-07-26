'use strict';

const express = require('express');
const router = express.Router();
const middlewares = require('../middlewares');

const UserController = require('../controllers/user');

router.get('/', UserController.list); // List all users
router.post('/', UserController.create); // Create a new user
router.get('/:userId', UserController.read); // Read a user by Id
router.put('/:userId', UserController.update); // Update a user by Id
router.delete('/:userId', UserController.remove); // Delete a user by Id

// license plate reservations
router.get(
    '/:userId/licensePlateReservations',
    UserController.listLicensePlateReservations
); // List all licensePlate Reservations for a user
router.post(
    '/:userId/licensePlateReservations',
    middlewares.checkAuthentication,
    UserController.createLicensePlateReservation
); // Create a new licensePlateReservation for specified user
router.delete(
    '/:userId/licensePlateReservations/:plateReservationId',
    middlewares.checkAuthentication,
    UserController.deleteLicensePlateReservation
); // delete licensePlateReservation for specified user, licenseplate still exist in own table
router.delete(
    '/:userId/licensePlateReservations/plate/:plateId',
    middlewares.checkAuthentication,
    UserController.deleteLicensePlateReservationByPlate
); // delete licensePlateReservation for specified user, licenseplate still exist in own table
module.exports = router;
