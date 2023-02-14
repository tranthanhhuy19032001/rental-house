const express = require('express');
const router = express.Router();

const authController = require('../app/controllers/AuthController');
const userController = require('../app/controllers/UserController');

router.put('/:id/updateInfo', authController.protect, authController.isLoggedIn, userController.updateInfo);
router.get('/logout', authController.logout);
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
