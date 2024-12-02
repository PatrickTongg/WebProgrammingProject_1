var express = require('express');
const { head } = require('./api');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('login',{title:'Login'});
});
router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
})
router.get('/addRestaurant', function(req, res, next) {
  res.render('addRestaurant',{title:'AddRestaurant'});
})
module.exports = router;
