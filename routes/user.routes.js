const { placeeOrder, cancleOrder, orderHistry } = require("../controllers/user.controller")

const router = require("express").Router()

router
    .post("/place-order", placeeOrder)
    .post("/cancle-order", cancleOrder)
    .get("/order-histry", orderHistry)

module.exports = router