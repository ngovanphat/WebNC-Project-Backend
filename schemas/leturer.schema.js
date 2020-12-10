const { Schema } = require('../utils/db');

const leturerSchema = new Schema({
    id: Object,
    username: String,
    password: String,
    fullname: String,
    description: String,
    avatar: String,
    courses_list: Array,
    rfToken: String 
}); 

module.exports = leturerSchema;