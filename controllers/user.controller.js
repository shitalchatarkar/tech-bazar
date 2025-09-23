const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/Order");

const placeeOrder = expressAsyncHandler(async (req, res) => {
    await Order.create({ ...req.body, user: req.user })
    console.log(req.body);



    res.json({ message: "order place success" })
})
const cancleOrder = expressAsyncHandler((req, res) => {
    res.json({ message: "order cancle success" })
})
const orderHistry = expressAsyncHandler(async (req, res) => {
    const result = await Order.find({ user: req.user }).populate("products.product").lean();//  object
    // to array 
    const x = result.map(item => {
        return item.products.map(pro => {

            return {
                status: item.status,
                paymentMode: item.paymentMode,
                ...pro.product,
                qty: pro.qty,
                _id: item._id,
                varients: pro.product.varients[pro.varientIndex]
            }
        })
    }).flat()
    res.json({ message: "order histery fetch success", result: x })
})


// ✅ Order update controller

module.exports = { placeeOrder, cancleOrder, orderHistry }