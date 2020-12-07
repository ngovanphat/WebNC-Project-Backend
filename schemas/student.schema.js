
const { Schema } = require('../utils/db');

const studentSchema = new Schema({
    id: Object,
    email: String,
    password: String,
    fullname: String,
    favorite_list: Array,
    assign_list: Array,
    rfToken: String 
}); 

module.exports = studentSchema;