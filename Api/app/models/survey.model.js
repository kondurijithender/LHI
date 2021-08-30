const mongoose = require("mongoose");

const Survey = mongoose.model(
  "Survey",
  new mongoose.Schema({
    name: String,
    designation: String,
    companyName: String,
    email: String,
    businessSector:  [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry"
      }
    ],
    questionnaires: []
  })
);

module.exports = Survey;
