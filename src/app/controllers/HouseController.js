const multer = require('multer');
const sharp = require('sharp');

const House = require('../models/HouseModel');
const { mutilpleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

const storage = multer.memoryStorage();

//Filter image (chua toi uu)
const multerFilter = (req, file, cb) => {
    // console.log(file.mimetype);
    if (file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(new Error('File is not image', 400), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: multerFilter,
});

class HouseController {
    //[GET] /houses/chothuephongtro
    showRentalAllHouses(req, res, next) {
        const currentUser = res.locals.user;
        House.find({})

            .then((houses) => {
                res.render('houses/show-rental-all-houses', {
                    currentUser: mongooseToObject(currentUser),
                    houses: mutilpleMongooseToObject(houses),
                });
            })
            .catch(next);
    }

    //[GET] /houses/create
    create(req, res, next) {
        const currentUser = res.locals.user;
        res.render('houses/create', {
            currentUser: mongooseToObject(currentUser),
        });
    }

    //[GET] /houses/:slug
    roomDetail(req, res, next) {
        const currentUser = res.locals.user;
        House.findOne({ slug: req.params.slug })
            .then((house) => {
                res.render('houses/room-detail', {
                    house: mongooseToObject(house),
                    currentUser: mongooseToObject(currentUser),
                });
            })
            .catch(next);
    }

    //[GET] /houses/:id/edit
    edit(req, res, next) {
        const currentUser = res.locals.user;
        House.findById(req.params.id)
            .then((house) =>
                res.render('houses/edit', {
                    house: mongooseToObject(house),
                    currentUser: mongooseToObject(currentUser),
                }),
            )
            .catch(next);
    }

    //[POST] /houses/store
    store(req, res, next) {
        upload.single('upFile')(req, res, (next) => {
            sharp(req.file.buffer)
                .resize(214, 148)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`./src/public/img/${req.file.originalname}`);

            let currentUser = res.locals.user;
            let formData = req.body;
            formData.image = req.file.originalname;

            formData.user = currentUser._id;
            const house = new House(formData);
            // console.log(house);

            house
                .save()
                .then(() => res.redirect('/'))
                .catch((error) => console.log(error));
        });
    }

    //[PUT] /houses/store
    update(req, res, next) {
        upload.single('upFile')(req, res, (next) => {
            let currentUser = res.locals.user;
            let formData = req.body;

            if (req.file) {
                sharp(req.file.buffer)
                    .resize(214, 148)
                    .toFormat('jpeg')
                    .jpeg({ quality: 90 })
                    .toFile(`./src/public/img/${req.file.originalname}`);
                formData.image = req.file.originalname;
            }

            formData.user = currentUser._id;
            House.updateOne({ _id: req.params.id }, formData)
                .then(() => res.redirect('/me/stored/houses'))
                .catch(next);
        });
    }
}

module.exports = new HouseController();
