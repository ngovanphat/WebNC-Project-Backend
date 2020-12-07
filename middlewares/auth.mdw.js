const jwt =  require('jsonwebtoken');
const SECRECT_KEY = require('../utils/config');


module.exports = function (req, res, next) {
    const accessToken = req.headers['x-access-token'];
    console.log(accessToken);
    if(accessToken) {
        try{
            const decoded = jwt.verify(accessToken, SECRECT_KEY);
            req.accessTokenPayload = decoded;
        }
        catch(error) {
            return res.status(401).json({
                message: 'Invalid access token.'
            })
        }
        next();
    } else {
        return res.status(400).json({
            message: 'Access token not found'
        });
    }
    
};