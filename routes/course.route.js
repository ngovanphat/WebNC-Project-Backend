const express = require('express');
const router = express.Router();
const courseModel = require('../models/course.model');
const userModel = require('../models/user.model');
const {
  authentication,
  adminAuthentication,
} = require("../middlewares/auth.mdw");

router.post('/add', authentication, async function (req, res) {
    // const userId = req.body.userId;
    // const user = await userModel.singleById(userId);
    // console.log(user);
    try {
        const user = await userModel.singleById(req.accessTokenPayload.userId);
        if (user.role !== "LECTURER") {
            res.status(400).send({
                message: "You are not Lecturer"
            });
        }
        else {
            let course = req.body.course;
            course.leturer = req.body.userId;
            course.id = await courseModel.addCourse(course);
            await userModel.updateCourseList(req.body.userId, course.id);
            res.status(201).json(course);
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({
            error,
        });
    }
  
})

router.get('/all', async function (req, res) {
    let page = req.query.page;
    let page_count = req.query.size;
    if (!req.query.page && !req.query.size) {
        page = 1;
        page_count = 10;
    }
    console.log(page);
    console.log(page_count);
    const list = await courseModel.getCoursesPerPage(page, page_count);
    res.json(list);
})

router.get('/admin-manage/all',adminAuthentication, async function (req, res) {
  let page = req.query.page;
  let page_count = req.query.size;
  if (req.query.page===undefined && req.query.size===undefined) {
    const list = await courseModel.getAll();
    return res.json(list);
  }
  const list = await courseModel.getCoursesPerPage(page, page_count);
  res.json(list);
})

// 5 course same category
router.get('/byCategory/:category', async function (req, res) {
  let category = req.params.category;
  const course = await courseModel.getCourseSameCategory(category);
  res.json(course);
})

//----------MAIN PAGE OPERATION----------
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

//--------------------------------------
//----------------SEARCH----------------

router.get('/byDescPoint/:searchText', async function (req, res) {
  const list = await courseModel.searchCourseByDescPoint(req.params.searchText);
  res.json(list);
})

router.get('/byAscPrice/:searchText', async function (req, res) {
  const list = await courseModel.searchCourseByAscPrice(req.params.searchText);
  res.json(list);
})
//--------------------------------------


//single by id
router.get('/:id', async function (req, res) {
  let id = req.params.id;
  const course = await courseModel.getCourseDetail(id);
  res.json(course);
})

router.patch('/:id', async function (req, res) {
  const updates = req.body;
  const course = await courseModel.updateCourseDetail(req.params.id, updates);
  res.json(course);
})

router.delete('/:id', adminAuthentication, async function (req, res) {
  try {
    return res.json(
      await courseModel.removeCourse(
        req.params.id
      )
    );
  } catch (error) {
    console.log(error);
    res.status(400).send({
      error,
    });
  }
});
module.exports = router;