const { Schema } = require('../utils/db');

const categorySchema = new Schema({
    id: Schema.Types.ObjectId,
    title: {
        type: String,
        required: 'Category title is required',
        trim: true,
    },
    courses_list: [{type: Schema.Types.ObjectId, ref: 'courses'}]
});

module.exports = categorySchema;