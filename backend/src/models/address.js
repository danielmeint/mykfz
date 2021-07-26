'use strict';

const mongoose = require('mongoose');

const AddressSchema = mongoose.Schema({
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'District',
        required: true
    },
    zipCode: String,
    city: String,
    street: String,
    houseNumber: String
});

module.exports = { AddressSchema };
