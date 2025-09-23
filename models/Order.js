const mongoose = require("mongoose")

module.exports = mongoose.model("order", new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    products: [{
        product: { type: mongoose.Types.ObjectId, ref: "product", required: true },
        varientIndex: { type: Number, required: true },
        qty: { type: Number, required: true }
    }],
    paymentMode: { type: String, enum: ["cod", "online"] },
    status: {
        type: String, enum: ["placed", "out", "delivered", "return", "cancle"],
        default: "placed"
    },
    review: {
        rating: { type: Number },
        desc: { String }
    }
}))