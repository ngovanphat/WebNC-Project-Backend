const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');

router.post('/add', async function(req, res){
    const course = req.body;
    course.id = await courseModel.addCourse(course);
    res.status(201).json(course);
})

router.get('/hot', async function(req,res){
    const list = await courseModel.getHotCourse();
    res.json(list);
})

router.get('/topView', async function(req,res){
    const list = await courseModel.getTopViewCourse();
    res.json(list);
})

router.get('/new', async function(req,res){
    const list = await courseModel.getNewCourse();
    res.json(list);
})

router.get('/get', async function(req,res){
    const list = await courseModel.getCoursesPerPage(req.query.page, req.query.size);
    res.json(list);
})

module.exports =router;