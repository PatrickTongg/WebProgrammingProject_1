var express = require('express');
const { head } = require('./api');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req, res, next) {
  res.render('register');
})
module.exports = router;
