const db = require("../utils/db");

const feedbackSchema = require("../schemas/feedback.schema");
const feedbackModel = db.model("feedbacks", feedbackSchema);
const courseModel = require("./course.model");

module.exports = {
    async getAll(page = 1, count = 10) {
        var list;
        list = await feedbackModel.paginate(
            {},
            { offset: count * (page - 1), limit: count }
        );
        return list;
    },
    async getByCourseID(courseId, page=1, count=10) {
        try {
            const list = await feedbackModel.paginate(
                {course: courseId},
                {lean: true, populate: 'user'},
                { offset: count * (page - 1), limit: count }
                )
            return list;
        } catch (error) {
            throw new Error(error);
        }
    },
    async add(feedback) {
        try {
            const feedbackObj = feedbackModel({
                title: feedback.title,
                rating: feedback.rating,
                user: feedback.user,
                course: feedback.course,
            });
            await feedbackObj.save();
            const course = await courseModel.getCourseDetail(feedback.course);
            courseModel.updateCourseDetail(course._id, {
                numberOfFeedback: course.numberOfFeedback + 1,
            });
            delete feedback.__v;
            delete feedback.updatedAt;

            return feedbackObj;
        } catch (error) {
            console.log(error);
        }
    },
    async delete(feedbackId, courseId) {
        try {
            const feedback = await feedbackModel.find({
                _id: feedbackId,
                course: courseId,
            });
            const result = await feedbackModel.findByIdAndDelete(feedbackId);
            if (result) {
                courseModel.updateCourseDetail(courseId, {
                    numberOfFeedback: feedback.length - 1,
                });
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    },
    async update(feedbackId, feedback) {
        try {
            const oldFeedback = await feedbackModel.findById(feedbackId);
            const feedbackUpdated = await feedbackModel.findOneAndUpdate(
                { _id: feedbackId },
                {
                    title: feedback.title || oldFeedback.title,
                    rating: feedback.rating || oldFeedback.rating,
                },
                { new: true }
            );
            return feedbackUpdated;
        } catch (error) {
            console.log(error);
        }
    },
    async isExisted(userId, courseId) {
        try {
            return feedbackModel
                .findOne({ course: courseId, user: userId }) === null ? true : false;
        } catch (error) {
            console.log(error);
        }
    }
};
