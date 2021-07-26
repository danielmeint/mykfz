'use strict';

const VehicleModel = require('../models/vehicle');
const UserModel = require('../models/user');

const create = async (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });

    try {
        let vehicle = await VehicleModel.create(req.body);

        return res.status(201).json(vehicle);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const read = async (req, res) => {
    try {
        let vehicle = await VehicleModel.findById(req.params.vehicleId).exec();

        if (!vehicle)
            return res.status(404).json({
                error: 'Not Found',
                message: `Vehicle not found`
            });

        return res.status(200).json(vehicle);
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
        let vehicle = await VehicleModel.findByIdAndUpdate(
            req.params.vehicleId,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).exec();

        return res.status(200).json(vehicle);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const remove = async (req, res) => {
    try {
        await VehicleModel.findByIdAndRemove(req.params.vehicleId).exec();

        return res.status(200).json({
            message: `Vehicle with vehicleId ${req.params.vehicleId} was deleted`
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
        let filter = req.query;

        let vehicles = await VehicleModel.find(filter).exec();

        return res.status(200).json(vehicles);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message
        });
    }
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mikefrommykfz@gmail.com',
        pass: '+0asdQWE'
    }
});

const mailApprovedOptions = {
    from: 'Mike from myKFZ <mikefrommykfz@gmail.com>',
    to: '',
    subject: 'Process approval myKFZ',
    html: { path: '../backend/resources/email-approval.html' }
};
const mailRejectedOptions = {
    from: 'Mike from myKFZ <mikefrommykfz@gmail.com>',
    to: '',
    subject: 'Process rejection myKFZ',
    html: { path: '../backend/resources/email-rejection.html' }
};

function email(username, approved) {
    if (approved) {
        mailApprovedOptions.to = username;
        transporter.sendMail(mailApprovedOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } else {
        mailRejectedOptions.to = username;
        transporter.sendMail(mailRejectedOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
}

const createProcess = (req, res) => {
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });

    try {
        let { vehicleId } = req.params;
        let processToAdd = req.body;

        // for some reason this is executed twice; addToSet avoids duplicates
        VehicleModel.findByIdAndUpdate(
            vehicleId,
            {
                $addToSet: { processes: processToAdd }
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
                    console.log('added process successfully');
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

const readProcess = async (req, res) => {
    try {
        let { vehicleId, processId } = req.params;

        let vehicle = await VehicleModel.findById(vehicleId).exec();

        if (!vehicle) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Vehicle not found`
            });
        }

        let process = vehicle.processes.find((p) => p._id == processId);

        if (!process) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Process not found`
            });
        }

        return res.status(200).json(process);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const updatedProcess = (oldProcess, newProcess) => {
    for (const key in newProcess) {
        if (key in oldProcess) {
            oldProcess[key] = newProcess[key];
        }
    }
    return oldProcess;
};

const wasAccepted = (processUpdate) => {
    return processUpdate.state == 'ACCEPTED';
};

const updateProcess = async (req, res) => {
    try {
        let { vehicleId, processId } = req.params;

        let processUpdate = req.body;

        const vehicle = await VehicleModel.findById(vehicleId).exec();
        const user = await UserModel.findById(vehicle.owner).exec();

        if (!vehicle) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Vehicle not found`
            });
        }

        const process = vehicle.processes.find((p) => p._id == processId);

        if (!process) {
            return res.status(404).json({
                error: 'Not Found',
                message: `Process not found`
            });
        }

        const newProcess = updatedProcess(process, processUpdate);

        VehicleModel.findById(vehicleId).then((vehicle) => {
            // update process
            const process = vehicle.processes.id(processId);
            process.set(newProcess);

            console.log('process set');

            // update state and licensePlate
            if (wasAccepted(processUpdate)) {
                email(user.username, true);
                if (newProcess.processType == 'REGISTRATION') {
                    vehicle.state = 'REGISTERED';
                    vehicle.licensePlate = newProcess.info.licensePlate;
                } else if (newProcess.processType == 'DEREGISTRATION') {
                    const owner = vehicle.owner;
                    const oldPlate = vehicle.licensePlate;

                    // if (oldPlate && newProcess.reservePlate) {
                    //     // create plate reservation
                    //     console.log(`adding reservation for plate ${oldPlate}`);
                    //     UserModel.findByIdAndUpdate(vehicle.owner, {
                    //         $addToSet: {
                    //             licensePlateReservations: {
                    //                 licensePlate: oldPlate,
                    //                 expiry: Date.today().add({ days: +90 })
                    //             }
                    //         }
                    //     });
                    // }
                    vehicle.state = 'DEREGISTERED';
                    vehicle.licensePlate = null;
                }
            } else {
                email(user.username, false);
            }
            return vehicle.save();
        });

        // let newProcess = await VehicleModel.findByIdAndUpdate(
        //     processId,
        //     req.body,
        //     {
        //         new: true,
        //         runValidators: true
        //     }
        // ).exec();

        // console.log(newProcess);

        return res.status(200).json(newProcess);
    } catch (err) {
        return res.status(500).json({
            error: 'Internal Server Error',
            message: err.message
        });
    }
};

const listProcesses = async (req, res) => {
    try {
        let vehicle = await VehicleModel.findById(req.params.vehicleId).exec();

        if (!vehicle)
            return res.status(404).json({
                error: 'Not Found',
                message: `Vehicle not found`
            });

        return res.status(200).json(vehicle.processes);
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
    createProcess,
    readProcess,
    updateProcess,
    listProcesses
};
