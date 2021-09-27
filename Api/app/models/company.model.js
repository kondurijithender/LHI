const mongoose = require("mongoose");

const Company = mongoose.model(
  "Company",
  new mongoose.Schema({
    name: String,
    type_1: Object,
    type_2: Object,
    type_3: Object,
    type_4: Object,
    type_5: Object
  })
);

module.exports = Company;
