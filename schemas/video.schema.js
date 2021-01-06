const mongoose = require("mongoose");
const { Schema } = require('../utils/db');
const validator = require('validator');

const videoSchema = new mongoose.Schema({
  id: Schema.Types.ObjectId,
  title: {
    type: Schema.Types.String,
    required: true
  },
  length: {
    type: Schema.Types.String,
    required: true
  },
  link: {
    type: Schema.Types.String,
    required: true
  },
  course: { type: Schema.Types.ObjectId, ref: 'courses', required: true }
}, {
  timestamps: true,
});


module.exports = videoSchema;