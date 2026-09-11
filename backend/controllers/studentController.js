const Student = require("../models/Student");

// ===============================
// GET ALL STUDENTS
// ===============================
const getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            message: "Students fetched successfully",
            data: students
        });

    } catch (error) {
        console.error("Get Students Error:", error);

        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
};


// ===============================
// GET SINGLE STUDENT
// ===============================
const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                status: 404,
                message: "Student not found"
            });
        }

        res.status(200).json({
            status: 200,
            message: "Student fetched successfully",
            data: student
        });

    } catch (error) {
        console.error("Get Student Error:", error);

        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
};


// ===============================
// CREATE STUDENT
// ===============================
const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            course,
            age,
            gender,
            address
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !course ||
            !age ||
            !gender ||
            !address
        ) {
            return res.status(400).json({
                status: 400,
                message: "All student fields are required"
            });
        }

        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {
            return res.status(400).json({
                status: 400,
                message: "Student email already exists"
            });
        }

        const student = await Student.create({
            name,
            email,
            phone,
            course,
            age,
            gender,
            address
        });

        res.status(201).json({
            status: 201,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {
        console.error("Create Student Error:", error);

        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
};


// ===============================
// UPDATE STUDENT
// ===============================
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                status: 404,
                message: "Student not found"
            });
        }

        res.status(200).json({
            status: 200,
            message: "Student updated successfully",
            data: student
        });

    } catch (error) {
        console.error("Update Student Error:", error);

        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
};


// ===============================
// DELETE STUDENT
// ===============================
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                status: 404,
                message: "Student not found"
            });
        }

        res.status(200).json({
            status: 200,
            message: "Student deleted successfully"
        });

    } catch (error) {
        console.error("Delete Student Error:", error);

        res.status(500).json({
            status: 500,
            message: "Server error"
        });
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent
};