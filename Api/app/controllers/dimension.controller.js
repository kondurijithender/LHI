const db = require("../models");
const Dimension = db.dimension;
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  const { name, score } = req.body
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const d = new Dimension({
    name,
    score
  });

  d.save((err, questionnaire) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Dimension was created successfully!" });
  });
}

exports.update = async (req, res, next) => {
  const { name, score } = req.body
  const d = await Dimension.findById(req.params.id);
  // validate
  if (!d) res.status(400).send({ error: true, message: 'Dimension not found' });
  d.name = name;
  d.score = score;

  d.save((err, questionnaire) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Dimension was updated successfully!" });
  });
};

exports.getAll = async (req, res) => {
  try {
    Dimension.find({}, (err, dimensions) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }
      res.status(200).send({
        dimensions,
      });
    });
  } catch (err) {
    res.status(500).send({ error: true, message: err });
  }
};
exports.delete = async (req, res, next) => {
  const dimension = await Dimension.findById(req.params.id);
  // validate
  if (!dimension) res.status(500).send({ error: true, message: 'Dimension not found' });

  Dimension.findByIdAndRemove(dimension._id, (err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Dimension was deleted successfully!" });
  });
}



