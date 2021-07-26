'use strict';

const mongoose = require('mongoose');

// Define the Vehicle schema
const VehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    vin: {
        type: String,
        unique: true,
        required: true,
        dropDups: true
    },
    make: {
        type: String,
        required: false
    },
    model: {
        type: String,
        required: false
    },
    licensePlate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LicensePlate',
        required: false
    },
    state: {
        type: String,
        enum: ['NEW', 'REGISTERED', 'DEREGISTERED'],
        required: true
    }, // new / registered / deregistered
    generalInspectionMonth: String,
    generalInspectionYear: String,
    processes: [
        {
            processType: {
                type: String,
                enum: ['REGISTRATION', 'DEREGISTRATION'],
                required: true
            },
            date: Date,
            state: {
                type: String,
                enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
                required: true
            },
            info: Object
        }
    ]
});

VehicleSchema.set('versionKey', false);
// VehicleSchema.set("timestamps", true);

// Export the Vehicle model
module.exports = mongoose.model('Vehicle', VehicleSchema);
