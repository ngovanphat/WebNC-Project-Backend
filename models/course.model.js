const db = require('../utils/db');

const validator = require('validator');
const courseSchema = require('../schemas/course.schema');
const courseModel = db.model('course', courseSchema);

const categorySchema = require('../schemas/category.schema');
const categoryModel = db.model('categories', categorySchema);

module.exports = {
    async getHotCourse() {
        const list = await courseModel.find({})
            .sort({ points: -1 }).limit(5).exec();
        return list;
    },
    async getTopViewCourse() {
        const list = await courseModel.find({})
            .sort({ numberOfStudent: -1 }).limit(10).exec();
        return list;
    },
    async getNewCourse() {
        const list = await courseModel.find({})
            .sort({ last_updated: -1 }).limit(10).exec();
        return list;
    },
    async getCoursesPerPage(pageIndex, itemsPerPage) {
        const list = await courseModel.paginate({}, { offset: itemsPerPage * (pageIndex - 1), limit: itemsPerPage });
        return list;
    },
    async getCourseListByCategory(categoryName, pageIndex, itemsPerPage) {
        const list = await courseModel.paginate({ category: categoryName }, { offset: itemsPerPage * (pageIndex - 1), limit: itemsPerPage });
        return list;
    },
    async addCourse(course) {
        try {
            const courseObj = new courseModel({
                title: course.title,
                category: course.category,
                leturer: course.leturer,
                thumnail: course.thumnail,
                price: course.price,
                actualPrice: course.actualPrice,
                shortDecription: course.shortDecription,
                description: course.description,
            });
    
            await courseObj.save();

            const categoryObj = await categoryModel.update({ title: courseObj.category }, 
                { $push: { courses_list : courseObj._id } 
            });

            return courseObj._id;
        } catch (error) {
           console.log(error);
        }

    },
    async searchCourseByDescPoint(title) {
        const list = await courseModel.find({ $text: { $search: title } })
            .sort({ points: -1 }).exec();
        return list;
    },
    async searchCourseByAscPrice(title) {
        const list = await courseModel.find({ $text: { $search: title } })
            .sort({ price: 1 }).exec();
        return list;
    }
};