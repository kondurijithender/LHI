const { authJwt } = require("../middlewares");
const controller = require("../controllers/distributor.controller");
const { check } = require('express-validator')

module.exports = function (app) {

  app.get(
    "/api/distributor/:id",
    authJwt.verifyToken,
    controller.getById
  );
  app.get(
    "/api/distributor",
    authJwt.verifyToken,
    controller.getAll
  );
  app.post(
    "/api/distributor",
    authJwt.verifyToken,
    [
      check('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 3, max: 12 })
        .withMessage('Must be min 3 and max 12 chars long'),
      check('brand')
        .notEmpty()
        .withMessage('brand is required'),
      check('email')
        .notEmpty()
        .withMessage('email is required'),
      check('phone')
        .notEmpty()
        .withMessage('phone is required')
        .isMobilePhone()
        .withMessage('please enter valid phone number'),
      check('address')
        .notEmpty()
        .withMessage('address is required'),
      check('route')
        .notEmpty()
        .withMessage('route is required'),
      check('crateLimit')
        .notEmpty()
        .withMessage('crate limit is required'),
      check('cashLimit')
        .notEmpty()
        .withMessage('cash limit is required'),

    ],
    controller.create
  );
  app.put(
    "/api/distributor/:id",
    authJwt.verifyToken,
    [
      check('email')
        .notEmpty()
        .withMessage('email is required'),
      check('phone')
        .notEmpty()
        .withMessage('phone is required')
        .isMobilePhone()
        .withMessage('please enter valid phone number'),
      check('address')
        .notEmpty()
        .withMessage('address is required'),
      check('crateLimit')
        .notEmpty()
        .withMessage('crate limit is required'),
      check('cashLimit')
        .notEmpty()
        .withMessage('cash limit is required'),

    ],
    controller.update
  );
  app.delete(
    "/api/distributor/:id",
    authJwt.verifyToken,
    controller.delete
  );
  app.post(
    "/api/distributor/change-status",
    authJwt.verifyToken,
    controller.distributorStatusChange
  );
  app.get(
    "/api/distributor-exists/:id",
    authJwt.verifyToken,
    controller.checkDuplicateDistributor
  );
};
