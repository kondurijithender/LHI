const mongoose = require("mongoose");

const Questionnaire = mongoose.model(
  "Questionnaire",
  new mongoose.Schema({
    questionnaire: String,
    dimensionId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dimension"
      }
    ],
    blockIndex: Number,
    type: {
      type: String,
      enum: ["employee", "learner"]
  }
  })
);

module.exports = Questionnaire;
