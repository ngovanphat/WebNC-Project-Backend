const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
        ref: "courseSchema",
        validate(value) {
            if (this.role !== "STUDENT") {
                throw new Error(`This user tyoe can't use Favorite`);
            }
        },
    },],
    join_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseSchema",
        validate(value) {
            if (this.role !== "STUDENT") {
                throw new Error(`This user tyoe can't join course`);
            }
        },
    },],
    course_list: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "courseSchema",
        validate(value) {
            if (this.role !== "STUDENT") {
                throw new Error(`This user tyoe can't create Course`);
            }
        },
    },],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, {
    timestamps: true,
});

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.rfToken;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpires;
    delete userObject.createdAt;
    delete userObject.updatedAt;
    delete userObject.__v;

    return userObject;
};

userSchema.statics.generateResetPasswordToken = async function (email) {
    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }

    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error("Found no user with email " + email);
    }

    if (!user.isActivated) {
        throw new Error("This account has not been activated yet by the managers");
    }

    user.resetPasswordToken = {
        token: mongoose.Types.ObjectId(),
        createdAt: Date.now() / 1000,
    };

    await user.save();

    return user.resetPasswordToken.token;
};

userSchema.statics.validateResetPasswordToken = async function (
    token,
    willReset = true
) {
    const user = await User.findOne({
        "resetPasswordToken.token": token
    });

    if (!user) {
        throw new Error("Unable to find user with match token");
    }

    if (Date.now() / 1000 - user.resetPasswordToken.createdAt > 600) {
        user.resetPasswordToken = undefined;
        await user.save();

        throw new Error("Expired reset password token");
    }

    if (willReset) {
        user.resetPasswordToken = undefined;
        await user.save();
    }

    return user;
};

userSchema.statics.findByCredentials = async (email, password) => {
    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid");
    }

    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

//https://stackoverflow.com/questions/58580227/how-to-make-password-validation-in-nodejs-with-mongoose
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    next();
});

module.exports = userSchema;