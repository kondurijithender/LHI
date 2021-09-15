const { authJwt } = require("../middlewares");
const { check } = require('express-validator')
const controller = require("../controllers/dimension.controller");

module.exports = function (app) {

  app.get(
    "/api/dimension",
    authJwt.verifyToken,
    controller.getAll
  );
  app.post(
    "/api/dimension",
    authJwt.verifyToken,
    [
      check('name')
        .notEmpty()
        .withMessage('dimension is required')
    ],
    controller.create
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
  app.delete(
    "/api/dimension/:id",
    authJwt.verifyToken,
    controller.delete
  );
};
