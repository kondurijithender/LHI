const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { check } = require('express-validator')

module.exports = function(app) {
  // app.post(
  //   "/api/auth/signup",
  //   [
  //     verifySignUp.checkDuplicateUsernameOrEmail,
  //     verifySignUp.checkRolesExisted
  //   ],
  //   controller.create
  // );

  app.post("/api/auth/signin", controller.signin);
  app.post("/api/auth/app-signin", controller.appSignin);
  app.post("/api/auth/change-password", controller.appChangePassword);
};
