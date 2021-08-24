const mongoose = require("mongoose");

const Brand = mongoose.model(
  "Brand",
  new mongoose.Schema({
    name: String,
    image: String
  })
);

module.exports = Brand;
