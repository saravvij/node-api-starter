const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Hello welcome');
  res.send({'message': 'Welcome to rest api'});
});

module.exports = router;
