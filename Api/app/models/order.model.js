const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    orderId: String,
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor"
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Route"
    },
    product: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      qty: Number,
      total_packets: Number,
    }],
    outstanding_price: Number,
    total: Number,
    orderType: {
      type: String,
      enum: ['accept', 'deliver', 'rejected'],
      default: 'accept'
    },
    otp: String,
    date: Date,
  })
);

module.exports = Order;
