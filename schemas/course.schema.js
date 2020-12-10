const { Schema } = require('../utils/db');
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
    points: Number,
    numberOfFeedback: Number,
    numberOfStudent: Number,
    thumnail: {
        type: String,
        required: 'image is required'
    },
    price: Number,
    actualPrice: Number,
    shortDecription: String,
    discription: String,
    last_updated: Number,
    videos: [{type: String}]
});

courseSchema.plugin(mongoosePaginate);

module.exports = courseSchema;