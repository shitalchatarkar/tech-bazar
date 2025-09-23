const { getProduct, getSingleProduct } = require("../controllers/product.controller")

const router = require("express").Router()
router
    .get("/product", getProduct)
    .get("/products/:pid", getSingleProduct)
module.exports = router