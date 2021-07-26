'use strict';

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const AuthController = require('../controllers/auth');

router.post('/login', AuthController.login);
router.post('/districtLogin', AuthController.districtLogin);
router.post('/register', AuthController.register);
router.get('/me', middlewares.checkAuthentication, AuthController.me);
router.get('/logout', middlewares.checkAuthentication, AuthController.logout);

module.exports = router;
