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
    async updateCategoryByName(categoryName, category) {
        try {
            const oldCategory = await categoryModel.findOne({ title: categoryName });
            const categoryUpdated = await categoryModel.findOneAndUpdate({ title: categoryName }, {
                count: oldCategory.count + 1 || category.count
            }, { new: true });
            return categoryUpdated;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    async deleteCategory(categoryId) {
        try {
            const category = await categoryModel.findById(categoryId);
            if (category.courses_list.length !== 0) throw new Error("Can't remove category have course");
            else {
                const result = await categoryModel.findByIdAndDelete(categoryId);
                return result;
            }
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
    async getHotCategoryList() {
        try {
            let listCategory = await categoryModel.find({}).sort({ count: -1 }).select(['title', '_id', 'count']).limit(5).exec();
            return listCategory;
        } catch (error) {
            console.log(error);
        }
    },
    async getAllCategoryList() {
        try {
            let listCategory = await categoryModel.find({}).select(['title', '_id', 'count']).exec();
            return listCategory;
        } catch (error) {
            console.log(error);
        }
    }
};