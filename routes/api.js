var express = require('express');
const fs = require("fs");
const {mongoose,db} = require('../utils/mongooseModule')


var router = express.Router();
const config = JSON.parse(fs.readFileSync('config/config.json'));


const mongoUser = config.mongodb.username;
const mongoPassword = config.mongodb.password;
const mongoURI = `mongodb+srv://${mongoUser}:${mongoPassword}@cluster19885.jm6vp.mongodb.net/sample_restaurants?retryWrites=true&w=majority&appName=Cluster19885`;

/* GET home page. */
router.get('/', function(req, res, next) {
  db.initialize(mongoURI);
  res.send('API is Running');
});

module.exports = router;
