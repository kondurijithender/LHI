const mongoose = require("mongoose");

const deliveryReturns = mongoose.model(
  "deliveryReturns",
  new mongoose.Schema({
    returns: [],
    date: Date,
  })
);

module.exports = deliveryReturns;
