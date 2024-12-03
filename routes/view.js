var express = require('express');
const { head } = require('./api');
const req = require("express/lib/request");
const res = require("express/lib/response");
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

router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.redirect('/');
})

module.exports = router;
