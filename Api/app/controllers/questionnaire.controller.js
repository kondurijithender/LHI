const db = require("../models");
const Questionnaire = db.questionnaire;
const Survey = db.survey;
const { validationResult } = require('express-validator');
var bcrypt = require("bcryptjs");

exports.create = (req, res, next) => {
  const { questionnaire, dimensionId, blockIndex, type } = req.body
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const q = new Questionnaire({
    questionnaire,
    dimensionId,
    blockIndex,
    type
  });

  q.save((err, user) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Questionnaire was created successfully!" });
  });

};

exports.update = async (req, res, next) => {
  const { questionnaire, dimensionId, blockIndex, type } = req.body
  const q = await Questionnaire.findById(req.params.id);
  // validate
  if (!q) res.status(400).send({ error: true, message: 'Questionnaire not found' });
  q.questionnaire = questionnaire;
  q.dimensionId = dimensionId;
  q.blockIndex = blockIndex;
  q.type = type;

  q.save((err, questionnaire) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Questionnaire was updated successfully!" });
  });
};
exports.delete = async (req, res, next) => {
  const q = await Questionnaire.findById(req.params.id);
  // validate
  if (!q) res.status(500).send({ error: true, message: 'Questionnaire not found' });

  Questionnaire.findByIdAndRemove(q._id, (err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Questionnaire was deleted successfully!" });
  });
}
exports.getAll = async (req, res) => {
  try {
    const { type } = req.query;
    let condition = {};
    if('type' in req.query) condition = { type };
    Questionnaire.find(condition, (err, questionnaires) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }
      res.status(200).send({
        questionnaires,
      });
    });
  } catch(err) {
    console.log(err);
    res.status(500).send({ error: true, message: err });
  }
};
exports.survey = (req, res, next) => {
  const { name, designation, companyName, businessSector, email, questionnaires } = req.body
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const s = new Survey({
    name,
    designation,
    companyName,
    businessSector,
    email,
    questionnaires,
  });

  s.save((err, user) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Survey was created successfully!" });
  });

};



