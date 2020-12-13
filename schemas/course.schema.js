const { Schema } = require('../utils/db');
const validator = require('validator');

const mongoosePaginate = require("mongoose-paginate-v2");

const courseSchema = new Schema({
    id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: 'title is required'
    },
    category: { type: Schema.Types.String, ref: 'categories' },
    leturer: {
        type: Schema.Types.ObjectId,
        required: 'leturer is required',
        ref: 'users'
    },
    points: {
        type: Number,
        default: 5
    },
    numberOfFeedback: {
        type: Number,
        default: 0
    },
    numberOfStudent: {
        type: Number,
        default: 0
    },
    thumnail: {
        type: String,
        trim: true,
        default: "https://i.imgur.com/Xp51vdM.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Avatar URL is invalid");
            }
        },
    },
    price: Number,
    actualPrice: Number,
    shortDecription: String,
    description: String,
    last_updated: {
        type: Number,
        default: Date.now()
    },
    videos: [{ type: String }]
});

courseSchema.index({ title: 'text' });
courseSchema.plugin(mongoosePaginate);

module.exports = courseSchema;