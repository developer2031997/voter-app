const jwt = require('jsonwebtoken');

const JWTMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Unauthorized" });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn : 3000});
};

module.exports = { JWTMiddleware, generateToken };
