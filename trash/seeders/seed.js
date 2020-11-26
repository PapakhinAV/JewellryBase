const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/project', { useNewUrlParser: true, useUnifiedTopology: true });

const User = require('../../models/user');
const Item = require('../../models/item')

const users = [
  {
    phone: 911,
    nameLombard: 'Vasya Pupkins Lombard',
    adressLombard: 'Vavilova 1',
    managerName: 'Kolyamba',
    admin: false,

    password: 'parolparol',
    email: 'test@test.com',
  },
  {
    phone: 1233333,
    nameLombard: 'Pupkins Lombard',
    adressLombard: 'Vavilova 666',
    managerName: 'Stasyamba',
    admin: false,

    password: 'parolparol123',
    email: 'test1@test.com',
  },
];

User.insertMany(users).then(() => {
  mongoose.connection.close();
});

const items = [
  {
    authorID: 123,
    category: 'kolca',
    nameItems: 'Kolco Avtorskoe',
    describe: 'Zoloto 999 probi, almazi, brilliantu',
    linkPhoto: 'ssilka na fotky',
    price: 50000,
  },
  {
    authorID: 444,
    category: 'Persten',
    nameItems: 'Persten gopnika',
    describe: 'Zvet pozoloti no ne zoloto',
    linkPhoto: 'ssilka na fotky',
    price: 50,
  },
];

Item.insertMany(items).then(() => {
  mongoose.connection.close();
});
