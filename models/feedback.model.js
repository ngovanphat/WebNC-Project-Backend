const db = require('../utils/db');

const feedbackSchema = require('../schemas/feedback.schema');
const feedbackModel = db.model('feedbacks',feedbackSchema);
const courseModel  = require('./course.model');

module.exports = {
   async getAll(){
       const list = feedbackModel.find();
       return list;
   },
   async add(feedback){
    try {
        const feedbackObj = feedbackModel({
            title: feedback.title,
            rating: feedback.rating,
            user: feedback.user,
            course: feedback.course
        });
        await feedbackObj.save();
        const course = await courseModel.getCourseDetail(feedback.course);
        courseModel.updateCourseDetail(course._id, {numberOfFeedback: course.numberOfFeedback + 1})
        return feedbackObj._id;
    } catch (error) {
        console.log(error);
    }
   },
   async delete(feedbackId, courseId){
    try {
        const feedback = await feedbackModel.find({_id: feedbackId, course: courseId});
       const result = await feedbackModel.findByIdAndDelete(feedbackId);
       if(result){
       courseModel.updateCourseDetail(courseId, {numberOfFeedback: feedback.length-1});
       }
       return result;
    } catch (error) {
        console.log(error);
    }
   },
   async update(feedbackId, feedback){
    try {
        const oldFeedback = await feedbackModel.findById(feedbackId);
        const feedbackUpdated = await feedbackModel.findOneAndUpdate({_id: feedbackId}, {
            title: feedback.title || oldFeedback.title,
            rating: feedback.rating || oldFeedback.rating
        },{new: true});
        return feedbackUpdated;
        
    } catch (error) {
        console.log(error);
    }
   }
};