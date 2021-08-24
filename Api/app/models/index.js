const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.brand = require("./brand.model");
db.product = require("./product.model");
db.warehouse = require("./warehouse.model");
db.route = require("./route.model");
db.distributor = require("./distributor.model");
db.order = require("./order.model");
db.notification = require("./notification.model");
db.deliveryReturns = require("./deliveryReturns.model");
// db.ROLES = ["user", "admin", "moderator"];

module.exports = db;