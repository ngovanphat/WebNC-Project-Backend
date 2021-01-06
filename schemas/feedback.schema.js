const { Schema } = require('../utils/db');
const mongoosePaginate = require("mongoose-paginate-v2");

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
  course: {
    type: Schema.Types.ObjectId, ref: 'courses', required: true
  },
}, {
  timestamps: true
});

feedbackSchema.plugin(mongoosePaginate);
module.exports = feedbackSchema;