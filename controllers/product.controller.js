const Product = require("../models/Product")
const expressAsyncHandler = require("express-async-handler");

const getProduct = expressAsyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "product fetch success", result })

})
const getSingleProduct = expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid)
    if (!Product) {
        res.status(400).json({ message: "product not found" })
    }

    res.json({ message: "product  single fetch success", product })

})
module.exports = { getProduct, getSingleProduct }