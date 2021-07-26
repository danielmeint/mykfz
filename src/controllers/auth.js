'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('../config');
const UserModel = require('../models/user');

const login = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password'))
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a password property'
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'username'))
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a username property'
        });

    try {
        let user = await UserModel.findOne({
            username: req.body.username
        }).exec();

        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!isPasswordValid) return res.status(401).send({ token: null });

        // check for private user (not district user)
        // if (user.isDistrict) return res.status(401).send({ token: null });

        // delete all old reservations
        // var now = new Date(); //

        // UserModel.find({ isDistrictUser: false }).then(function (users) {
        //     users.forEach((user) => {
        //         if (
        //             user.licensePlateReservations &&
        //             user.licensePlateReservations.length > 0
        //         ) {
        //             user.licensePlateReservations
        //                 .where('expiryDate')
        //                 .lt(now)
        //                 .remove();

        //             user.save();
        //         }
        //     });
        // });

        // UserModel.find({}).then(function (users) {
        //     users.forEach((user) => {
        //         user.licensePlateReservations
        //             .findAll((r) => {
        //                 return r.expiryDate < now;
        //             })
        //             .remove();
        //         user.save();
        //     });
        // });

        // console.log(`removing expired reservations before ${now}`);

        // UserModel.updateMany(
        //     { isDistrictUser: false },
        //     {
        //         $pullAll: {
        //             licensePlateReservations: { expiryDate: { $lte: now } }
        //         }
        //     }
        // );

        // if user is found and password is valid
        // create a token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            config.JwtSecret,
            {
                expiresIn: 86400 // expires in 24 hours
            }
        );

        return res.status(200).json({ token: token });
    } catch (err) {
        return res.status(404).json({
            error: 'User Not Found',
            message: err.message
        });
    }
};

const districtLogin = async (req, res) => {
    console.log('attemping to login district user...');

    if (!Object.prototype.hasOwnProperty.call(req.body, 'password'))
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a password property'
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'username'))
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a username property'
        });

    try {
        let user = await UserModel.findOne({
            username: req.body.username
        }).exec();

        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        if (!isPasswordValid) {
            console.log('invalid password');
            return res.status(401).send({ token: null });
        }

        // check for district user
        if (!user.isDistrictUser) {
            console.log('user found but isnt district user');
            return res.status(401).send({ token: null });
        }

        // if user is found and password is valid
        // create a token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            config.JwtSecret,
            {
                expiresIn: 86400 // expires in 24 hours
            }
        );

        return res.status(200).json({ token: token });
    } catch (err) {
        return res.status(404).json({
            error: 'User Not Found',
            message: err.message
        });
    }
};

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mikefrommykfz@gmail.com',
        pass: '+0asdQWE'
    }
});

var mailOptions = {
    from: 'mikefrommykfz@gmail.com',
    to: 'goerens.p@gmail.com',
    subject: 'Welcome to myKFZ!',
    html: { path: '../backend/resources/email-registration.html' }
};

function email(username) {
    mailOptions.to = username;
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

const register = async (req, res) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, 'password'))
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a password property'
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, 'username'))
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body must contain a username property'
        });

    let user = Object.assign(req.body, {
        password: bcrypt.hashSync(req.body.password, 8)
    });

    // can only register private users
    user.isDistrict = false;
    user.district = null;

    try {
        let retUser = await UserModel.create(user);

        // if user is registered without errors
        // create a token
        const token = jwt.sign(
            { id: retUser._id, username: retUser.username },
            config.JwtSecret,
            {
                expiresIn: 86400 // expires in 24 hours
            }
        );
        email(user.username);
        res.status(200).json({ token: token });
    } catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({
                error: 'User exists',
                message: err.message
            });
        } else {
            return res.status(500).json({
                error: 'Internal server error',
                message: err.message
            });
        }
    }
};

const me = async (req, res) => {
    try {
        let user = await UserModel.findById(req.userId).exec();
        if (!user)
            return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const logout = (req, res) => {
    res.status(200).send({ token: null });
};

module.exports = {
    login,
    districtLogin,
    register,
    logout,
    me
};
