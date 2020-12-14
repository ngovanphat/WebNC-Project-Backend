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
        type: Schema.Types.ObjectId, ref: 'users', required: true
    },
    course:{
        type: Schema.Types.ObjectId, ref: 'courses', required: true
    },
    last_updated: {
        type: Number, default: Date.now()
    }
});

module.exports = feedbackSchema;