'use strict';

const mongoose = require('mongoose');
const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });

    let user = Object.assign(req.body, {
        password: bcrypt.hashSync(req.body.password, 8)
    });

    try {
        let retUser = await UserModel.create(req.body);

        return res.status(201).json(retUser);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const read = async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.userId).exec();

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

const update = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    }

    try {
        let user = await UserModel.findByIdAndUpdate(
            req.params.userId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).exec();

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const remove = async (req, res) => {
    try {
        await UserModel.findByIdAndRemove(req.params.userId).exec();

        return res.status(200).json({
            message: `User with userId ${req.params.userId} was deleted`
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const list = async (req, res) => {
    try {
        let users = await UserModel.find().exec();

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const listLicensePlateReservations = async (req, res) => {
    try {
        let user = await UserModel.findById(req.params.userId).exec();

        if (!user)
            return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });

        return res.status(200).json(user.licensePlateReservations);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const createLicensePlateReservation = (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });

    try {
        let { userId } = req.params;
        let reservationToAdd = req.body;

        console.log(`adding reservation:`);

        UserModel.findByIdAndUpdate(
            userId,
            {
                $addToSet: { licensePlateReservations: reservationToAdd }
            },
            { safe: true, upsert: true, new: true },
            function (err, model) {
                if (err) {
                    console.err(err);
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: err.message
                    });
                } else {
                    console.log('added reservation successfully');
                    return res.status(201).json(model);
                }
            }
        );
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const deleteLicensePlateReservationByPlate = async (req, res) => {
    try {
        let { userId, plateId } = req.params;

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });
        }

        const reservation = user.licensePlateReservations.find((r) => {
            return r.licensePlate == plateId;
        });

        if (!reservation) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Reservation not found`
            });
        }

        UserModel.findById(userId).then((user) => {
            // update user
            user.licensePlateReservations
                .find((r) => {
                    return r.licensePlate == plateId;
                })
                .remove();
            user.save();
        });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const deleteLicensePlateReservation = async (req, res) => {
    try {
        let { userId, plateReservationId } = req.params;

        const user = await UserModel.findById(userId).exec();

        if (!user) {
            return res.status(404).json({
                error: 'Not Found',
                message: `User not found`
            });
        }

        const reservation = user.licensePlateReservations.find((r) => {
            return r._id == plateReservationId;
        });

        if (!reservation) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Reservation not found`
            });
        }

        UserModel.findById(userId).then((user) => {
            // update user
            user.licensePlateReservations.id(plateReservationId).remove();
            user.save();
        });

        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

module.exports = {
    create,
    read,
    update,
    remove,
    list,
    listLicensePlateReservations,
    createLicensePlateReservation,
    deleteLicensePlateReservation,
    deleteLicensePlateReservationByPlate
};
