const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session'); // подключение сессий
const bcrypt = require('bcrypt');
const hbs = require('hbs');

const mongoose = require('mongoose');
const FileStore = require('session-file-store')(session); // Хранение сессий

const indexRouter = require('./routes/index');
const entriesRouter = require('./routes/entries');
const usersRouter = require('./routes/users');

const app = express();

// Подключаем mongoose.

mongoose.connect('mongodb://localhost:27017/project', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// Настройка сессий!!!!!!!!!!!!!!!!!!!!!!!!!!!!

const secretSession = 'e786f16227a0f423a50912beed79b21fce05e7668e2a7f5f8164655a000902eceee060baf148f56d04e7a5cdb097896403cb219c909ad1e13f3efe0a8779cf01';
app.use(session({
  name: 'sid',
  secret: secretSession,
  resave: false,
  store: new FileStore({
    secret: secretSession,
  }),
  saveUninitialized: false,
  cookie: { secure: false },
}));
//! !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

// Allows you to use PUT, DELETE with forms.
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

app.use('/', indexRouter);
app.use('/entries', entriesRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log("ok");
})
