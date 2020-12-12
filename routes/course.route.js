const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const userModel = require('../models/user.model');
router.post('/add', async function (req, res) {
    const userId = req.body.userId;
    const user = await userModel.singleById(userId);
    console.log(user);
    if(user.role !== "LECTURER"){
        res.status(400).send({
            message: "You are not Lecturer"
        });
    }
    else {
    let course = req.body.course;
    course.leturer = userId;
    course.id = await courseModel.addCourse(course);
    await userModel.updateCourseList(req.body.userId, course.id);
    res.status(201).json(course);
    }
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
    if (!req.query.page && !req.query.size) {
        page = 1;
        page_count = 10;
    }
    const list = await courseModel.getCoursesPerPage(page, page_count);
    res.json(list);
})

router.get('/getCourseById', async function (req, res) {
    let id = req.body.id;
    const course = await courseModel.getCourseDetail(id);
    res.json(course);
})
router.get('/getCourseSameCategory', async function (req, res) {
    let category = req.body.category;
    const course = await courseModel.getCourseSameCategory(category);
    res.json(course);
})
router.get('/searchDescPoint', async function (req, res) {
    const list = await courseModel.searchCourseByDescPoint(req.body.searchText);
    res.json(list);
})

router.get('/searchAscPrice', async function (req, res) {
    const list = await courseModel.searchCourseByAscPrice(req.body.searchText);
    res.json(list);
})

module.exports = router;