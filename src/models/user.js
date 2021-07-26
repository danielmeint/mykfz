'use strict';
const AddressSchema = require('./address');
const IdentityDocumentSchema = require('./identityDocument');

const mongoose = require('mongoose');

// Define the user schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isDistrictUser: {
        type: Boolean,
        required: true
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: false
    },
    address: {
        type: AddressSchema,
        required: false
    },
    identityDocument: {
        type: IdentityDocumentSchema,
        required: false
    },
    licensePlateReservations: [
        {
            licensePlate: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'LicensePlate',
                required: true
            },
            expiryDate: Date
        }
    ]
});

UserSchema.set('versionKey', false);

// Export the User model
module.exports = mongoose.model('User', UserSchema);
