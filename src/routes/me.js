const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');
const userController = require('../app/controllers/UserController');
const meController = require('../app/controllers/MeController');

router.get('/info', authController.protect, authController.isLoggedIn, meController.info);
router.get('/trash/houses', authController.protect, authController.isLoggedIn, meController.trashHouses);
router.get('/stored/houses', authController.protect, authController.isLoggedIn, meController.storedHouses);

module.exports = router;
