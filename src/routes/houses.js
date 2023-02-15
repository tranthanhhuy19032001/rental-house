const express = require('express');
const router = express.Router();

const houseController = require('../app/controllers/HouseController');
const authController = require('../app/controllers/AuthController');

router.post('/handle-form-action', houseController.handleFormAction);
router.delete('/:id/force', authController.protect, authController.isLoggedIn, houseController.forceDestroy);
router.patch('/:id/restore', authController.protect, authController.isLoggedIn, houseController.restore);
router.delete('/:id', authController.protect, authController.isLoggedIn, houseController.destroy);
router.put('/:id/update', authController.protect, authController.isLoggedIn, houseController.update);
router.get('/:id/edit', authController.protect, authController.isLoggedIn, houseController.edit);
router.post('/store', authController.isLoggedIn, houseController.store);
router.get('/create', authController.isLoggedIn, houseController.create);
router.get('/:slug', authController.isLoggedIn, houseController.roomDetail);

module.exports = router;
