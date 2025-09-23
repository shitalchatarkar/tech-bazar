const jwt = require("jsonwebtoken");

const adminMIddleware = (req, res, next) => {
    try {
        const token = req.cookies?.ADMIN;
        if (!token) {
            return res.status(401).json({ message: "No admin token, access denied" });
        }

        jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }
            req.admin = decode._id
            next()
        })
    } catch (err) {
        console.error("Admin auth error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { adminMIddleware };