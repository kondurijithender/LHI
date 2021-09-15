const db = require("../models");
const Industry = db.industry;
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  const { name, companies, D1, D2, D3, D4, D5, D6, D7, D8 } = req.body
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const industry = new Industry({
    name,
    companies,
    D1,
    D2,
    D3,
    D4,
    D5,
    D6,
    D7,
    D8
  });

  industry.save((err, questionnaire) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Industry was created successfully!" });
  });
}
exports.update = async (req, res, next) => {
  const industry = await Industry.findById(req.params.id);
  // validate
  if (!industry) {
    res.status(400).send({ error: true, message: 'Industry not found' });
  }else {
    industry.companies = req.body.companies;
    industry.D1 = req.body.D1;
    industry.D2 = req.body.D2;
    industry.D3 = req.body.D3;
    industry.D4 = req.body.D4;
    industry.D5 = req.body.D5;
    industry.D6 = req.body.D6;
    industry.D7 = req.body.D7;
    industry.D8 = req.body.D8;

    industry.save((err, questionnaire) => {
      if (err) res.status(500).send({ error: true, message: err });
      res.send({ message: "Industry was updated successfully!" });
    });
  }
};

exports.getAll = async (req, res) => {
  try {
    Industry.find({}, (err, industries) => {
      if (err) {
        res.status(500).send({ error: true, message: err });
        return;
      }
      res.status(200).send({
        industries,
      });
    });
  } catch (err) {
    res.status(500).send({ error: true, message: err });
  }
};
exports.delete = async (req, res, next) => {
  const industry = await Industry.findById(req.params.id);
  // validate
  if (!industry) res.status(500).send({ error: true, message: 'Industry not found' });

  Industry.findByIdAndRemove(industry._id, (err, product) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Industry was deleted successfully!" });
  });
}



