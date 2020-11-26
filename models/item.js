const mongoose = require("mongoose");
const User = require("./user");

const itemSchema = new mongoose.Schema({
  authorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  category: String,
  nameItems: String,
  describe: String,
  linkPhoto: String,
  price: Number,
});

itemSchema.statics.mostRecent = async function () {
  return this.find().sort('createdAt').exec();
}
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
