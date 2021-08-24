const mongoose = require("mongoose");

const Distributor = mongoose.model(
    "Distributor",
    new mongoose.Schema({
        brand: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Brand"
            }
        ],
        name: String,
        email: String,
        phone: Number,
        address: String,
        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route"
        },
        dropPoint: String,
        location: String,
        products: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            price: Number
        }],
        crateLimit: Number,
        cashLimit: Number,
        password: String,
        passwordHash: String,
        code: String,
        passwordChanged: { type: Boolean, default: false },
        outStandingCrates: { type: Number, default: 0 },
        outStandingAmount: { type: Number, default: 0 },
        active: { type: Boolean, default: true },

    })
);


module.exports = Distributor;
