const House = require('../models/HouseModel');
const User = require('../models/UserModel');
const { mutilpleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class SiteController {
    //[GET] /
    index(req, res, next) {
        const currentUser = res.locals.user;
        House.find({})
            .then((houses) => {
                res.render('home', {
                    houses: mutilpleMongooseToObject(houses),
                    currentUser: mongooseToObject(currentUser),
                });
            })
            .catch(next);
    }

    //[GET] /huongdan
    guide(req, res, next) {
        const currentUser = res.locals.user;
        res.render('guide', {
            currentUser: mongooseToObject(currentUser),
        });
    }

    //[GET] /dangky
    register(req, res, next) {
        res.render('login/register');
    }

    //[GET] /dangky
    login(req, res, next) {
        res.render('login/login');
    }

    //[POST] /tim-kiem
    search(req, res, next) {
        // res.json(req.body);
        if (req.body.money) {
            var money = req.body.money.split('-');
            var gteMoney = parseFloat(money[0]);
            var lteMoney = parseFloat(money[1]) + 1;
        }
        if (req.body.area) {
            var area = req.body.area.split('-');
            var gteArea = parseFloat(area[0]);
            var lteArea = parseFloat(area[1]) + 1;
        }
        if (req.body.typeRoom && req.body.province && !req.body.district && !req.body.money && !req.body.area) {
            // console.log(11111111);
            House.find({ typeRoom: req.body.typeRoom, province: req.body.province })
                .then((houses) => {
                    res.render('houses/show-rental-all-houses', {
                        houses: mutilpleMongooseToObject(houses),
                    });
                })
                .catch(next);
        } else {
            if (req.body.district && req.body.money && req.body.area) {
                // console.log(222222222);
                House.find({
                    typeRoom: req.body.typeRoom,
                    province: req.body.province,
                    district: req.body.district,
                    money: { $gte: gteMoney, $lte: lteMoney },
                })
                    .then((houses) => {
                        res.render('houses/show-rental-all-houses', {
                            houses: mutilpleMongooseToObject(houses),
                        });
                    })
                    .catch(next);
            } else if (req.body.district || req.body.money || req.body.area) {
                // console.log(33333333333333333333333);
                House.find({
                    $or: [
                        { typeRoom: req.body.typeRoom, province: req.body.province, district: req.body.district },
                        {
                            typeRoom: req.body.typeRoom,
                            province: req.body.province,
                            money: { $gte: gteMoney, $lte: lteMoney },
                        },
                        {
                            typeRoom: req.body.typeRoom,
                            province: req.body.province,
                            area: { $gte: gteArea, $lte: lteArea },
                        },
                    ],
                })
                    .then((houses) => {
                        res.render('houses/show-rental-all-houses', {
                            houses: mutilpleMongooseToObject(houses),
                        });
                    })
                    .catch(next);
            } else {
                console.log('Seach Error');
                res.redirect('back');
            }
        }
    }
}

module.exports = new SiteController();
