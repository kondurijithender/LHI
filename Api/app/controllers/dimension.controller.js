const db = require("../models");
const Dimension = db.dimension;

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
  } catch(err) {
    res.status(500).send({ error: true, message: err });
  }
};



