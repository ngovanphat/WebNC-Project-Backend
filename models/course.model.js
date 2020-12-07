
const db = require('../utils/db');

const courseSchema = require('../schemas/course.schema');

const courseModel = db.model('course', courseSchema);

module.exports = {
    async addCourse(course){
        const courseObj = new courseModel({
            title: course.title,
            categoryId: 2,
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
            } else {
            console.log('saved successfully:', courseObj);
            }
        });
        return "successfull";
    }

};