const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');

const userModel = require('../models/user.model');
const SECRECT_KEY = require('../utils/config');

const router = express.Router();

router.post('/', async function (req, res) {
    const user = await userModel.singleByEmail(req.body.email);

    if (user === null) {
        return res.json({
            authenticated: false
        });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.json({
            authenticated: false
        });
    }

    const accessToken = jwt.sign({
        userId: user.id
    }, SECRECT_KEY, {
        expiresIn: 20 * 60
    });

    const refreshToken = randToken.generate(80);
    await userModel.updateRefreshToken(user._id, refreshToken);
  
    res.json({
        authenticated: true,
        accessToken,
        refreshToken
    });
})

router.post('/refresh', async function (req, res) {
    const payload = jwt.verify(req.body.accessToken, SECRECT_KEY, { ignoreExpiration: true });
    const refreshToken = req.body.refreshToken;
    const ret = await studentModel.isRefreshTokenExisted(payload.userId, refreshToken);

    if (ret === true) {
        const accessToken = jwt.sign({
            userId: payload.userId
        }, SECRECT_KEY, {
            expiresIn: 20 * 60
        });
        return res.json({ accessToken });
    }

    res.status(400).json({
        message: 'Invalid Refresh token.'
    });
})

module.exports = router;