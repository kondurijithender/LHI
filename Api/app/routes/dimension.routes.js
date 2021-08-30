const { authJwt } = require("../middlewares");
const { check } = require('express-validator')
const controller = require("../controllers/dimension.controller");

module.exports = function (app) {

  app.get(
    "/api/dimension",
    authJwt.verifyToken,
    controller.getAll
  );
  app.put(
    "/api/dimension/:id",
    authJwt.verifyToken,
    [
      check('score')
        .notEmpty()
        .withMessage('score is required')
    ],
    controller.update
  );
};
