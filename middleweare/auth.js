const Users = require('../models/usermodel');

const checkAuth = async (req, res, next) => {
  const userId = req.session?.user?.id;

  if (userId) {
    const user = await Users.findById(userId);
    if (user) {
      return next();
    }
    return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
  }
  return res.status(401).render('error', { message: 'Пройдите авторизацию!' });
};

const checkEdit = async (req, res, next) => {
  const userId = req.session?.user?.id;
  if (userId) {
    const user = await Users.findById(userId);
    if (user) {
      if (user.story.find((element) => element.toString() === req.params.id)) { return next(); }
    }
    return res.status(401).render('error', { message: 'Нет доступа!' });
  }
  return res.status(401).render('error', { message: 'Нет доступа!' });
};

module.exports = {
  checkAuth,
  checkEdit,
};

// req.params.id;
