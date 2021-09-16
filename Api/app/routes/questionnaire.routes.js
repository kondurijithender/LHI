const { authJwt } = require("../middlewares");
const { check } = require('express-validator')
const controller = require("../controllers/questionnaire.controller");

module.exports = function (app) {
  app.get(
    "/api/questionnaire/:id",
    authJwt.verifyToken,
    controller.getById
  );
  app.get(
    "/api/questionnaire",
    controller.getAll
  );
  app.post(
    "/api/questionnaire",
    authJwt.verifyToken,
    [
      check('questionnaire')
        .notEmpty()
        .withMessage('questionnaire is required'),
      check('dimensionId')
        .notEmpty()
        .withMessage('dimensionId is required'),
      check('blockIndex')
        .notEmpty()
        .withMessage('blockIndex is required'),
    ],
    controller.create
  );
  app.put(
    "/api/questionnaire/:id",
    authJwt.verifyToken,
    [
      check('questionnaire')
        .notEmpty()
        .withMessage('questionnaire is required'),
      check('dimensionId')
        .notEmpty()
        .withMessage('dimensionId is required'),
      check('blockIndex')
        .notEmpty()
        .withMessage('blockIndex is required'),
      check('type')
        .notEmpty()
        .withMessage('type is required')
    ],
    controller.update
  );
  app.delete(
    "/api/questionnaire/:id",
    authJwt.verifyToken,
    controller.delete
  );
  app.get(
    "/api/survey",
    controller.getSurvey
  );
  app.get(
    "/api/survey-list",
    controller.getAllSurvey
  );
  app.post(
    "/api/survey",
    controller.survey
  );
};
