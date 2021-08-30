const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.questionnaire = require("./questionnaire.model");
db.survey = require("./survey.model");
db.industry = require("./industry.model");
db.dimension = require("./dimension.model");

module.exports = db;