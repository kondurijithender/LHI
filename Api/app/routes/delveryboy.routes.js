const { authJwt } = require("../middlewares");
const controller = require("../controllers/delveryboy.controller");

module.exports = function (app) {
  app.get(
    "/api/deliveryboy-orders/:id",
    authJwt.verifyToken,
    controller.getAll
  );
  app.get(
    "/api/distributor-order/:id",
    authJwt.verifyToken,
    controller.distributorOrder
  );
};
