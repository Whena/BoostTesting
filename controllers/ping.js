const ping = async (req, res) => {
  res.status(200).json({
    msg: 'PONG!',
  });
};

module.exports = (router) => {
  router.get('/', ping);
};
