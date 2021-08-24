const { authJwt } = require("../middlewares");
const controller = require("../controllers/brand.controller");

module.exports = function(app) {
  app.get(
    "/api/brands",
    authJwt.verifyToken,
    controller.list
  );
};
