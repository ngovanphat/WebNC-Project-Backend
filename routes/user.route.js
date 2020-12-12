const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/user.model');

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

router.post('/login', async (req, res) => {
    try {
        const getUser = await User.findByCredentials(req.body.email, req.body.password);
    } catch (error) {
        res.status(400).send({
            error
        });
    }
})


router.post('/addFavoriteCourse', async (req,res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        if(user.role !== "STUDENT"){
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else  return res.json(await userModel.updateFavoriteCourse(req.body.userId, req.body.courseId));
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

router.post('/joinCourse', async (req,res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        if(user.role !== "STUDENT"){
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else  return res.json(await userModel.updateJoinCourse(req.body.userId, req.body.courseId));
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error
        });
    }
})

router.get('/getCourseList', async (req,res) => {
    try {
        const user = await userModel.singleById(req.body.userId);
        console.log(user);
        if(user.role !== "LECTURER"){
            res.status(400).send({
                message: "You are not Lecturer"
            });
        }
        else  {
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