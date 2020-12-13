const db = require('../utils/db');

const userSchema = require('../schemas/user.schema');
const validator = require('validator');
const { getCourseListByCategory } = require('./course.model');
const userModel = db.model('users', userSchema);

module.exports = {
    async singleById(id) {
        const user = await userModel.findOne({
            _id: id
        }).exec();
        return user;
    },
    async singleByEmail(_email) {
        if (!validator.isEmail(_email)) {
            throw new Error('Email is invalid');
        }
        const user = await userModel.findOne({
            email: _email
        }).exec();
        if (!user) {
            throw new Error('Unable to find user with email ' + email);
        }
        //console.log(user);
        return user;
    },
    updateRefreshToken(id, refreshToken) {
        return userModel.updateOne({
            _id: id
        }, {
            rfToken: {
                token: refreshToken,
                createdAt: Date.now() / 1000
            }
        });
    },
    async updateFavoriteCourse(userId, courseId) {
        return await userModel.updateOne({
            _id: userId
        }, {
            $push: { favorite_list: courseId }
        });
    },
    async updateJoinCourse(userId, courseId) {
        return await userModel.updateOne({
            _id: userId
        }, {
            $push: { join_list: courseId }
        });
    },
    async updateCourseList(userId, courseId) {
        return await userModel.updateOne({
            _id: userId
        }, {
            $push: { course_list: courseId }
        });
    },
    async getFavoriteCourse(userId) {
        const list = await userModel.find({ _id: userId }).populate('favorite_list').select('favorite_list').exec();
        return list[0];
    },
    async getJoinCourse(userId) {
        const list = await userModel.find({ _id: userId }).populate('join_list').select('join_list').exec();
        return list[0];
    },
    async getCourseList(userId) {
        const list = await userModel.find({ _id: userId }).populate('course_list').select('course_list').exec();
        return list[0];
    },
    async isRefreshTokenExisted(id, refreshToken) {
        const result = await userModel.findOne({
            _id: id,
            "rfToken.token": refreshToken
        });
        if (result === null) return false;
        return true;
    },
    async add(user) {
        try {
            //console.log(userModel.schema);
            const userObj = new userModel({
                email: user.email,
                password: user.password,
                fullname: user.fullname,
                role: user.role,
                rfToken: {
                    token: ''
                }
            });
            await userObj.save();
            return userObj._id;
        } catch (error) {
            res.status(400).send({
                error: "Invalid info" + error.message
            })
        }
    }
};