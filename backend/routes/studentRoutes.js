const express = require("express");

const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// GET ALL STUDENTS
router.get("/", authMiddleware, getStudents);


// GET SINGLE STUDENT
router.get("/:id", authMiddleware, getStudent);


// CREATE STUDENT
router.post("/", authMiddleware, createStudent);


// UPDATE STUDENT
router.put("/:id", authMiddleware, updateStudent);


// DELETE STUDENT
router.delete("/:id", authMiddleware, deleteStudent);


module.exports = router;