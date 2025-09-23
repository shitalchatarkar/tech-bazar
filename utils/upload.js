const multer = require("multer")

const productUpload = multer({ storage: multer.diskStorage({}) }).array("image", 5)

module.exports = productUpload