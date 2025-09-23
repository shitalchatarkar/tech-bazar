const jwt = require("jsonwebtoken");

const usermiddleware = (req, res, next) => {
    try {
        const token = req.cookies.USER;
        if (!token)
            return res.status(401).json({ message: "No user token, access denied" });

        jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }
            req.user = decode._id
            next()
        })
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = { usermiddleware };