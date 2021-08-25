const { authJwt } = require("../middlewares");
const { check } = require('express-validator')

 module.exports = function (app) {

//   app.get(
//     "/api/route/:id",
//     authJwt.verifyToken,
//     controller.getById
//   );
//   app.get(
//     "/api/route",
//     authJwt.verifyToken,
//     controller.getAll
//   );
//   app.post(
//     "/api/route",
//     authJwt.verifyToken,
//     [
//       check('name')
//         .notEmpty()
//         .withMessage('name is required')
//         .isLength({ min: 3, max: 6 })
//         .withMessage('Must be at 3 chars long'),
//       check('warehouse')
//         .notEmpty()
//         .withMessage('warehouse is required'),
//       check('openTime')
//         .notEmpty()
//         .withMessage('openTime is required'),
//       check('closeTime')
//         .notEmpty()
//         .withMessage('closeTime is required')
//     ],
//     controller.create
//   );
//   app.put(
//     "/api/route/:id",
//     authJwt.verifyToken,
//     [
//       check('openTime')
//         .notEmpty()
//         .withMessage('openTime is required'),
//       check('closeTime')
//         .notEmpty()
//         .withMessage('closeTime is required')
//     ],
//     controller.update
//   );
//   app.delete(
//     "/api/route/:id",
//     authJwt.verifyToken,
//     controller.delete
//   );
};
