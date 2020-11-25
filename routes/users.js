const express = require('express');
const bcrypt = require('bcrypt');
// const { render } = require('../app');
const Users = require('../models/usermodel');

const router = express.Router();

router.get('/registration', (req, res, next) => {
  res.render('registration');
});
router.post('/registration', async (req, res) => {
  const { username, password, email } = req.body;
  if (username && password && email) {
    try {
      const pass = await bcrypt.hash(password, 10);
      const user = new Users({ username, password: pass, email });
      await user.save();
      res.locals.name = user.username;
      req.session.userId = {
        id: user._id,
      };
      // const name = user.username;
      res.redirect('/');
    } catch (error) {
      res.redirect('/users/registration');
    }
  }
});

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username && password) {
      const currentUser = await Users.findOne({ username });
      if (currentUser) {
        if (await bcrypt.compare(password, currentUser.password)) {
          console.log('Success login');
          console.log(currentUser);
          req.app.locals.name = currentUser.username;
          // res.locals.name = ;

          req.session.user = {
            id: currentUser._id,
          };
          res.redirect('/');
        } else { res.render('error', { message: 'Неверный пароль! Повторите ввод' }); }
      } else { res.render('error', { message: 'Неверный логин! Повторите ввод' }); }
    } else { res.render('error', { message: 'Заполните все поля' }); }
  } catch (error) {
    res.render('error', { error });
  }
});

router.get('/signout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return res.render('error', { error: err });
    res.clearCookie('sid');
    req.app.locals.name = null;

    res.redirect('/');
  });
});
module.exports = router;
