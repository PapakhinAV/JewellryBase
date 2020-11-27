const express = require('express');
const User = require('../models/user');
const Item = require('../models/item');

const bcrypt = require('bcrypt');

const { checkAdmin } = require('../middleweare/auth');

const router = express.Router();
router.get('/', (req, res, next) => {
  res.render('signinAdmin');
});

router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    if (email && password) {
      const currentUser = await User.findOne({ email });
      if (currentUser) {
        if (await bcrypt.compare(password, currentUser.password)) {
          console.log('Success login');
          req.session.user = {
            email: currentUser.email,
            id: currentUser._id,
            phone: currentUser.phone,
            nameLombard: currentUser.nameLombard,
            adressLombard: currentUser.adressLombard,
            managerName: currentUser.managerName,
            admin: currentUser.admin,
          },
            res.redirect(`/admin/main`);
        } else { res.render('error', { message: 'Неверный логин или пароль! Повторите ввод!' }); }
      } else { res.render('error', { message: 'Неверный логин или пароль! Повторите ввод!' }); }
    } else { res.render('error', { message: 'Заполните все поля' }); }
  } catch (error) {
    res.render('error', { error });
  }

});

router.get('/main', checkAdmin, async (req, res, next) => {
  let allUsersForAdmin = await User.find({ admin: false });
  console.log(allUsersForAdmin);
  res.render('mainAdmin', { allUsersForAdmin });
});

router.get("/organisation/:id", checkAdmin, async (req, res) => {
  let id = req.params.id
  console.log(id);
  let itemsOfUser = await Item.find({ authorID: id })
  res.render("itemsOfuserForAdmin", { itemsOfUser })
})

module.exports = router;
