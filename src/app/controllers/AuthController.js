const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/UserModel');

const signToken = (id) => jwt.sign({ id }, 'secret', { expiresIn: 60 * 60 });

//

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();

const createSendToken = (user, req, res, next) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 60 * 60 * 60 * 24 * 7),
        httpOnly: true,
    };
    res.locals.user = user;
    // user.password = undefined;
    res.cookie('access_token', token, cookieOptions);

    if (user.role === 'admin' && user.email === 'admin@gmail.com') {
        // res.redirect('/cho-thue-phong-tro');
        res.render('admin/admin');
        return;
    }
    res.redirect('/');
};

class AuthController {
    //[POST] /user/signup
    async register(req, res, next) {
        // res.json(req.body);
        const { name, email, password, passwordConfirm } = req.body;

        // const emailEx = await User.findOne({ email });

        if (await User.findOne({ email })) {
            // return next(new Error('Email existed! Please enter difference email', 400));
            req.flash('error', 'Email này đã được sử dụng, vui lòng chọn email khác!');
            res.render('login/register', {
                message: req.flash('error'),
            });
            return;
        }
        if (await (req.body.password != req.body.password_confirmation)) {
            return next(new Error('Password is difference with Password Confirm', 401));
        }
        // const newUser = await User.create(req.body);
        // User.create(req.body);
        if (email === 'admin@gmail.com') {
            req.body = { ...req.body, ...{ role: 'admin' } };
        }
        User.create(req.body);
        req.body.password = undefined;
        req.body.password_confirmation = undefined;
        req.flash('success', 'Tạo tài khoản của bạn đã được tạo thành công');
        res.render('login/login', {
            succcessRegister: req.flash('success'),
        });
    }

    async isLoggedIn(req, res, next) {
        // console.log('req.cookies.access_token: ', req.cookies.access_token);
        if (req.cookies.access_token) {
            try {
                //1) Verification token
                const decoded = await promisify(jwt.verify)(req.cookies.access_token, 'secret');
                // console.log(decoded);
                //2) Check if user still exist
                const currentUser = await User.findById(decoded.id);
                if (!currentUser) {
                    next();
                }
                //3) Check if user changed password after the token was issued
                // if (currentUser.changedPasswordAfter(decoded.iat)) {
                //   next();
                // }
                req.user = currentUser;
                res.locals.user = currentUser;

                return next();
            } catch (err) {
                // console.log(err);
                return next();
            }
        }
        next();
    }

    async protect(req, res, next) {
        // console.log('3 protect');
        try {
            let token;
            // 1) Getting token and check it's there.
            if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
                token = req.headers.authorization.split(' ')[1];
                // console.log('token: ', token);
            } else if (req.cookies.access_token) {
                token = req.cookies.access_token;
            }
            // console.log(token);
            if (token === null || token === undefined) {
                console.log('not exist token');
                return res.render('login/login');
            }
            //2) Verification token
            const decoded = await promisify(jwt.verify)(token, 'secret');
            // console.log(decoded);

            //3) Check if user still exist
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return res.render('login/login');
            }

            //4) Check if user changed password after the token was issued
            // if (currentUser.changedPasswordAfter(decoded.iat)) {
            //   return res.render('/dangnhap')
            // }
            req.user = currentUser;
            // console.log(req.user);
            res.locals.user = currentUser;

            return next();
        } catch (err) {
            return next();
        }
    }

    //[POST] /user/login
    async login(req, res, next) {
        const { email, password } = req.body;
        //1)Check if email and password exist
        if (!email || !password) {
            return res.render('login/login-failed');
        }
        //2)Check if user exists && password are correct
        const user = await User.findOne({ email }).select('+password');
        // console.log(user);
        if (!user) {
            return res.render('login/login-failed');
        }
        //error: because if User.findOne({ email }).select('+password') NOT EXIST
        // const correct = await user.correctPassword(password, user.password);
        if (!email || !(await user.correctPassword(password, user.password))) {
            // return next(new Error("Email or Password are not correct", 401));
            return res.render('login/login-failed');
        }
        //3) If everything is OK, send token to client
        createSendToken(user, req, res, next);
    }

    //[GET] /user/logout
    logout(req, res, next) {
        res.clearCookie('access_token');
        // res.json({ message: 'Successfully logged out!' });
        res.redirect('/');
    }
}

module.exports = new AuthController();
