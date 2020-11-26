const express = require('express');
const bcrypt = require('bcrypt');
// const { render } = require('../app');
const Users = require('../models/usermodel');
const { checkAuth } = require('../middleweare/auth');
const Entry = require('../models/entry');


const router = express.Router();

router.get('/registration', (req, res, next) => {
  res.render('registration');
});
router.post('/registration', async (req, res) => {
  //TODO:
  const { username, password, email } = req.body;
  if (username && password && email) {
    try {
      const pass = await bcrypt.hash(password, 10);
      const user = new Users({ username, password: pass, email });
      await user.save();
      req.app.locals.user = user;
      req.app.locals.name = user.username;
      req.session.userId = {
        id: user._id,
      };
      // const name = user.username;
      res.redirect(`/users/${user._id}/main`);
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
          req.app.locals.user = currentUser;
          req.app.locals.name = currentUser.username;
          // res.locals.name = ;

          req.session.user = {
            id: currentUser._id,
          };
          res.redirect(`/users/${currentUser._id}/main`);
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
    req.app.locals.user = null;

    res.redirect('/');
  });
});
module.exports = router;

router.get("/:id/main", checkAuth, async (req, res, next) => {
  const entries = await Entry.mostRecent();
  res.render("usermain", { entries })
})
