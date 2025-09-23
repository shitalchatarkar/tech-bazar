const mongoose = require("mongoose")

module.exports = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    otp: { type: String },
    otpSendOn: { type: String },
    active: { type: Boolean, default: true },
    address: { type: String, required: true },

}))