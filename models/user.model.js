const db = require("../utils/db");

const userSchema = require("../schemas/user.schema");
const validator = require("validator");
const { getCourseListByCategory } = require("./course.model");
const userModel = db.model("users", userSchema);
const courseModel = require("./course.model");
const categoryModel = require("./category.model");
const crypto = require("crypto-js");
module.exports = {
    async singleById(id) {
        const user = await userModel
            .findOne({
                _id: id,
            })
            .exec();
        return user;
    },
    async singleByEmail(_email) {
        if (!validator.isEmail(_email)) {
            throw new Error("Email is invalid");
        }
        const user = await userModel
            .findOne({
                email: _email,
            })
            .exec();
        if (!user) {
            throw new Error("Unable to find user with email " + email);
        }
        //console.log(user);
        return user;
    },
    async getAll(page = 1, count = 10, type = "all") {
        var list;
        console.log(type);
        if (type === "all") {
            list = await userModel.paginate(
                {},
                { offset: count * (page - 1), limit: count }
            );
        } else if (type === "banned") {
            list = await userModel.paginate(
                { banned: true },
                { offset: count * (page - 1), limit: count }
            );
        } else if (type === "unbanned") {
            list = await userModel.paginate(
                { banned: false },
                { offset: count * (page - 1), limit: count }
            );
        }
        return list;
    },
    async delete(id) {
        await userModel.deleteOne(
            {
                _id: id,
            },
            function (err) {
                if (err) throw err;
            }
        );
    },
    updateRefreshToken(id, refreshToken) {
        return userModel.updateOne(
            {
                _id: id,
            },
            {
                rfToken: {
                    token: refreshToken,
                    createdAt: Date.now() / 1000,
                },
            }
        );
    },
    async getFavoriteCourse(userId) {
        const list = await userModel
            .find({
                _id: userId,
            })
            .populate("favorite_list")
            .select("favorite_list")
            .exec();
        return list[0];
    },
    async updateFavoriteCourse(userId, courseId) {
        return await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $push: {
                    favorite_list: courseId,
                },
            }
        );
    },
    async removeFavoriteCourse(userId, courseId) {
        return await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $pull: {
                    favorite_list: courseId,
                },
            }
        );
    },
    async getJoinCourse(userId) {
        const list = await userModel
            .find({
                _id: userId,
            })
            .populate("join_list")
            .select("join_list")
            .exec();
        return list[0];
    },
    async updateJoinCourse(userId, courseId) {
        const updateStatus = await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $push: {
                    join_list: courseId,
                },
            }
        );
        if (updateStatus.n === 1 && updateStatus.ok === 1) {
            const course = await courseModel.getCourseDetail(courseId);
            await courseModel.updateCourseDetail(courseId, {
                numberOfStudent: course.numberOfStudent + 1,
            });
            await categoryModel.updateCategoryByName(course.category);
        }
        return updateStatus;
    },
    async removeJoinCourse(userId, courseId) {
        const updateStatus = await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $pull: {
                    join_list: courseId,
                },
            }
        );
        if (updateStatus.n === 1 && updateStatus.ok === 1) {
            const course = await courseModel.getCourseDetail(courseId);
            await courseModel.updateCourseDetail(courseId, {
                numberOfStudent: course.numberOfStudent - 1,
            });
            await categoryModel.updateCategoryByName(course.category);
        }
        return updateStatus;
    },
    async getCourseList(userId) {
        const list = await userModel
            .find({
                _id: userId,
            })
            .populate("course_list")
            .select("course_list")
            .exec();
        return list[0];
    },
    async updateCourseList(userId, courseId) {
        return await userModel.updateOne(
            {
                _id: userId,
            },
            {
                $push: {
                    course_list: courseId,
                },
            }
        );
    },
    async isJoin(userId, courseId) {
        const user = await userModel.findOne({
            _id: userId,
            role: "STUDENT",
            join_list: [courseId],
        });
        if (user === null) throw new Error("Invalid user.");
        return user;
    },
    async isLecturerOf(userId, courseId) {
        const user = await userModel.findOne({
            _id: userId,
            role: "LECTURER",
            "course_list._id": courseId,
        });
        if (user === null) throw new Error("Invalid user.");
        return user;
    },
    async isRefreshTokenExisted(id, refreshToken) {
        const result = await userModel.findOne({
            _id: id,
            "rfToken.token": refreshToken,
        });
        if (result === null) return false;
        return true;
    },
    async generateResetPasswordToken(email) {
        if (!validator.isEmail(email)) {
            throw new Error("Email is invalid");
        }

        const user = await userModel.findOne({
            email,
        });

        if (!user) {
            throw new Error("Found no user with email " + email);
        }

        if (user.banned) {
            throw new Error("This account is banned");
        }

        user.resetPasswordToken = {
            token: crypto.SHA1(process.env.RESET_PASSWORD_KEY + email),
            createdAt: Date.now() / 1000,
        };
        await user.save();

        return user.resetPasswordToken.token;
    },
    async validateResetPasswordToken(
        email,
        token,
        is_changing_password = true
    ) {
        const user = await userModel.findOne({
            email: email,
            "resetPasswordToken.token": token,
        });

        if (!user) {
            throw new Error("Unable to find user with matching token");
        }

        if (Date.now() / 1000 - user.resetPasswordToken.createdAt > 600) {
            user.resetPasswordToken = undefined;
            await user.save();

            throw new Error("Expired reset password token");
        }

        if (is_changing_password) {
            user.resetPasswordToken = undefined;
            await user.save();
        }

        return user;
    },
    async add(user) {
        try {
            //console.log(userModel.schema);
            const userObj = new userModel({
                email: user.email,
                password: user.password,
                fullname: user.fullname,
                role: user.role || "STUDENT",
            });
            await userObj.save();
            return userObj._id;
        } catch (error) {
            throw new Error(error.message);
        }
    },
};
