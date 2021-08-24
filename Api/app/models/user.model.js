const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand"
    }
  })
);

module.exports = User;
