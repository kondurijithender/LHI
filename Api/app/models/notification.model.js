const mongoose = require("mongoose");

const notification = mongoose.model(
  "Notification",
  new mongoose.Schema({
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor"
    }, 
    title: String,
    body: String,
    date: {
      type: Date,
      default: Date.now
    },
    isRead: false
  })
);

module.exports = notification;
