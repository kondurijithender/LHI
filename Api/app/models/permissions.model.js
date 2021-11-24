const mongoose = require("mongoose");

const Permission = mongoose.model(
  "Permission",
  new mongoose.Schema({
    name: String,
    score: Number,
    location: []
  })
);

module.exports = Permission;
