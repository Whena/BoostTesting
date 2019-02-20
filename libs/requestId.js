const cuid = require('cuid');

const getCuid = (req, res, next) => {
  req.request_id = cuid();
  next();
};

module.exports = getCuid;
