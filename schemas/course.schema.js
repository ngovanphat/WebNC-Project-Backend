
const { Schema } = require('../utils/db');

const courseSchema = new Schema({
    id: Schema.Types.ObjectId,
    title: String,
    category: [{ type: Schema.Types.String, ref: 'categories' }],
    leturer: String,
    points: Number,
    numberOfFeedback: Number,
    numberOfStudent: Number,
    thumnail: String,
    price: Number,
    actualPrice: Number,
    shortDecription: String,
    discription: String,
    last_updated: Number
}); 

module.exports = courseSchema;