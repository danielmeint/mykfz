'use strict';

const mongoose = require('mongoose');

// {
//     "_id": "60c20db80271fcbb053ad4ac",
//     "name": "Städteregion Aachen",
//     "kfz": ["AC", "MON"],
//     "picture": "https://upload.wikimedia.org/wikipedia/commons/f/fb/DEU_Staedteregion_Aachen_COA.svg"
// }

// Define the District schema
const DistrictSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    areaCode: [
        {
            type: String
        }
    ],
    picture: {
        type: String,
        required: true
    }
});

DistrictSchema.set('versionKey', false);

// Export the District model
module.exports = mongoose.model('District', DistrictSchema);
