const express = require('express');
const router = express.Router();

const siteController = require('../app/controllers/SiteController');
const authController = require('../app/controllers/AuthController');
const houseController = require('../app/controllers/HouseController');

// define the home page route
router.post('/tim-kiem', siteController.search);
router.get('/dangky', siteController.register);
router.get('/dangnhap', siteController.login);
router.get('/huongdan', authController.isLoggedIn, siteController.guide);
router.get('/cho-thue-phong-tro', authController.isLoggedIn, houseController.showRentalAllHouses);
router.get('/admin', authController.isLoggedIn, siteController.admin);
router.get('/', authController.isLoggedIn, siteController.index);

module.exports = router;
