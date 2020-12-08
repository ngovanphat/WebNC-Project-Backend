
const db = require('../utils/db');

const courseSchema = require('../schemas/course.schema');

const courseModel = db.model('course', courseSchema);

module.exports = {
    async getHotCourse() {
        const list = await courseModel.find({})
        .sort({points: -1}).limit(5).exec();
        return list;
    },
    async getTopViewCourse() {
        const list = await courseModel.find({})
        .sort({numberOfStudent: -1}).limit(10).exec();
        return list;
    },
    async getNewCourse() {
        const list = await courseModel.find({})
        .sort({last_updated: -1}).limit(10).exec();
        return list;
    },
    async addCourse(course){
        const courseObj = new courseModel({
            title: course.title,
            category: course.category,
            leturer: course.leturer,
            points: 5,
            numberOfFeedback: 0,
            numberOfStudent: 0,
            thumnail: '',
            price: course.price,
            actualPrice: course.actualPrice,
            shortDecription: course.shortDecription,
            discription: course.description,
            last_updated: Date.now()
        });
        
        await courseObj.save(function (err, courseObj) {
            if (err) {
            console.log(err);
            return null;
            } else {
            console.log('saved successfully:', courseObj);
            return courseObj._id;
            }
        });
        
    }

};