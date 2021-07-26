'use strict';

const LicensePlateModel = require('../models/licensePlate');
const LicensePlateService = require('../libs/licensePlateService');

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });

    try {
        let licensePlate = req.body;
        let response = await LicensePlateModel.create({
            areaCode: licensePlate.areaCode,
            letters: licensePlate.letters,
            digits: licensePlate.digits
        });

        return res.status(201).json(response);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const read = async (req, res) => {
    try {
        let licensePlate = await LicensePlateModel.findById(
            req.params.licensePlateId
        ).exec();

        if (!licensePlate)
            return res.status(404).json({
                error: 'Not Found',
                message: `licensePlate not found`
            });

        return res.status(200).json(licensePlate);
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
        let licensePlate = await LicensePlateModel.findByIdAndUpdate(
            req.params.licensePlateId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).exec();

        return res.status(200).json(licensePlate);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const remove = async (req, res) => {
    try {
        await LicensePlateModel.findByIdAndRemove(
            req.params.licensePlateId
        ).exec();

        return res.status(200).json({
            message: `licensePlate with licensePlateId ${req.params.licensePlateId} was deleted`
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
        let filter = req.query; // e.g. { district: '60c20db80271fcbb053ad4aa', owner: '60b9afdadad5b31be63de066' }

        let licensePlates = await LicensePlateModel.find(filter).exec();

        return res.status(200).json(licensePlates);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const listAllCombinations = (req, res) => {
    let { areaCode, letters, digits } = req.query;
    if (!(areaCode && letters && digits)) {
        return res.status(400).json({
            error: 'Bad Request',
            message:
                'areaCode, letters, digits are required as query parameters'
        });
    }

    const allPlateCombinations =
        LicensePlateService.generatePlatesMatchingPattern(
            areaCode,
            letters,
            digits
        );

    return res.status(200).json(allPlateCombinations);
};

const listAvailableCombinations = async (req, res) => {
    let { areaCode, letters, digits } = req.query;
    if (!(areaCode && letters && digits)) {
        return res.status(400).json({
            error: 'Bad Request',
            message:
                'areaCode, letters, digits are required as query parameters'
        });
    }

    const allPlateCombinations =
        await LicensePlateService.getAvailablePlatesMatchingPattern(
            areaCode,
            letters,
            digits
        );

    return res.status(200).json(allPlateCombinations);
};

module.exports = {
    create,
    read,
    update,
    remove,
    list,
    listAllCombinations,
    listAvailableCombinations
};
