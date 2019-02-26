/* eslint-disable camelcase */
const jwt = require('jsonwebtoken');
const { httpStatus } = require('../configs/codes');

const { JWT_SECRET, GATEWAY_ADMIN_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { gateway_token } = req.headers;

  jwt.verify(gateway_token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(httpStatus.internalServerError).json({
        status: httpStatus.internalServerError,
        success: false,
        message: 'Unauthorized API call.',
      });
    }

    if (GATEWAY_ADMIN_SECRET && decoded.gateway_token === GATEWAY_ADMIN_SECRET) return next();

    return res.status(httpStatus.unauthorized).json({
      status: httpStatus.unauthorized,
      success: false,
      message: 'Unauthorized API call.',
    });
  });
};
