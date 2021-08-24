const { authJwt } = require("../middlewares");
const controller = require("../controllers/order.controller");

module.exports = function(app) {
  app.post(
    "/api/place-order",
    authJwt.verifyToken,
    controller.create
  );
  
  app.post(
    "/api/otp-verify",
    authJwt.verifyToken,
    controller.OTPVerify
  );
  app.post(
    "/api/order-delivery",
    authJwt.verifyToken,
    controller.orderDelivery
  );
  
};
