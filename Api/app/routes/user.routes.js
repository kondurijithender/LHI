const { authJwt } = require("../middlewares");
const controller = require("../controllers/admin.controller");

module.exports = function(app) {
  
  // app.get("/api/test/all", controller.allAccess);

  // app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // app.get(
  //   "/api/test/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  // app.get(
  //   "/api/test/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // );
  app.get(
    "/api/admin/:id",
    authJwt.verifyToken,
    controller.getById
  );
  app.get(
    "/api/admin",
    authJwt.verifyToken,
    controller.getAll
  );
  app.post(
    "/api/admin",
    authJwt.verifyToken,
    controller.create
  );
  app.put(
    "/api/admin/:id",
    authJwt.verifyToken,
    controller.update
  );
  app.delete(
    "/api/admin/:id",
    authJwt.verifyToken,
    controller.delete
  );
};
