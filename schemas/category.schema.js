const mongoose = require("mongoose");
const { Schema } = require('../utils/db');

const validator = require("validator");

const categorySchema = new mongoose.Schema({
    id: Schema.Types.ObjectId,
    title: {
        type: Schema.Types.String,
    },
    courses_list: [{ type: Schema.Types.ObjectId, ref: 'courses' }],
    count: Number
});

categorySchema.methods.toJSON = function () {
    const category = this;
    const categoryObject = category.toObject();
    return categoryObject;
};

module.exports = categorySchema;