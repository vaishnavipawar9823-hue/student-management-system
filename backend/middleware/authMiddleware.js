const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 401,
                message: "Authentication token is required"
            });
        }

        // Expected format:
        // Bearer TOKEN
        const parts = authHeader.split(" ");

        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({
                status: 401,
                message: "Invalid authentication format"
            });
        }

        const token = parts[1];

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information in request
        req.user = decoded;

        next();

    } catch (error) {
        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            status: 401,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;