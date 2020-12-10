const express = require('express');
const router = express.Router();
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');

router.post('/add', async function (req, res) {
    const category = req.body;
    category.id = await categoryModel.addCategory(category);
    res.status(201).json(category);
})

router.get('/byName', async function (req, res) {
    const categoryName = req.query.categoryName;
    let page = req.query.page;
    let page_count = req.query.page_count;
    if(!req.query.page&&!req.query.page_count){
        page = 1;
        page_count = 10;
    }
    const list = await courseModel.getCourseListByCategory(categoryName, page, page_count);
    res.json(list);
})

module.exports = router;