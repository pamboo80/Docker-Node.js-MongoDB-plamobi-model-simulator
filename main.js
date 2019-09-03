var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Database
var mongo = require('mongodb');
var monk = require('monk');

// https://stackoverflow.com/questions/53887738/server-selection-timeout-error-mongodb-go-driver-with-docker
// If you are trying to run the service from docker as well you will need to connect to the mongo service name as in docker-compose and not to localhost or docke inspect container IP too didn't work. So use the docker-compose service name given as in the docker-compose file as servername in the connection string.
var db = monk('mongo:27017/plaMobi', {
   useNewUrlParser: true,
   useUnifiedTopology: true
 }, (err, client) => {
  if (err) {
    console.log("old method");
    console.error(err);
    return;
  }
});
/*
const mongoNew = require('mongodb').MongoClient;
const url = 'mongodb://mongo:27017/plaMobi';
mongoNew.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.log("new method");
    console.error(err);
    return;
  }
}); */


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
