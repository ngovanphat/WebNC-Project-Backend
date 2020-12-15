const express = require("express");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const {
    authentication,
    adminAuthentication,
} = require("../middlewares/auth.mdw");
const {
    sendResetPasswordEmail,
    sendConfirmChangePasswordEmail,
    sendConfirmAccountCreatedEmail,
} = require("../middlewares/email");
const router = express.Router();
//Add user
router.post("/", async function (req, res) {
    try {
        const user = req.body;
        if (user.role === "ADMIN") {
            throw new Error("");
        }
        //có pre save bên schema rồi
        const id = await userModel.add(user);
        delete user.password;
        res.status(201).json(user);
        sendConfirmAccountCreatedEmail(req.body.email);
    } catch (error) {
        return res.status(400).send({
            error: "Invalid info.",
        });
    }
});

//get own profile
router.get("/me", authentication, async (req, res) => {
    try {
        const user = await userModel.singleById({
            _id: req.accessTokenPayload.userId,
        });
        if (user.banned) {
            return res.status(400).send({
                error: "User is banned",
            });
        }
        res.send({
            user,
        });
    } catch (error) {
        res.status(500).send();
    }
});

//get other profile
router.get("/:id", async (req, res) => {
    try {
        const user = await userModel.singleById({
            _id: req.params.id,
        });
        if (!user) {
            return res.status(400).send({
                error: "User not found",
            });
        }
        if (user.banned) {
            return res.status(400).send({
                error: "User is banned",
            });
        }
        //email = tên đăng nhập nên không trả về
        delete user.email;
        res.send({
            user,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

//Update info
router.patch("/me", authentication, async (req, res) => {
    const updates = Object.keys(req.body);
    const updatableFields = [
        "fullname",
        "avatar",
        "password",
        "currentPassword",
    ];
    const isValid = updates.every((update) => updatableFields.includes(update));

    if (!isValid) {
        return res.status(400).send({
            error: "Invalid updates.",
        });
    }

    try {
        const user = await userModel.singleById({
            _id: req.accessTokenPayload.userId,
        });

        //update basic info
        updates.forEach((update) => {
            if (update !== "password" && update !== "currentPassword") {
                //skip same info update
                if (user[update] !== req.body[update]) {
                    user[update] = req.body[update];
                }
            }
        });
        //update password
        //TODO invoke/disable accessToken after password change
        if (updates.includes("password")) {
            if (!req.body.currentPassword) {
                return res.status(400).send({
                    error: "Current password is not correct.",
                });
            }
            const checkPass = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );

            if (!checkPass) {
                return res.status(400).send({
                    error: "Current password is not correct.",
                });
            }
            user.password = req.body.password;
            sendConfirmChangePasswordEmail(user.email);
        }

        await user.save();
        res.send({
            user: user,
        });
    } catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
});

//generate reset password token
router.post("/reset-password-token", async (req, res) => {
    try {
        const token = await userModel.generateResetPasswordToken(
            req.body.email
        );
        console.log(token);
        sendResetPasswordEmail(req.body.email, token);
        res.send({
            message: "Reset password code has been sent to " + req.body.email,
        });
    } catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
});
//verify resetpasswordToken
router.post("/verify-reset", async (req, res) => {
    try {
        const user = await userModel.validateResetPasswordToken(
            req.body.email,
            req.body.token,
            false
        );
        if (!user) {
            return res.status(400).send({ error: "Incorrect token" });
        }

        res.send({ message: "Correct Token" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});
//reset password
router.post("/reset-password", async (req, res) => {
    try {
        const user = await userModel.validateResetPasswordToken(
            req.body.email,
            req.body.token,
            true
        );
        if (!user) {
            return res.status(400).send({ error: "Incorrect token" });
        }
        user.password = req.body.password;
        user.rfToken = null;
        await user.save();

        res.send({ message: "Reset password successfully" });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});
//-------ADMIN------
//Admin update info
router.patch("/admin-manage/:id", adminAuthentication, async (req, res) => {
    const updates = Object.keys(req.body);
    const updatableFields = ["banned", "role", "password"];
    const isValid = updates.every((update) => updatableFields.includes(update));

    if (!isValid) {
        return res.status(400).send({
            error: "Invalid updates.",
        });
    }

    try {
        const user = await userModel.singleById({
            _id: req.body.userId,
        });

        updates.forEach((update) => {
            if (update === "role") {
                //skip same info update
                if (
                    req.body[update] === "STUDENT" ||
                    req.body[update] === "LECTURER" ||
                    req.body[update] === "ADMIN"
                ) {
                    user[update] = req.body[update];
                }
            } else if (update === "password") {
                if (user.role !== "ADMIN") {
                    if (user[update] !== req.body[update]) {
                        user[update] = req.body[update];
                    }
                } else {
                    return res.status(400).send({
                        error: "Invalid update",
                    });
                }
            } else {
                if (user[update] !== req.body[update]) {
                    user[update] = req.body[update];
                }
            }
        });
        await user.save();
        res.send({
            user: user,
        });
    } catch (error) {
        res.status(400).send({
            error: error.message,
        });
    }
});

//get user info
router.get("/admin-manage/:id", adminAuthentication, async function (req, res) {
    try {
        const user = await userModel.singleById({
            _id: req.params.id,
        });
        if (!user) {
            return res.status(400).send({
                error: "User not found",
            });
        }
        res.send({
            user,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});
//delete user
router.delete("/admin-manage/:id", adminAuthentication, async function (req, res) {
        try {
            await userModel.delete(req.params.id);
            res.status(201).json({
                message:"Delete user "+req.params.id+" successfully"
            });
        } catch (error) {
            return res.status(400).send({
                error: error.message,
            });
        }
    }
);
//Admin add user(can add admin)
router.post("/admin-manage", adminAuthentication, async function (req, res) {
    try {
        const user = req.body;
        const id = await userModel.add(user);
        delete user.password;
        res.status(201).json(user);
    } catch (error) {
        return res.status(400).send({
            error: "Invalid info",
        });
    }
});

//Admin get User list with banned query
router.get("/admin-manage/all", adminAuthentication, async function (req, res) {
    try {
        if (req.query.type === null) {
            const users = await userModel.getAll(
                req.query.page,
                req.query.pageCount
            );
            res.status(201).json(users);
        } else {
            const users = await userModel.getAll(
                req.query.page,
                req.query.pageCount,
                req.query.type
            );
            res.status(201).json(users);
        }
    } catch (error) {
        return res.status(400).send({
            error: error.message,
        });
    }
});

// -------------ADMIN ---------------

//--------------FAVORITE COURSE----------------
router.get("/getFavoriteCourse", async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student",
            });
        } else {
            const list = await userModel.getFavoriteCourse(user._id);
            res.json(list);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
});

router.post("/addFavoriteCourse",authentication, async (req, res) => {
    try {
        const user = await userModel.singleById(req.accessTokenPayload.userId);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student",
            });
        } else
            return res.json(
                await userModel.updateFavoriteCourse(
                    req.body.userId,
                    req.body.courseId
                )
            );
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
});

router.delete("/removeFavoriteCourse",authentication, async (req, res) => {
    try {
        const user = await userModel.singleById(req.accessTokenPayload.userId);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student",
            });
        } else
            return res.json(
                await userModel.removeFavoriteCourse(
                    req.body.userId,
                    req.body.courseId
                )
            );
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
});
//----------------------------------------------
//----------------JOIN-------------------
router.post("/joinCourse",authentication, async (req, res) => {
    try {
        const user = await userModel.singleById(req.accessTokenPayload.userId);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student",
            });
        } else
            return res.json(
                await userModel.updateJoinCourse(
                    req.body.userId,
                    req.body.courseId
                )
            );
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
});

router.get("/getJoinCourse", async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student",
            });
        } else {
            const list = await userModel.getJoinCourse(user._id);
            res.json(list);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
});
//-------------------------------------------------
router.get("/getCourseList", async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if (user.role !== "LECTURER") {
            res.status(400).send({
                message: "You are not Lecturer",
            });
        } else {
            const list = await userModel.getCourseList(user._id);
            res.json(list);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
});

module.exports = router;
