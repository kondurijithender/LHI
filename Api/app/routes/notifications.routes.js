const { authJwt } = require("../middlewares");
const controller = require("../controllers/notifications.controller");

module.exports = function(app) {
  app.post(
    "/api/notifications",
    authJwt.verifyToken,
    controller.getAll
  );
  app.post(
    "/api/notifications-update",
    authJwt.verifyToken,
    controller.update
  );
  
};
