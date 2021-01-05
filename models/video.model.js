const db = require("../utils/db");

const videoSchema = require("../schemas/video.schema");
const videoModel = db.model("videos", videoSchema);
const courseModel = require("./course.model");

module.exports = {
    async getAll() {
        const list = await videoModel.find({}).exec();
        return list;
    },
    async single(videoId) {
        const video = await videoModel.findById(videoId);
        return video;
    },
    async getByCourseID(courseId) {
        try {
            const list = await videoModel.find({course: courseId}).exec();
            return list;
        } catch (error) {
            throw new Error(error);
        }
    },
    async add(video) {
        try {
            const videoObj = videoModel({
                title: video.title,
                length: video.length,
                link: video.link,
                course: video.course,
            });
            console.log(videoObj);
            await videoObj.save();
            courseModel.addVideo(video.course, videoObj._id);
            delete video.__v;
            delete video.updatedAt;

            return videoObj.id;
        } catch (error) {
            console.log(error);
        }
    },
    async delete(videoId, courseId) {
        try {
            const video = await videoModel.find({
                _id: videoId,
                course: courseId,
            });
            const result = await videoModel.findByIdAndDelete(videoId);
            if (result) {
                await courseModel.removeVideo(courseId, videoId);
            }
            return result;
        } catch (error) {
            console.log(error);
        }
    }
};
