const db = require('../utils/db');

const validator = require('validator');
const courseSchema = require('../schemas/course.schema');
const courseModel = db.model('course', courseSchema);

const categorySchema = require('../schemas/category.schema');
const { removeFavoriteCourse } = require('./user.model');
const categoryModel = db.model('categories', categorySchema);

function arrayUnique(array) {
    for (var i = 0; i < array.length; ++i) {
        for (var j = i + 1; j < array.length; ++j) {
            if (array[i].title === array[j].title)
                array.splice(j--, 1);
        }
    }
    return array;
}

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
    async getCourseDetail(id) {
        const course = await courseModel.findOne({
            _id: id
        }).exec();
        return course;
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
                {
                    $push: { courses_list: courseObj._id }
                });

            return courseObj._id;
        } catch (error) {
            console.log(error);
        }
    },
    async updateCourseDetail(courseId,course){
        try {
            const oldCourse = await courseModel.findById(courseId);
            const courseUpdated = await courseModel.findOneAndUpdate({_id: courseId}, {
                title: course.title || oldCourse.title,
                price: course.price || oldCourse.price,
                thumnail: course.thumnail || oldCourse.thumnail,
                actualPrice: course.actualPrice || oldCourse.actualPrice,
                description: course.description || oldCourse.description,
                shortDecription: course.shortDecription || oldCourse.shortDecription,
                numberOfStudent:  course.numberOfStudent || oldCourse.numberOfStudent,
                numberOfFeedback: (course.numberOfFeedback === null) ? oldCourse.numberOfFeedback : course.numberOfFeedback,
                isDone: course.isDone || oldCourse.isDone
            },{new: true});
            return courseUpdated;
            
        } catch (error) {
            console.log(error);
        }
    },
    async removeCourse(courseId){
        const result = await courseModel.findOneAndDelete({_id: courseId});
        return result;
    },
    async searchCourseByDescPoint(searchText) {
        console.log(searchText);
        let list1 = await courseModel.find({ $text: { $search: searchText } })
            .sort({ points: -1 }).exec();

        console.log(list1.length);
        let list2 = await courseModel.find({
            category: { $regex: new RegExp(`${searchText}`, 'gi') }
        }).sort({ points: -1 }).exec();
        console.log(list2.length);

        const list = arrayUnique(list1.concat(list2));
        console.log(list.length);

        return list;
    },
    async searchCourseByAscPrice(searchText) {
        console.log(searchText);
        let list1 = await courseModel.find({ $text: { $search: searchText } })
            .sort({ price: 1 }).exec();

        console.log(list1.length);
        let list2 = await courseModel.find({
            category: { $regex: new RegExp(`${searchText}`, 'gi') }
        }).sort({ price: 1 }).exec();
        console.log(list2.length);

        const list = arrayUnique(list1.concat(list2));
        console.log(list.length);

        return list;
    },
    async getCourseSameCategory(category) {
        let list = await courseModel.find({ category: category })
            .sort({ numberOfStudent: -1 })
            .limit(5)
            .exec();
        console.log(list.length);
        return list;
    }
};