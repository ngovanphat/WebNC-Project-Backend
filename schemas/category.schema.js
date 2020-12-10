const { Schema } = require('../utils/db');

const categorySchema = new Schema({
    id: Schema.Types.ObjectId,
    category_name: String,
}); 

module.exports = categorySchema;