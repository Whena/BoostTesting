// const JWT = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET;

const isAuthorized = async (req, res, next) => {
  // TODO: add jwt token checker here
  next();
};

module.exports = isAuthorized;
