/*
    product
        name            string
        image           [string]
        varients        [ {price, desc,colors} ]
        brand           string
        category        [string]
*/

const mongoose = require("mongoose")
module.exports = mongoose.model("product", new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: [String], required: true },
    brand: { type: String, required: true },
    category: { type: [String], required: true },
    varients: [
        {
            name: String,
            price: Number,
            desc: String,
            colors: [String],
            ram: String,
            ssd: String,
            processor: String,
            stock: Number
        }
    ],
}, { timestamps: true }))