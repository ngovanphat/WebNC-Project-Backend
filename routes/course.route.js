const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');

router.post('/add', async function (req, res) {
    const course = req.body;
    course.id = await courseModel.addCourse(course);
    res.status(201).json(course);
})

router.get('/hot', async function (req, res) {
    const list = await courseModel.getHotCourse();
    res.json(list);
})

router.get('/topView', async function (req, res) {
    const list = await courseModel.getTopViewCourse();
    res.json(list);
})

router.get('/new', async function (req, res) {
    const list = await courseModel.getNewCourse();
    res.json(list);
})

router.get('/get', async function (req, res) {
    let page = req.query.page;
    let page_count = req.query.size;
    if(!req.query.page&&!req.query.size){
        page = 1;
        page_count = 10;
    }
    const list = await courseModel.getCoursesPerPage(page, page_count);
    res.json(list);
})

router.get('/searchDescPoint', async function (req, res) {
    let searchText = req.body;
    const list = await courseModel.searchCourseByDescPoint(searchText.title);
    res.json(list);
})

router.get('/searchAscPrice', async function (req, res) {
    let searchText = req.body;
    const list = await courseModel.searchCourseByAscPrice(searchText.title);
    res.json(list);
})

module.exports = router;