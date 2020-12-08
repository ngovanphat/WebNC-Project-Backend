const express = require('express');
const router = express.Router();
const categoryModel = require('../models/category.model');

router.post('/add', async function(req, res){
    const category = req.body;
    category.id = await categoryModel.addCategory(category);
    res.status(201).json(category);
})


module.exports =router;