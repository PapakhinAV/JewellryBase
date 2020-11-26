const mongoose = require("mongoose");
// const User = require("./user");

const itemSchema = new mongoose.Schema({
  authorID: user._id,
  category: String,
  nameItems: String,
  describe: String,
  linkPhoto: String,
  price: Number,
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
