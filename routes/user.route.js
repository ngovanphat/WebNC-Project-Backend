const express = require('express');
const bcrypt = require('bcryptjs');

const userModel = require('../models/student.model');
const leturerModel = require('../models/leturer.model');

const router = express.Router();

router.post('/student', async function (req, res) {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    user.id = await userModel.addStudent(user);
    delete user.password;
    res.status(201).json(user);
})

router.post('/leturer', async function (req, res) {
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);

    user.id = await leturerModel.addLeturer(user);
    delete user.password;
    res.status(201).json(user);
})

module.exports = router;