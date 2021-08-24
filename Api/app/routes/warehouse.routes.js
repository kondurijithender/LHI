const { authJwt } = require("../middlewares");
const controller = require("../controllers/warehouse.controller");

module.exports = function (app) {
  app.get(
    "/api/warehouse",
    authJwt.verifyToken,
    controller.getAll
  );
  app.post(
    "/api/warehouse",
    authJwt.verifyToken,
    controller.create);
  app.delete(
    "/api/warehouse/:id",
    authJwt.verifyToken,
    controller.delete
  );
};
