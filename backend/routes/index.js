const router = require('express').Router();

const coinCapRoute = require('./coinCap');

module.exports = () => {
  router.use('/coin-cap', coinCapRoute());
  return router;
};