var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apiRouter = require('./routes/api');
var viewRouter = require('./routes/view');
const { db ,userDb} = require('./utils/mongooseModule');
const { engine } = require('express-handlebars');
const jwt = require('jsonwebtoken');
var hbs = require('hbs');
const moment = require('moment');
require('dotenv').config();

const mongoURI = process.env.MONGODB_URI;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    formatDate: function (date, format) {
      return moment(date).format(format);
    },
    eq: (a, b) => a === b
  },
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
}));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

(async () => {
  try {
    await userDb.initialize(mongoURI);
    await db.initialize(mongoURI);
    console.log('Database connection initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    process.exit(1);
  }
})();

app.use('/', viewRouter);
app.use('/api', authenticateToken, apiRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

function authenticateToken(req, res, next) {
  if (req.path === '/api/login' || req.path === '/api/register'|| req.path === '/'||req.path === '/login'||
      req.path === '/register') {
    return next();
  }

  const token = req.cookies['token'];;

  if (!token) {
    res.redirect('/login');
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.render('login',{error : "Invalid or expired Login"} );
    }
    req.user = user;
    next();
  });
}

// error handler
app.use(function(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  res.status(err.status || 500).json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});



module.exports = app;
