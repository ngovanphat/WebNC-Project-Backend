const db = require('../utils/db');

const categorySchema = require('../schemas/category.schema');
const categoryModel = db.model('categories', categorySchema);

const courseSchema = require('../schemas/course.schema');
const courseModel = db.model('courses', courseSchema);

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
    async getHotCategoryList() {
        try {
            let listCategory = await categoryModel.find({}).sort({ count: -1 }).select(['title', '_id', 'count']).limit(5).exec();
            return listCategory;
        } catch (error) {
            console.log(error);
        }
    }
};