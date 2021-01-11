const express = require('express');
const router = express.Router();
const feedbackModel = require('../models/feedback.model');
const userModel = require('../models/user.model');
const {
  authentication,
  adminAuthentication,
} = require("../middlewares/auth.mdw");

//Admin - get all feedback by query
router.get('/admin-manage', adminAuthentication, async function (req, res) {
  try {
    const list = await feedbackModel.getAll(req.query.page, req.query.pageCount);
    res.json(list);
  } catch (error) {
    //console.log(error);
    res.status(400).json(error);
  }
});

//Admin - Get feedback by course id
router.get('/admin-manage/:courseId', adminAuthentication, async function (req, res) {
  try {
    const list = await feedbackModel.getByCourseID(req.params.courseId);
    return res.json(list);
  } catch (error) {
    res.status(400).json(error);
  }
});

//Lecturer - Get feedback by course id
router.get('/:courseId', async function (req, res) {
  try {
    const list = await feedbackModel.getByCourseID(req.params.courseId, req.query.page, req.query.pageCount);
    return res.json(list);
  } catch (error) {
    res.status(400).json(error);
  }
});

//Create feedback
router.post('/', authentication, async function (req, res) {
  try {
    //check feedback already
    if (feedbackModel.isExisted(req.accessTokenPayload.userId, req.body.course)) {
      throw new Error("Already send feedback on this course");
    }
    //create feedback & update course rating
    const feedbackObj = {
      user: req.accessTokenPayload.userId,
      course: req.body.course,
      title: req.body.title,
      rating: req.body.rating
    }
    const feedback = await feedbackModel.add(feedbackObj);
    res.json(feedback);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error: error.message
    });
  }
});

//Update feedback
router.patch('/:id', authentication, async function (req, res) {
  try {
    const result = await feedbackModel.update(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    //console.log(error);
    res.status(400).json(error);
  }
})

//Admin - Delete feedback
router.delete('/:id', adminAuthentication, async function (req, res) {
  try {
    const result = await feedbackModel.delete(req.params.id, req.body.courseId);
    res.json(result);
  } catch (error) {
    //console.log(error);
    res.status(400).json(error);
  }
})

module.exports = router;