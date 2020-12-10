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
    const list = await courseModel.getCourseListByCategory(categoryName);
    res.json(list);
})

module.exports = router;