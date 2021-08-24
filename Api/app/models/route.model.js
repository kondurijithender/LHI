const mongoose = require("mongoose");

const Route = mongoose.model(
  "Route",
  new mongoose.Schema({
    name: String,
    openTime: String,
    closeTime: String,
    locations: Array,
    warehouse:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse"
    },
    password: String,
    passwordHash: String,
    code: String


  })
);

module.exports = Route;
