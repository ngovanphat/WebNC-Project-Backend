const jwt = require('jsonwebtoken');

const authentication = function (req, res, next) {
  const accessToken = req.headers['x-access-token'];
  //console.log(accessToken);
  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(401).send({
      error: 'Please authenticate.'
    });
  }
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      req.accessTokenPayload = decoded;
    } catch (error) {
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

const adminAuthentication = function (req, res, next) {
  const accessToken = req.headers['x-access-token'];
  //console.log(accessToken);
  if (!accessToken || typeof accessToken !== 'string') {
    return res.status(401).send({
      error: 'Please authenticate.'
    });
  }
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
      if (decoded.role !== 'ADMIN') {
        throw new Error('No permission');
      }
      req.accessTokenPayload = decoded;
    } catch (error) {
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

module.exports = {
  authentication,
  adminAuthentication
}