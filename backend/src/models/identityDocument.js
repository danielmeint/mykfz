'use strict';

const mongoose = require('mongoose');

const IdentityDocumentSchema = mongoose.Schema({
    nfcId: String,
    idId: {
        type: String,
        required: true
    }, // e.g., LF3033PHJ
    expirationDate: Date // todo should be required
});

module.exports = { IdentityDocumentSchema };
