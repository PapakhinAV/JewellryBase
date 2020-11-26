const express = require('express');
const bcrypt = require('bcrypt');
// const { render } = require('../app');
const User = require('../models/user');
const Item = require('../models/item');
const { checkAuth } = require('../middleweare/auth');


const router = express.Router();

router.get('/registration', (req, res, next) => {
  res.render('registration');
});

router.post('/registration', async (req, res) => {
  //TODO:
  const { phone, nameLombard, adressLombard, managerName, password, email } = req.body;
  if (password && email) {
    TODO:    // if (username && password && email) {

    try {
      const pass = await bcrypt.hash(password, 10);
      const user = new User({ phone, nameLombard, adressLombard, managerName, password: pass, email });
      user.admin = false
      await user.save();
      console.log(await user);
      req.session.user = {
        email: user.email,
        id: user._id,
        phone: user.phone,
        nameLombard: user.nameLombard,
        adressLombard: user.adressLombard,
        managerName: user.managerName,
        admin: user.admin,
      },
        res.redirect(`/users/${user._id}/main`);
    } catch (error) {
      console.log(error);
      // res.redirect('/users/registration');
    }
  }
});

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const currentUser = await User.findOne({ email });
      if (currentUser) {
        if (await bcrypt.compare(password, currentUser.password)) {
          console.log('Success login');
          //TODO:
          console.log(currentUser);
          req.session.user = {
            email: currentUser.email,
            id: currentUser._id,
            phone: currentUser.phone,
            nameLombard: currentUser.nameLombard,
            adressLombard: currentUser.adressLombard,
            managerName: currentUser.managerName,
            admin: currentUser.admin,
          },
            // req.session.user = {
            //   email: currentUser.email
            // }
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


    res.redirect('/');
  });
});

router.get("/:id/main", checkAuth, async (req, res, next) => {
  //TODO: const entries = await Entry.mostRecent();
  const entries = await Item.mostRecent();
  console.log(entries);
  res.render("usermain", { entries })
})





module.exports = router;
