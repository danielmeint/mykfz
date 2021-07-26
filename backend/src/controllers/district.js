'use strict';

const DistrictModel = require('../models/district');
const UserModel = require('../models/user');
const VehicleModel = require('../models/vehicle');

const read = async (req, res) => {
    try {
        let district = await DistrictModel.findById(
            req.params.districtId
        ).exec();

        if (!district)
            return res.status(404).json({
                error: 'Not Found',
                message: `District not found`
            });

        return res.status(200).json(district);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const readByUser = async (req, res) => {
    try {
        const user = req.params.user;

        let district = await DistrictModel.findOne({ user: user }).exec();

        if (!district)
            return res.status(404).json({
                error: 'Not Found',
                message: `District not found`
            });

        return res.status(200).json(district);
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
        let district = await DistrictModel.findByIdAndUpdate(
            req.params.districtId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).exec();

        return res.status(200).json(district);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const list = async (req, res) => {
    try {
        let districts = await DistrictModel.find().exec();

        return res.status(200).json(districts);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const getUsers = async (districtId) => {
    return await UserModel.find({
        $or: [
            { 'address.district': districtId, isDistrictUser: false },
            { 'address.district': districtId, isDistrictUser: null }
        ]
    });
};

const readUsers = async (req, res) => {
    try {
        const users = await getUsers(req.params.districtId);

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const getAllVehiclesForUsers = async (users) => {
    let res = [];

    for (const user of users) {
        const userId = user._id;
        const vehiclesOfUser = await VehicleModel.find({ owner: userId });
        res.push(...vehiclesOfUser);
    }

    return res;
};

const readVehicles = async (req, res) => {
    try {
        const users = await getUsers(req.params.districtId);
        const vehicles = await getAllVehiclesForUsers(users);
        return res.status(200).json(vehicles);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const readProcesses = async (req, res) => {
    try {
        const users = await getUsers(req.params.districtId);
        const vehicles = await getAllVehiclesForUsers(users);

        const processes = vehicles.map((vehicle) => vehicle.processes).flat();

        return res.status(200).json(processes);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

module.exports = {
    read,
    readByUser,
    update,
    list,
    readProcesses,
    readUsers,
    readVehicles
};
