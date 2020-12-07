const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');

router.post('/add', async function(req, res){
    const course = req.body;

    course.id = await courseModel.addCourse(course);
    res.status(201).json(course);
})





module.exports =router;