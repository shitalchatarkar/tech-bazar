const Admin = require("../models/Admin")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const sendEmail = require("../utils/email")
const { differenceInSeconds } = require("date-fns")
// const upload = require("../utils/upload")
// const cloud = require("./../utils/cloud")
// const User = require("../models/User")
const expressAsyncHandler = require("express-async-handler")
const registerAdmin = expressAsyncHandler(async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10)
    await Admin.create({ ...req.body, password: hash })
    res.json({ message: "admin register success" })
})
const loginAdmin = expressAsyncHandler(async (req, res) => {

    const { email, password } = req.body
    const result = await Admin.findOne({ email })

    if (!result) {
        return res.status(401).json({ message: "invalid credentials email" })
    }

    const verify = await bcrypt.compare(password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "invalid credentials password" })
    }
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, secure: false, httpOnly: true })
    res.json({
        message: "admin login success", result: {
            _id: result._id,
            name: result.name,
            email: result.email,
        }
    })
})
const logoutAdmin = expressAsyncHandler((req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "admin logout success" })
})

// const registerUser = expressAsyncHandler((req, res) => {
//     upload(req, res, async err => {
//         if (err) {
//             console.log(err)
//             return res.status(400).json({ message: "unable to upload" })
//         }
//         if (!req.file) {
//             return res.status(400).json({ message: "photo is required" })
//         }
//         const { secure_url } = await cloud.uploader.upload(req.file.path)
//         const password = req.body.name.split("").slice(0, 2).join("")
//             + req.body.email.split("").slice(0, 2).join("")

//         const hash = await bcrypt.hash(password, 10)
//         await User.create({ ...req.body, password: hash, photo: secure_url })
//         res.json({ message: "register user success" })
//     })
// })
// const loginUser = expressAsyncHandler(async (req, res) => {
//     const { email, password } = req.body
//     const result = await User.findOne({ email })

//     if (!result) {
//         return res.status(401).json({ message: "invalid credentials email" })
//     }

//     const verify = await bcrypt.compare(password, result.password)
//     if (!verify) {
//         return res.status(401).json({ message: "invalid credentials password" })
//     }
//     if (!result.active) {
//         return res.status(401).json({ message: "account blocked by admin" })
//     }

//     const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
//     res.cookie("USER", token, { maxAge: 1000 * 60 * 60 * 24, secure: false, httpOnly: true })
//     res.json({
//         message: "User login success", result: {
//             _id: result._id,
//             name: result.name,
//             email: result.email,
//             photo: result.photo
//         }
//     })
// })
// const logoutUser = expressAsyncHandler((req, res) => {
//     res.clearCookie("USER")
//     res.json({ message: "user logout success" })
// })
const register = async (req, res, next) => {
    try {
        const { email, name, address } = req.body
        const result = await User.findOne({ $or: [{ email }, { name }, { address }] })
        if (result) {
            return res.status(400).json({ message: "email  already exit" })
        }
        await User.create(req.body)
        await sendEmail({ to: email, subject: "welcome to skillhub", message: "please see our email" })
        res.json({ message: "register success" })
    } catch (error) {
        next(error)

    }
    // res.json({ message: "register success" })
}

const sendOTP = async (req, res, next) => {

    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: "amail or mobile does not  exit" })
        }
        const result = await User.findOne({ email })
        if (!result) {
            return res.status(400).json({ message: "amail or mobile does not  exit" })
        }
        const OTP = Math.floor(100000 + Math.random() * 900000)
        await User.findByIdAndUpdate(result._id, { otp: OTP, otpSendOn: new Date() })
        // await sendSms({ message: `your otp is ${OTP}`, number: result.mobile })
        await sendEmail({
            to: result.email,
            subject: "otp",
            message: `your otp is ${OTP}`
        })
        res.json({ message: "otp send dsuccess" })
    } catch (error) {
        next(error)

    }
}




const login = async (req, res, next) => {
    try {
        const { email, otp } = req.body
        const result = await User.findOne({ $or: [{ email: email }] })
        if (!result) {
            return res.status(401).json({ message: "invalid cretential" })
        }
        if (otp != result.otp) {
            return res.status(401).json({ message: "invalid otp" })
        }
        if (differenceInSeconds(new Date(), result.otpSendOn) > 120) {
            await User.findByIdAndUpdate(result._id, { otp: null })
            return res.status(401).json({ message: "expired otp" })
        }
        await User.findByIdAndUpdate(result._id, { otp: null })
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("USER", token, {
            maxAge: 10000 * 60 * 60 * 24, secure: process.env.NODE_ENVIRMENT === "production",
            httpOnly: true
        })
        // res.json({
        //     message: "login success",
        //     result: {
        //         _id: result._id,
        //         email: result.email,
        //         // mobile: result.mobile,
        //     }
        // })
        res.json({ message: "login success", user: result })
    } catch (error) {
        next(error)

    }
}
const logout = async (req, res) => {
    res.clearCookie("USER")
    res.json({ message: "logout success" })
}
module.exports = {
    register,
    login, logout,
    sendOTP,

    registerAdmin,
    loginAdmin,
    logoutAdmin



}