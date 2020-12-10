const db = require('../utils/db');

const userSchema = require('../schemas/user.schema');

const userModel = db.model('users', userSchema);

module.exports = {
    async singleById(id) {
        const user = await userModel.findOne({ _id: id }).exec();
        return user;
    },

    async singleByEmail(_email) {
        const user = await userModel.findOne({ email: _email }).exec();
        console.log(user);
        return user;
    },

    updateRefreshToken(id, refreshToken) {
        return userModel.updateOne({ _id: id }, { rfToken: refreshToken });
    },

    async isRefreshTokenExisted(id, refreshToken) {
        const result = await userModel.findOne({ _id: id, rfToken: refreshToken });
        if (result === null) return false;
        return true;
    },

    async add(user) {
        console.log(userModel.schema);
        const userObj = new userModel({
            email: user.email,
            password: user.password,
            fullname: user.fullname,
            role: user.role,
            avatar: '',
            description: '',
            favorite_list: [],
            join_list: [],
            course_list: [],
            rfToken: ''
        });
        await userObj.save(function (err, userObj) {
            if (err) {
                console.log(err);
            } else {
                console.log('saved successfully:', userObj);
                return userObj._id;
            }
        });
    }
};