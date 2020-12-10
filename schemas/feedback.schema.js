const { Schema } = require('../utils/db');

const feedbackSchema = new Schema({
    id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: 'title is required',
        trim: true,
    },
    rating: {
        type: Number,
        required: 'rating point is required',
        min: 0,
        max: 5
    },
    user: {
        type: Schema.Types.String, ref: 'users' 
    },
    last_updated: {
        type: Number
    }
});

module.exports = feedbackSchema;