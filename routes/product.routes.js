const { getProduct, getSingleProduct } = require("../controllers/Product.controller")

const router = require("express").Router()
router
    .get("/product", getProduct)
    .get("/products/:pid", getSingleProduct)
module.exports = router