const db = require("../models");
const Industry = db.industry;

exports.update = async (req, res, next) => {
  const industry = await Industry.findById(req.params.id);
  const key = req.body.key.toUpperCase();;
  console.log(industry[key], key);
  // validate
  if (!industry) {
    res.status(400).send({ error: true, message: 'Industry not found' });
  }
  else if (!key in industry) {
    res.status(400).send({ error: true, message: 'key not found' });
  } else {
    console.log(industry);

    industry[key] = req.body.score;

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



