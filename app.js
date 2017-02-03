var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost/joohe');
var Schema = mongoose.Schema;
var MyModel = mongoose.model('lsk', new Schema({ id: String , msg:String }));
var Statics = mongoose.model('Static',new Schema(
    {
        "year":Number,
        "place":String,
        "sum":Number,
        "dandok":Number,
        "dagagu":Number,
        "yeonlib":Number,
        "dasedae":Number,
        "apart":Number
    }
))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', index);
app.use('/users', users);
app.get('/create',function(req,res){
  var random = Math.floor(Math.random() * 1000) + 1;
    MyModel.create({id:random,msg:'msg_'+random},function(err,result){
        if(err){
            return res.send('err');
        }
        return res.send('success');
    });
});


app.get('/statics',function(req,res,next){
  console.log('req.filter ' , req.query.filter);
  var filter = req.query.filter ? JSON.parse(req.query.filter):{};
  console.log(filter);
  var query = Statics.find(filter,function(err,result){
      if(err){
          console.log(err);
          return res.send('error');
      }
      console.log(result);
      return res.json(result);
  })
   // Statics.find()
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
