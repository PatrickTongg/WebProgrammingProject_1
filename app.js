var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apiRouter = require('./routes/api');
var viewRouter = require('./routes/view');
const { db ,userDb} = require('./utils/mongooseModule');
const jwt = require('jsonwebtoken');
var hbs = require('hbs');
require('dotenv').config();

const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER_STRING}`;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
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

app.use('/',viewRouter);
app.use('/api', authenticateToken, apiRouter);
app.use('/', authenticateToken, viewRouter)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

function authenticateToken(req, res, next) {
  if (req.path === '/login' || req.path === '/register') {
    return next();
  }

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
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
