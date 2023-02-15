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

        Promise.all([housesQuery, countHouses, House.countDocumentsDeleted()]).then(([houses, count, deletedCount]) => {
            res.render('users/stored-houses', {
                deletedCount,
                houses: mutilpleMongooseToObject(houses),
                count,
                currentUser: mongooseToObject(currentUser),
            });
        });
    }

    //[GET] /me/trash/houses
    trashHouses(req, res, next) {
        const currentUser = res.locals.user;
        let houseDeletedQuery = House.findDeleted({});

        // if (req.query.hasOwnProperty('_sort')) {
        //     houseDeletedQuery.sort({
        //         [req.query.column]: req.query.type,
        //     });
        // }

        houseDeletedQuery
            .then((houses) => {
                res.render('users/trash-houses', {
                    houses: mutilpleMongooseToObject(houses),
                    currentUser: mongooseToObject(currentUser),
                });
            })
            .catch(next);
    }
}

module.exports = new MeController();
