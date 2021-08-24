const { authJwt } = require("../middlewares");
const controller = require("../controllers/product.controller");

module.exports = function(app) {
  
  app.get(
    "/api/products/:id",
    authJwt.verifyToken,
    controller.getById
  );
  app.get(
    "/api/products",
    authJwt.verifyToken,
    controller.getAll
  );
  app.post(
    "/api/products",
    authJwt.verifyToken,
    controller.create
  );
  app.put(
    "/api/products/:id",
    authJwt.verifyToken,
    controller.update
  );
  app.delete(
    "/api/products/:id",
    authJwt.verifyToken,
    controller.delete
  );
  app.post(
    "/api/products/change-status",
    authJwt.verifyToken,
    controller.productStatusChange
  );
};
