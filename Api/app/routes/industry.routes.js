const { authJwt } = require("../middlewares");
const { check } = require('express-validator')
const controller = require("../controllers/industry.controller");

module.exports = function (app) {

  app.get(
    "/api/industry",
    authJwt.verifyToken,
    controller.getAll
  );
  app.put(
    "/api/industry/:id",
    authJwt.verifyToken,
    controller.update
  );
};
