const { authJwt } = require("../middlewares");
const { check } = require('express-validator')
const controller = require("../controllers/industry.controller");

module.exports = function (app) {

  app.get(
    "/api/industry",
    controller.getAll
  );
  app.post(
    "/api/industry",
    authJwt.verifyToken,
    [
      check('name')
        .notEmpty()
        .withMessage('industry is required')
    ],
    controller.create
  );
  app.put(
    "/api/industry/:id",
    authJwt.verifyToken,
    controller.update
  );
  app.delete(
    "/api/industry/:id",
    authJwt.verifyToken,
    controller.delete
  );
};
