'use strict';

const mongoose = require('mongoose');

// Define the LicensePlate schema
const LicensePlateSchema = new mongoose.Schema({
    areaCode: {
        type: String,
        required: true
    },
    letters: {
        type: String,
        required: true
    },
    digits: {
        type: Number,
        required: true
    }
});

LicensePlateSchema.set('versionKey', false);

// Export the LicensePlate model
module.exports = mongoose.model('LicensePlate', LicensePlateSchema);
