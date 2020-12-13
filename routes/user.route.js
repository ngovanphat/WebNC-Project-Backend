const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');
const {
    authentication
} = require('../middlewares/auth.mdw');

const router = express.Router();
//Add user
//TODO correct error thrown
router.post('/', async function (req, res) {
    try {
        const user = req.body;
        //có pre save bên schema rồi
        const id = await userModel.add(user);
        if (id == null) {
            return res.status(400).send({
                error: "invalid info"
            });
        }
        delete user.password;
        res.status(201).json(user);
    } catch (error) {
        return res.status(400).send({
            error: "invalid info"
        });
    }
})

//get own profile
router.get('/me', authentication, async (req, res) => {
    try {
        const user = await userModel.singleById({
            _id: req.accessTokenPayload.userId
        });
        if (user.banned) {
            return res.status(400).send({
                error: "User is banned"
            });
        }
        res.send({
            user
        });
    } catch (error) {
        res.status(500).send();
    }
})

//get other profile
router.get('/:id', async (req, res) => {
    try {
        const user = await userModel.singleById({
            _id: req.params.id
        });
        if (!user) {
            return res.status(400).send({
                error: 'User not found'
            });
        }
        if (user.banned) {
            return res.status(400).send({
                error: "User is banned"
            });
        }
        //email = tên đăng nhập nên không trả về
        delete user.email
        res.send({
            user
        });
    } catch (error) {
        res.status(500).send({
            error: error.message
        });
    }
})

//Update info
router.patch('/me', authentication, async (req, res) => {
    const updates = Object.keys(req.body);
    const updatableFields = ['fullname', 'avatar', 'password', 'currentPassword'];
    const isValid = updates.every(update => updatableFields.includes(update));

    if (!isValid) {
        return res.status(400).send({
            error: 'Invalid updates.'
        });
    }

    try {
        const user = await userModel.singleById({
            _id: req.accessTokenPayload.userId
        });

        //update basic info
        updates.forEach(update => {
            if (update !== 'password' && update !== 'currentPassword') {
                //skip same info update
                if (user[update] !== req.body[update]) {
                    user[update] = req.body[update];
                }
            }
        });
        //update password
        //TODO invoke/disable accessToken after password change
        if (updates.includes('password')) {

            if (!req.body.currentPassword) {
                return res.status(400).send({
                    error: 'Current password is not correct.'
                });
            }
            const checkPass = await bcrypt.compare(req.body.currentPassword, user.password);
            console.log("reached " + req.body.password);

            if (!checkPass) {
                return res.status(400).send({
                    error: 'Current password is not correct.'
                });
            }
            user.password = req.body.password;
        }

        await user.save();
        res.send({
            user: user
        });
    } catch (error) {
        res.status(400).send({
            error: error.message
        });
    }
});

//Reset password

//Get resetpasswordToken

//-------ADMIN------
//Admin update info

//Admin add user(can add admin)

//Admin get User list

//Admin get banned user list

router.post('/addFavoriteCourse', async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else return res.json(await userModel.updateFavoriteCourse(req.body.userId, req.body.courseId));
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

router.post('/joinCourse', async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else return res.json(await userModel.updateJoinCourse(req.body.userId, req.body.courseId));
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

router.get('/getFavoriteCourse', async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else {
            const list = await userModel.getFavoriteCourse(user._id);
            res.json(list);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

router.get('/getJoinCourse', async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else {
            const list = await userModel.getJoinCourse(user._id);
            res.json(list);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

router.get('/getCourseList', async (req, res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if (user.role !== "LECTURER") {
            res.status(400).send({
                message: "You are not Lecturer"
            });
        }
        else {
            const list = await userModel.getCourseList(user._id);
            res.json(list);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

module.exports = router;