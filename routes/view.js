var express = require('express');
const { head } = require('./api');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('login');
});
router.get('/register', function(req, res, next) {
  res.render('register');
})
router.get('/restaurants', function(req, res, next) {
  try {
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Authorization token is missing or invalid' });
    }
    fetch(`/api/restaurants?page=1&perPage=10`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error', message: err.message });
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
});
module.exports = router;
