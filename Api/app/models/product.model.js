const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    brandId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand"
    }
    ,
    name: String,
    fileName: String,
    packet: Number,
    fileOriginalName: String,
    status: { type: Boolean, default: true }
  })
);

module.exports = Product;
