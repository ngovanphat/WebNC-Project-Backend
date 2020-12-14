const db = require('../utils/db');

const feedbackSchema = require('../schemas/feedback.schema');
const { add } = require('../schemas/feedback.schema');
const feedbackModel = db.model('feedbacks',feedbackSchema);

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
            user: feedback.user
        });
        await feedbackObj.save();
        return feedbackObj._id;
    } catch (error) {
        console.log(error);
    }
   }
};