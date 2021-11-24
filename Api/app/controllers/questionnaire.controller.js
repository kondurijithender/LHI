const db = require("../models");
const Questionnaire = db.questionnaire;
const Survey = db.survey;
const Company = db.company;
const Permissions = db.permissions;
const { validationResult } = require('express-validator');
var bcrypt = require("bcryptjs");
const Excel = require('exceljs')
const _ = require("lodash");
const nodemailer = require('nodemailer');
const path = require('path');
var public = path.join(__dirname, 'public');
const config = require("../config/auth.config");

// create transporter object with smtp server details
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'jithenderkonduri@gmail.com',
    pass: 'dkkqytnhrqjgtumb'
  }
});

exports.create = (req, res, next) => {
  const { questionnaire, dimensionId, blockIndex, options, values } = req.body
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: true, message: errors.array() })
  }

  const q = new Questionnaire({
    questionnaire,
    dimensionId,
    blockIndex,
    options,
    values
  });

  q.save((err, user) => {
    if (err) res.status(500).send({ error: true, message: err });
    res.send({ message: "Questionnaire was created successfully!" });
  });

};

exports.update = async (req, res, next) => {
  const { questionnaire, dimensionId, blockIndex, options, values } = req.body
  const q = await Questionnaire.findById(req.params.id);
  // validate
  if (!q) res.status(400).send({ error: true, message: 'Questionnaire not found' });
  q.questionnaire = questionnaire;
  q.dimensionId = dimensionId;
  q.blockIndex = blockIndex;
  q.options = options;
  q.values = values;

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
exports.getById = async (req, res, next) => {
  const questionnaire = await Questionnaire.findById(req.params.id).populate("dimensionId");
  // validate
  if (!questionnaire) res.status(400).send({ error: true, message: 'Questionnaire not found' });
  res.status(200).send({ questionnaire });
};
exports.getAll = async (req, res) => {
  try {
    const { type } = req.query;
    let condition = {};
    if ('type' in req.query) condition = { type };
    Questionnaire.find(condition)
      .populate("dimensionId")
      .exec((err, questionnaires) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: true, message: err });
          return;
        }
        res.status(200).send({
          questionnaires,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: true, message: err });
  }
};
exports.getSurvey = async (req, res, next) => {
  const survey = await Survey.findById(req.query.id).populate("businessSector").populate("dimensionId");
  // validate
  if (!survey) res.status(400).send({ error: true, message: 'Survey not found' });
  res.status(200).send({ survey });
}
exports.getAllSurvey = async (req, res) => {
  try {
    const { type } = req.query;
    let condition = {};
    Survey.find(condition)
      .exec((err, survey) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: true, message: err });
          return;
        }
        res.status(200).send({
          survey,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: true, message: err });
  }
};
exports.getAllCompany = async (req, res) => {
  try {
    Company.find({})
      .exec((err, companies) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: true, message: err });
          return;
        }
        res.status(200).send({
          companies,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: true, message: err });
  }
};


exports.survey = async (req, res, next) => {
  const { name, designation, companyName, businessSector, email, questionnaires, country } = req.body
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
    country,
    questionnaires,
  });
  s.save(async (err, user) => {
    if (err) res.status(500).send({ error: true, message: err });
    // await sendMail(email);
    res.send({ message: s._id });
  });

};
exports.permissions = async (req, res, next) => {
  try {
    Permissions.find({})
      .sort({screen: 1})
      .exec((err, permissions) => {
        if (err) {
          console.log(err);
          res.status(500).send({ error: true, message: err });
          return;
        }

        res.status(200).send({
          permissions,
        });
      });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: true, message: err });
  }
}
exports.updatePermission = async (req, res, next) => {
  const { value, selected, screen } = req.body;

  const permissions = await Permissions.find({ screen });
  // validate
  if (!permissions.length) res.status(400).send({ error: true, message: 'Permissions not found' });
  else {
    console.log(permissions);
    const p = await Permissions.findById(permissions[0]._id);
    // validate
    if (!p) res.status(400).send({ error: true, message: 'Permissions not found' });
    if (selected) {
      p.location.push(value);
      p.location = [...new Set(p.location)]
    } else {
      p.location = p.location.filter(function (item) {
        return item !== value
      })

    }
    p.save((err, permissions) => {
      if (err) res.status(500).send({ error: true, message: err });
      res.send({ message: "Permissions was updated successfully!" });
    });
  }
}

