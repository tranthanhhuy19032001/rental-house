const strftime = require('strftime');
const User = require('../models/UserModel');
const House = require('../models/HouseModel');
const { mutilpleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class MeController {
    //[GET] /me/info
    info(req, res, next) {
        const currentUser = res.locals.user;
        // res.json(currentUser);
        res.render('users/info', {
            currentUser: mongooseToObject(currentUser),
        });
    }

    //[GET] /me/stored/houses
    storedHouses(req, res, next) {
        const currentUser = res.locals.user;

        const housesQuery = House.find({ user: currentUser._id });
        const countHouses = House.countDocuments({ user: currentUser._id });

        Promise.all([housesQuery, countHouses]).then(([houses, count]) => {
            res.render('users/stored-houses', {
                houses: mutilpleMongooseToObject(houses),
                currentUser: mongooseToObject(currentUser),
                count,
            });
        });
    }
}

module.exports = new MeController();
