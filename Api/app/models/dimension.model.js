const mongoose = require("mongoose");

const Dimension = mongoose.model(
  "Dimension",
  new mongoose.Schema({
    name: String,
    score: Number
  })
);

module.exports = Dimension;
