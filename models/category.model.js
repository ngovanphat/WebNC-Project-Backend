const db = require('../utils/db');

const categorySchema = require('../schemas/category.schema');

const categoryModel = db.model('category', categorySchema);

module.exports = {
    async addCategory(category) {
        const categoryObj = new categoryModel({
            category_name: category.name
        });

        await categoryObj.save(function (err, categoryObj) {
            if (err) {
                console.log(err);
                return null;
            } else {
                console.log('saved successfully:', categoryObj);
                return categoryObj._id;
            }
        });
    }
};