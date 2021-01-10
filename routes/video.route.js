const express = require('express');
const router = express.Router();
const videoModel = require('../models/video.model');
const { adminAuthentication } = require('../middlewares/auth.mdw');

router.post('/', async function (req, res) {
    const video = req.body;
    video.id = await videoModel.add(video);
    res.status(201).json(video);
})


router.get('/',adminAuthentication ,async function (req, res) {
    const list = await videoModel.getAll();
    res.json(list);
})

router.get('/:courseId', async function (req, res) {
    try {
        const result = await videoModel.getByCourseID(req.params.courseId);
        res.json(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json(error);
    }
})
router.get('/videos/:videoId', async function (req, res){
    try{
        const video = await videoModel.single(req.params.videoId);
        res.json(video);
    }
    catch(error){
        console.log(error);
        res.status(400).json(error);
    }
})

router.delete('/:videoId', adminAuthentication, async function (req, res) {
    try {
        const result = await videoModel.delete(req.params.videoId);
        res.json(result);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ error });
    }
})



module.exports = router;