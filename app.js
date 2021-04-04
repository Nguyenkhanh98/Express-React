const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const classRouter = require('./routes/class');
const gradeRouter = require('./routes/grade');
const subjectRouter = require('./routes/subject');
var cors = require('cors')

const app = express();



app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json());


// view engine setup

app.use(cors());

app.use('/api/user', usersRouter);
app.use('/api/class', classRouter);
app.use('/api/grade', gradeRouter);
app.use('/api/subject', subjectRouter);
app.use(express.static('data/Media'));
app.use(express.static('client/dist'));


// app.set('views', path.join(__dirname, 'client', 'dist'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

// app.get("/", (req, res) => {
//   console.log('sadsaasfasf');
//   console.log(path.join(__dirname, "client", "dist"));
//   res.sendFile(path.join(__dirname, "client", "dist"));
// });
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(500);
});


module.exports = app;
