const express = require("express");

const {
    register,
    login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Protected test route
router.get("/profile", authMiddleware, (req, res) => {
    res.status(200).json({
        status: 200,
        message: "You are authenticated",
        user: req.user
    });
});

module.exports = router;