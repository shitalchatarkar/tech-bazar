const expressAsyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const productUpload = require("../utils/upload");
const cloud = require("../utils/cloud");

const path = require("path");
const User = require("../models/User");
const Order = require("../models/Order");

exports.getProducts = expressAsyncHandler(async (req, res) => {
    const result = await Product.find()
    res.json({ message: "product fetch success", result })
})
exports.createProduct = expressAsyncHandler(async (req, res) => {
    productUpload(req, res, async err => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "unable to upload" })
        }
        const image = []
        for (const item of req.files) {
            const { secure_url } = await cloud.uploader.upload(item.path)
            image.push(secure_url)
        }
        await Product.create({ ...req.body, varients: JSON.parse(req.body.varients), image })
        res.json({ message: "product create success" })
    })
})
exports.updateProduct = expressAsyncHandler(async (req, res) => {
    productUpload(req, res, async err => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "unable to upload" })

        }
        const { remove } = req.body
        const { pid } = req.params
        const result = await Product.findById(pid)
        const img = result.image.filter(item => !remove.includes(item))
        // 🤞 expecting array from frontend
        // remove imagesss
        const p = []
        for (const item of JSON.parse(remove)) {
            const name = path.basename(item).split(".")[0]
            p.push(cloud.uploader.destroy(name))
        }
        await Promise.all(p)
        //upload 
        const image = []
        for (const item of req.files) {
            const { secure_url } = await cloud.uploader.upload(item.path)
            image.push(secure_url)
        }
        const allImage = img.concat(image)
        await Product.findByIdAndUpdate(pid, { ...req.body, image: allImage })
        res.json({ message: "product update success" })

    })
})
exports.deleteProduct = expressAsyncHandler(async (req, res) => {
    const { pid } = req.params
    const result = await Product.findById(pid)

    const p = []
    for (const item of result.image) {
        const name = path.basename(item).split(".")[0]
        p.push(cloud.uploader.destroy(name))
    }
    await Promise.all(p)
    await Product.findByIdAndDelete(pid)

    res.json({ message: "product delete success" })
})
exports.viewUsers = async (req, res) => {
    const result = await User.find()
    res.json({ messag: "admin user fetch success", result })
}
exports.activeUser = async (req, res) => {
    const { id } = req.params
    await User.findByIdAndUpdate(id, req.body)
    res.json({ messag: "admin user active success" })
}
exports.deactiveUser = async (req, res) => {
    const { id } = req.params
    await User.findByIdAndUpdate(id, req.body)
    res.json({ messag: "admin user deactive success" })
}
exports.allOrsers = expressAsyncHandler(async (req, res) => {
    const result = await Order.find().populate("user", "-otp -otpSendOn -__v")
        .populate("products.product", "-createdAt -__v").lean();//  object
    // to array 
    const x = result.map(item => {
        return item.products.map(pro => {

            return {
                user: item.user,
                status: item.status,
                paymentMode: item.paymentMode,
                ...pro.product,
                qty: pro.qty,
                _id: item._id,

                varient: pro.product.varients[pro.varientIndex]
            }
        })
    }).flat()
    res.json({ message: "order histery fetch success", result: x })
})
exports.updateOrder = expressAsyncHandler(async (req, res) => {
    const { id } = req.params; // orderId from URL
    const { status, paymentMode } = req.body; // fields tu update karaycha ahet

    // Order find ani update
    const order = await Order.findByIdAndUpdate(
        id,
        { status, paymentMode },
        { new: true } // updated order return honar
    );

    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    res.json({ message: "Order updated successfully", order });
});



