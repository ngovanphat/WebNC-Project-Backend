const db = require('../utils/db');

const leturerSchema = require('../schemas/leturer.schema');

const leturerModel = db.model('leturer', leturerSchema);

module.exports = {
    async singleById(id) {
        const leturer = await leturerModel.findOne({ _id: id }).exec();
        return leturer;
    },

    async singleByUsername(_username) {
        const leturer = await leturerModel.findOne({ username: _username }).exec();
        console.log(leturer);
        return leturer;
    },

    updateRefreshToken(id, refreshToken) {
        return leturerModel.updateOne({ _id: id }, { rfToken: refreshToken });
    },

    async isRefreshTokenExisted(id, refreshToken) {
        const result = await leturerModel.findOne({ _id: id, rfToken: refreshToken });
        if (result === null) return false;
        return true;
    },

    async addLeturer(user) {
        const userObj = new leturerModel({
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            description: '',
            avatar: '',
            courses_list: [],
            rfToken: ''
        });

        await userObj.save(function (err, userObj) {
            if (err) {
                console.log(err);
            } else {
                console.log('saved successfully:', userObj);
            }
        });
        return "successfull";
    }
};