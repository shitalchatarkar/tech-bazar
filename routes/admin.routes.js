const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    viewUsers,
    activeUser,
    deactiveUser,
    allOrsers,
    updateOrder
} = require("../controllers/admin.controller")

const router = require("express").Router()

router
    .get("/products", getProducts)
    .get("/orders", allOrsers)
    .post("/create-product", createProduct)
    .put("/update-product/:pid", updateProduct)
    .delete("/delete-product/:pid", deleteProduct)



    .get("/view-user", viewUsers)
    .put("/active-user/:id", activeUser)
    .put("/deactive-user/:id", deactiveUser)
    .put("/update-order/:id", updateOrder);


module.exports = router