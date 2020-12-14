const express = require('express');
const router = express.Router();
const categoryModel = require('../models/category.model');
const courseModel = require('../models/course.model');
const {adminAuthentication}  = require('../middlewares/auth.mdw');

router.post('/',adminAuthentication ,async function (req, res) {
    const category = req.body;
    category.id = await categoryModel.addCategory(category);
    res.status(201).json(category);
})

router.patch('/:categoryName', async function(req, res){
    try {
    const result = await categoryModel.updateCategoryByName(req.params.categoryName,req.body);
    res.json(result);
    }
    catch (error){
        console.log(error);
        res.status(400).json(error);
    }
})

router.delete('/:id',adminAuthentication, async function(req, res){
    try {
    const result = await categoryModel.deleteCategory(req.params.id,req.body);
    res.json(result);
    }
    catch (error){
        console.log(error);
        res.status(400).json({error});
    }
})

router.get('/byName', async function (req, res) {
    const categoryName = req.query.categoryName;
    let page = req.query.page;
    let page_count = req.query.page_count;
    if (!req.query.page && !req.query.page_count) {
        page = 1;
        page_count = 10;
    }
    const list = await courseModel.getCourseListByCategory(categoryName, page, page_count);
    res.json(list);
})

router.get('/hot', async function (req, res) {
    const list = await categoryModel.getHotCategoryList();
    res.json(list);
})

module.exports = router;