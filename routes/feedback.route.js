const express = require('express');
const router = express.Router();
const feedbackModel = require('../models/feedback.model');
router.get('/all', async function(req,res){
    try{
        const list = await feedbackModel.getAll();
        res.json(list);
    }catch (error){
        console.log(error);
        res.status(400).json(error);
    }
});

router.post('/',async function(req, res){
    try{
        const feedback = await feedbackModel.add(req.body);
        res.json(feedback);
    }catch (error){
        console.log(error);
        res.status(400).json(error);
    }
});

module.exports = router;