exports.downloadUsers = async (req, res, next) => {
  let data = await Survey.find({}).populate("businessSector");
  let finalResult = await companyAvgScore(data);
  let workbook = new Excel.Workbook();
  let worksheet = workbook.addWorksheet('Users');
  worksheet.columns = [
    { header: 'Name', key: 'name' },
    { header: 'Designation', key: 'designation' },
    { header: 'Company Name', key: 'companyName' },
    { header: 'Business Sector', key: 'businessSector' },
    { header: 'Email', key: 'email' },
    { header: 'Score', key: 'score' },
    { header: 'Link', key: 'link' }
  ];
  // force the columns to be at least as long as their header row.
  // Have to take this approach because ExcelJS doesn't have an autofit property.
  worksheet.columns.forEach(column => {
    column.width = column.header.length < 12 ? 12 : parseInt(column.header.length) + 5
    if (column.header === 'Email') column.width = parseInt(column.header.length) + 20
    if (column.header === 'Link') column.width = parseInt(column.header.length) + 80
  })
  worksheet.getRow(1).font = { bold: true }
  // Dump all the data into Excel
  finalResult.forEach((e, index) => {
    // row 1 is the header.
    const rowIndex = index + 2

    // By using destructuring we can easily dump all of the data into the row without doing much
    // We can add formulas pretty easily by providing the formula property.
    console.log(e);
    worksheet.addRow({
      ...e,
    })
  })

  workbook.xlsx.writeFile('uploads/users.xlsx')
  res.setHeader('Content-Disposition', 'attachment; filename= + Application_Security_Design.xlsx');
  res.setHeader('Content-Type', 'application/vnd.ms-excel');

  let tool5filepath = '/' + decodeURIComponent('uploads/users.xlsx');
  res.download('uploads/users.xlsx');

}
async function sendMail(to) {
  transporter.sendMail({
    to,
    subject: 'An Attached File',
    text: 'Check out this attached pdf file',
    attachments: [{
      filename: 'sample.pdf',
      path: path.join(__dirname, '../../uploads/sample.pdf'),
      contentType: 'application/pdf'
    }],
    function(err, info) {
      if (err) {
        res.status(500).send({ error: true, message: err });
      } else {
        console.log(info);
      }
    }
  });
}
async function companyAvgScore(data) {
  let final = [];
  for (let index = 0; index < data.length; index++) {
    const element = data[index];

    let result = element
    this.surveyDetails = element

    let dimensionList = result.questionnaires.map((res) => {
      let obj = {};
      obj['q_score'] = parseInt(res.selectedvalue);
      obj['dimension'] = res.dimensionId[0].name;
      obj['_id'] = res.dimensionId[0]._id;
      obj['d_score'] = parseInt(res.dimensionId[0].score);
      return obj;
    });
    let dAvg = dimensionList.reduce((group, d) => {
      if (!group[d.dimension]) {
        group[d.dimension] = { ...d, count: 1 };
        return group;
      }
      group[d.dimension].q_score += d.q_score;
      group[d.dimension].count += 1;
      return group;
    }, {});
    let finalDimensionList = Object.keys(dAvg).map(function (x) {
      const item = dAvg[x];
      return {
        dimension: item.dimension,
        total: Math.round((item.q_score / item.count) * 20),
        d_score: item.d_score,
      };
    });


    const scoreValues = finalDimensionList.map(
      (res) => res.total
    );
    let companyAvgScore = Math.ceil(_.mean(scoreValues));
    let obj = {
      score: companyAvgScore,
      link: `${config.frontEndUrl}results?id=${element._id}`,
      name: element.name,
      designation: element.designation,
      companyName: element.companyName,
      email: element.email,
      businessSector: element.businessSector[0].name
    }
    final[index] = obj;
  }
  return final;
}



