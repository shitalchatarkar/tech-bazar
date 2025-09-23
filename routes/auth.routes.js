const { registerAdmin, loginAdmin, logoutAdmin, register, sendOTP, login, logout, } = require("../controllers/auth.controller")

const router = require("express").Router()

router
    .post("/admin-register", registerAdmin)
    .post("/admin-login", loginAdmin)
    .post("/admin-logout", logoutAdmin)


    .post("/register", register)
    .post("/otp", sendOTP)
    .post("/login", login)
    .post("/logout", logout)

module.exports = router