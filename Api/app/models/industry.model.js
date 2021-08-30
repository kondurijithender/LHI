const mongoose = require("mongoose");

const Industry = mongoose.model(
  "Industry",
  new mongoose.Schema({
    name: String,
    companies: Number,
    D1: Number,
    D2: Number,
    D3: Number,
    D4: Number,
    D5: Number,
    D6: Number,
    D6: Number,
    D7: Number,
    D8: Number,
  })
);

module.exports = Industry;
