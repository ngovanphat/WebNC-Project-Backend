
const db = require('../utils/db');

const studentSchema = require('../schemas/student.schema');

const studentModel = db.model('student', studentSchema);

module.exports = {
    async singleById(id) {
        const student = await studentModel.findOne({_id: id}).exec();
        return student;
    },

    async singleByEmail(_email) {
     const student = await studentModel.findOne({email: _email}).exec();
     console.log(student);
     return student;
    },

    updateRefreshToken(id, refreshToken) {
        return studentModel.updateOne({_id: id},{rfToken: refreshToken});
    },

    async isRefreshTokenExisted(id, refreshToken){
      const result = await studentModel.findOne({_id: id, rfToken: refreshToken});
      if(result===null)return false;
      return true;
    },

    async add(user){
        const userObj = new studentModel({
            email: user.email,
            password: user.password,
            fullname: user.fullname,
            favorite_list: [],
            assign_list: [],
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