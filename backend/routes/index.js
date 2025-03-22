const router = require('express').Router();

const coinCapRoute = require('./coinCap');
const coinGeckoRoute = require('./coinGecko');

module.exports = () => {
  router.use('/coin-cap', coinCapRoute());
  router.use('/coin-gecko', coinGeckoRoute());

  return router;
};