const User = require('../models/UserModel');
const House = require('../models/HouseModel');
const { mutilpleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    //[PUT] /user/:id/updateInfo
    async updateInfo(req, res, next) {
        const user = await User.findById(res.locals.user);

        user.fullname = req.body.fullname;
        user.password = req.body.password;
        user.password_confirmation = req.body.password_confirmation;

        user.save()
            .then(() => res.redirect('back'))
            .catch(next);
    }
}

module.exports = new UserController();
