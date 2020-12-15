const express = require('express');
const router = express.Router();
const feedbackModel = require('../models/feedback.model');
const userModel = require('../models/user.model');

router.get('/all', async function(req,res){
    try{
        const list = await feedbackModel.getAll();
        res.json(list);
    }catch (error){
        console.log(error);
        res.status(400).json(error);
    }
});

router.get('/:courseId', async function(req,res){
    try {
        const list = await feedbackModel.getByCourseID(req.params.courseId);
        return res.json(list);
    } catch (error){
        res.status(400).json(error);
    }
});

router.post('/',async function(req, res){
    try{
        const userId = req.body.user;
        const user = await userModel.singleById(userId);
        if (user.role !== "STUDENT") {
            res.status(400).send({
                message: "You are not Student"
            });
        }
        else {
            const feedback = await feedbackModel.add(req.body);
            res.json(feedback);
        }
    }catch (error){
        console.log(error);
        res.status(400).json(error);
    }
});

router.patch('/:id', async function(req, res){
    try{
        const result = await feedbackModel.update(req.params.id, req.body);
        res.json(result);
    }catch (error){
        console.log(error);
        res.status(400).json(error);
    }
})

router.delete('/:id', async function(req, res){
    try{
        const result = await feedbackModel.delete(req.params.id, req.body.courseId);
        res.json(result);
    }catch (error){
        console.log(error);
        res.status(400).json(error);
    }
})

module.exports = router;