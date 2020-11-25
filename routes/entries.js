const express = require('express');
const { checkAuth } = require('../middleweare/auth');
const { checkEdit } = require('../middleweare/auth');

const router = express.Router();
const Entry = require('../models/entry');
const Users = require('../models/usermodel');

console.log('Entries started...');

// entries
router.get('/', async (req, res, next) => {
  const entries = await Entry.mostRecent();
  // console.log(entries);
  res.render('entries/index', { entries });
});

router.post('/', async (req, res, next) => {
  const newEntry = new Entry({ title: req.body.title, body: req.body.body });
  await newEntry.save();
  const user = await Users.findOne({ _id: req.session.user.id });
  user.story.push(newEntry._id);
  await user.save();
  res.redirect(`/entries/${newEntry.id}`);
});

// new entries
router.get('/new', checkAuth, (req, res, next) => {
  res.render('entries/new');
});

// detail entry
router.get('/:id', async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);
  res.render('entries/show', { entry });
});

router.put('/:id', async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);

  entry.title = req.body.title;
  entry.body = req.body.body;
  await entry.save();

  res.redirect(`/entries/${entry.id}`);
});

router.delete('/:id', checkEdit, async (req, res, next) => {
  await Entry.deleteOne({ _id: req.params.id });
  res.redirect('/');
});

router.get('/:id/edit', checkEdit, async (req, res, next) => {
  const entry = await Entry.findById(req.params.id);
  res.render('entries/edit', { entry });
});
module.exports = router;
