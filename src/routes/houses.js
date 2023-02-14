const express = require('express');
const router = express.Router();

const houseController = require('../app/controllers/HouseController');
const authController = require('../app/controllers/AuthController');

router.put('/:id/update', authController.protect, authController.isLoggedIn, houseController.update);
router.get('/:id/edit', authController.protect, authController.isLoggedIn, houseController.edit);
router.post('/store', authController.isLoggedIn, houseController.store);
router.get('/create', authController.isLoggedIn, houseController.create);
router.get('/:slug', authController.isLoggedIn, houseController.roomDetail);

module.exports = router;
