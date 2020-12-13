const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid");
            }
        },
    },
    avatar: {
        type: String,
        trim: true,
        default: "https://i.imgur.com/Xp51vdM.png",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Avatar URL is invalid");
            }
        },
    },
    description: {
        type: String,
        default: "",
    },
    fullname: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        /* validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password can not contain "password"');
      }
    } */
    },
    rfToken: {
        token: {
            type: String,
        },
        createdAt: {
            type: Number,
            default: Date.now() / 1000,
            //timestamp in seconds
        },
    },
    banned: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        required: true,
        default: "STUDENT",
        validate(value) {
            if (value !== "STUDENT" && value !== "LECTURER" && value !== "ADMIN") {
                throw new Error("Not a valid role");
            }
        },
    },
    favorite_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        validate(value) {
            if (this.role !== "STUDENT") {
                throw new Error(`This user type can't use Favorite`);
            }
        },
    },],
    join_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        validate(value) {
            if (this.role !== "STUDENT") {
                throw new Error(`This user type can't join course`);
            }
        },
    },],
    course_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courses",
        validate(value) {
            if (this.role !== "LECTURER") {
                throw new Error(`This user type can't create Course`);
            }
        },
    },],
    resetPasswordToken:{
        token: {
            type: String,
        },
        createdAt: {
            type: Number,
            default: Date.now() / 1000,
            //timestamp in seconds
        },
    },
}, {
    timestamps: true,
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.rfToken;
    delete userObject.resetPasswordToken;
    delete userObject.createdAt;
    delete userObject.updatedAt;
    delete userObject.__v;

    return userObject;
};


//https://stackoverflow.com/questions/58580227/how-to-make-password-validation-in-nodejs-with-mongoose
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

userSchema.plugin(mongoosePaginate);
module.exports = userSchema;