
const { Schema } = require('../utils/db');

const courseSchema = new Schema({
    id: Object,
    title: String,
    categoryId: Number,
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