const db = require('../utils/db');

const categorySchema = require('../schemas/category.schema');
const categoryModel = db.model('categories', categorySchema);

module.exports = {
    async addCategory(category) {
        try {
            const categoryObj = categoryModel({
                title: category.title
            });
            await categoryObj.save();
            return categoryObj._id;
        } catch (error) {
            console.log(error);
        }
    },
};