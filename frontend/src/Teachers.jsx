import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";
import { useNavigate } from "react-router-dom";

function Teachers() {
    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState(null);

    const [formData, setFormData] = useState({
        teacher_name: "",
        email: "",
        phone: "",
        department_id: "",
        subject: "",
        experience: "",
        salary: "",
        gender: ""
    });

    // =========================
    // GET TEACHERS
    // =========================
    const getTeachers = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teachers/get.php`
            );

            if (response.data.status === 200) {
                setTeachers(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );

                setError("");
            } else {
                setTeachers([]);

                setError(
                    response.data.message ||
                    "Unable to load teachers."
                );
            }
        } catch (error) {
            console.error("Get teachers error:", error);

            setTeachers([]);

            setError(
                "Unable to connect to the backend."
            );
        }
    };

    // =========================
    // GET DEPARTMENTS
    // =========================
    const getDepartments = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/departments/get.php`
            );

            if (response.data.status === 200) {
                setDepartments(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            }
        } catch (error) {
            console.error(
                "Get departments error:",
                error
            );

            setDepartments([]);
        }
    };

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                getTeachers(),
                getDepartments()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // =========================
    // EDIT TEACHER
    // =========================
    const handleEdit = (teacher) => {
        setEditingTeacher(teacher);

        setFormData({
            teacher_name: teacher.teacher_name || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            department_id: String(
                teacher.department_id || ""
            ),
            subject: teacher.subject || "",
            experience: teacher.experience || "",
            salary: teacher.salary || "",
            gender: teacher.gender || ""
        });

        setShowForm(true);
    };

    // =========================
    // RESET FORM
    // =========================
    const resetForm = () => {
        setFormData({
            teacher_name: "",
            email: "",
            phone: "",
            department_id: "",
            subject: "",
            experience: "",
            salary: "",
            gender: ""
        });

        setEditingTeacher(null);
        setShowForm(false);
    };

    // =========================
    // ADD / UPDATE TEACHER
    // =========================
    const handleSubmitTeacher = async (e) => {
        e.preventDefault();

        if (!formData.teacher_name.trim()) {
            alert("Please enter teacher name.");
            return;
        }

        if (!formData.email.trim()) {
            alert("Please enter email.");
            return;
        }

        if (!formData.department_id) {
            alert("Please select department.");
            return;
        }

        if (!formData.subject.trim()) {
            alert("Please enter subject.");
            return;
        }

        if (
            formData.salary !== "" &&
            Number(formData.salary) < 0
        ) {
            alert("Salary cannot be negative.");
            return;
        }

        try {
            let response;

            const teacherData = {
                teacher_name:
                    formData.teacher_name.trim(),

                email:
                    formData.email.trim(),

                phone:
                    formData.phone.trim(),

                department_id:
                    Number(formData.department_id),

                subject:
                    formData.subject.trim(),

                experience:
                    Number(formData.experience || 0),

                salary:
                    Number(formData.salary || 0),

                gender:
                    formData.gender
            };

            // UPDATE
            if (editingTeacher) {
                response = await axios.post(
                    `${API_BASE_URL}/teachers/update.php`,
                    {
                        id: Number(editingTeacher.id),
                        ...teacherData
                    },
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }

            // CREATE
            else {
                response = await axios.post(
                    `${API_BASE_URL}/teachers/create.php`,
                    teacherData,
                    {
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }

            if (response.data.status === 200) {
                alert(
                    editingTeacher
                        ? "Teacher updated successfully!"
                        : "Teacher added successfully!"
                );

                resetForm();

                await getTeachers();

            } else {
                alert(
                    response.data.message ||
                    "Unable to save teacher."
                );
            }

        } catch (error) {
            console.error(
                "Save teacher error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to connect to the backend."
            );
        }
    };

    // =========================
    // DELETE TEACHER
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this teacher?"
            );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_BASE_URL}/teachers/delete.php`,
                {
                    data: {
                        id: Number(id)
                    },
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );

            if (response.data.status === 200) {
                alert(
                    "Teacher deleted successfully!"
                );

                await getTeachers();
            } else {
                alert(
                    response.data.message ||
                    "Unable to delete teacher."
                );
            }

        } catch (error) {
            console.error(
                "Delete teacher error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to connect to the backend."
            );
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div style={styles.loadingPage}>
                <h2>Loading teachers...</h2>
            </div>
        );
    }

    // =========================
    // PAGE
    // =========================
    return (
        <div style={styles.page}>

            {/* =========================
                HEADER
            ========================= */}
            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Teachers
                    </h1>

                    <p style={styles.subtitle}>
                        Manage teachers and their information.
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                    style={styles.addButton}
                >
                    <i className="bi bi-plus-lg"></i>
                    {" "}
                    {showForm
                        ? "Close Form"
                        : "Add Teacher"}
                </button>

            </div>

            {/* =========================
                ERROR
            ========================= */}
            {error && (
                <div style={styles.errorBox}>
                    {error}
                </div>
            )}

            {/* =========================
                ADD / EDIT FORM
            ========================= */}
            {showForm && (
                <div style={styles.formCard}>

                    <h2 style={styles.formTitle}>
                        {editingTeacher
                            ? "Edit Teacher"
                            : "Add Teacher"}
                    </h2>

                    <form
                        onSubmit={
                            handleSubmitTeacher
                        }
                    >

                        <div style={styles.formGrid}>

                            {/* NAME */}
                            <div>
                                <label style={labelStyle}>
                                    Teacher Name *
                                </label>

                                <input
                                    type="text"
                                    name="teacher_name"
                                    value={
                                        formData.teacher_name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter teacher name"
                                    style={inputStyle}
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label style={labelStyle}>
                                    Email *
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter email"
                                    style={inputStyle}
                                />
                            </div>

                            {/* PHONE */}
                            <div>
                                <label style={labelStyle}>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter phone"
                                    style={inputStyle}
                                />
                            </div>

                            {/* DEPARTMENT */}
                            <div>
                                <label style={labelStyle}>
                                    Department *
                                </label>

                                <select
                                    name="department_id"
                                    value={
                                        formData.department_id
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                >
                                    <option value="">
                                        Select Department
                                    </option>

                                    {departments.map(
                                        (department) => (
                                            <option
                                                key={
                                                    department.id
                                                }
                                                value={
                                                    department.id
                                                }
                                            >
                                                {
                                                    department.department_name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>

                            {/* SUBJECT */}
                            <div>
                                <label style={labelStyle}>
                                    Subject *
                                </label>

                                <input
                                    type="text"
                                    name="subject"
                                    value={
                                        formData.subject
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter subject"
                                    style={inputStyle}
                                />
                            </div>

                            {/* EXPERIENCE */}
                            <div>
                                <label style={labelStyle}>
                                    Experience (Years)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    name="experience"
                                    value={
                                        formData.experience
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0"
                                    style={inputStyle}
                                />
                            </div>

                            {/* SALARY */}
                            <div>
                                <label style={labelStyle}>
                                    Monthly Salary (₹)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    name="salary"
                                    value={
                                        formData.salary
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter monthly salary"
                                    style={inputStyle}
                                />
                            </div>

                            {/* GENDER */}
                            <div>
                                <label style={labelStyle}>
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={inputStyle}
                                >
                                    <option value="">
                                        Select Gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                        </div>

                        {/* FORM BUTTONS */}
                        <div style={styles.formActions}>

                            <button
                                type="submit"
                                style={styles.saveButton}
                            >
                                <i className="bi bi-check-lg"></i>
                                {" "}
                                {editingTeacher
                                    ? "Update Teacher"
                                    : "Save Teacher"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* =========================
                TEACHER TABLE
            ========================= */}
            <div style={styles.tableCard}>

                <div style={styles.tableHeader}>
                    <h2 style={styles.tableTitle}>
                        All Teachers
                    </h2>

                    <span style={styles.teacherCount}>
                        {teachers.length} Teachers
                    </span>
                </div>

                <div style={styles.tableScroll}>

                    <table style={styles.table}>

                        <thead>

                            <tr style={styles.tableHeadRow}>

                                <th style={thStyle}>
                                    ID
                                </th>

                                <th style={thStyle}>
                                    TEACHER NAME
                                </th>

                                <th style={thStyle}>
                                    EMAIL
                                </th>

                                <th style={thStyle}>
                                    PHONE
                                </th>

                                <th style={thStyle}>
                                    DEPARTMENT
                                </th>

                                <th style={thStyle}>
                                    SUBJECT
                                </th>

                                <th style={thStyle}>
                                    EXPERIENCE
                                </th>

                                <th style={thStyle}>
                                    SALARY
                                </th>

                                <th style={thStyle}>
                                    GENDER
                                </th>

                                <th style={thStyle}>
                                    ACTION
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {teachers.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="10"
                                        style={styles.emptyCell}
                                    >
                                        No teachers found.
                                    </td>
                                </tr>

                            ) : (

                                teachers.map(
                                    (teacher) => (
                                        <tr
                                            key={
                                                teacher.id
                                            }
                                        >

                                            {/* ID */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.id
                                                }
                                            </td>

                                            {/* NAME */}
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                {
                                                    teacher.teacher_name
                                                }
                                            </td>

                                            {/* EMAIL */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.email
                                                }
                                            </td>

                                            {/* PHONE */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.phone ||
                                                    "-"
                                                }
                                            </td>

                                            {/* DEPARTMENT */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.department_name ||
                                                    "-"
                                                }
                                            </td>

                                            {/* SUBJECT */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.subject ||
                                                    "-"
                                                }
                                            </td>

                                            {/* EXPERIENCE */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.experience ||
                                                    0
                                                }{" "}
                                                years
                                            </td>

                                            {/* SALARY */}
                                            <td style={tdStyle}>
                                                ₹
                                                {Number(
                                                    teacher.salary ||
                                                    0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </td>

                                            {/* GENDER */}
                                            <td style={tdStyle}>
                                                {
                                                    teacher.gender ||
                                                    "-"
                                                }
                                            </td>

                                            {/* ACTION */}
                                            <td
                                                style={{
                                                    ...tdStyle,
                                                    minWidth:
                                                        "320px"
                                                }}
                                            >

                                                {/* VIEW PROFILE */}
                                                <button
                                                    onClick={() =>
                                                        navigate(
                                                            `/teacher-profile/${teacher.id}`
                                                        )
                                                    }
                                                    style={
                                                        styles.viewButton
                                                    }
                                                >
                                                    <i className="bi bi-person-vcard"></i>
                                                    {" "}
                                                    View Profile
                                                </button>

                                                {/* EDIT */}
                                                <button
                                                    onClick={() =>
                                                        handleEdit(
                                                            teacher
                                                        )
                                                    }
                                                    style={
                                                        styles.editButton
                                                    }
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                    {" "}Edit
                                                </button>

                                                {/* DELETE */}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            teacher.id
                                                        )
                                                    }
                                                    style={
                                                        styles.deleteButton
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                    {" "}Delete
                                                </button>

                                            </td>

                                        </tr>
                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}

// =========================
// STYLES
// =========================

const styles = {

    page: {
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "10px 0 30px"
    },

    loadingPage: {
        padding: "30px",
        textAlign: "center"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        marginBottom: "25px",
        flexWrap: "wrap"
    },

    title: {
        fontSize: "30px",
        color: "#172033",
        margin: 0,
        marginBottom: "7px"
    },

    subtitle: {
        color: "#778399",
        margin: 0,
        fontSize: "15px"
    },

    addButton: {
        border: "none",
        background: "#4181ff",
        color: "#ffffff",
        padding: "12px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "600"
    },

    errorBox: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "12px 15px",
        borderRadius: "8px",
        marginBottom: "20px"
    },

    formCard: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "10px",
        padding: "25px",
        marginBottom: "25px"
    },

    formTitle: {
        margin: "0 0 20px",
        color: "#172033",
        fontSize: "21px"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "18px"
    },

    formActions: {
        display: "flex",
        gap: "10px",
        marginTop: "22px"
    },

    saveButton: {
        border: "none",
        background: "#4181ff",
        color: "#ffffff",
        padding: "11px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    cancelButton: {
        border: "none",
        background: "#eef1f5",
        color: "#344054",
        padding: "11px 18px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    tableCard: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "10px",
        overflow: "hidden"
    },

    tableHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 20px",
        borderBottom: "1px solid #dce2eb"
    },

    tableTitle: {
        margin: 0,
        color: "#172033",
        fontSize: "20px"
    },

    teacherCount: {
        color: "#778399",
        fontSize: "14px"
    },

    tableScroll: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        minWidth: "1400px",
        borderCollapse: "collapse"
    },

    tableHeadRow: {
        background: "#f8faff"
    },

    emptyCell: {
        padding: "35px",
        textAlign: "center",
        color: "#778399"
    },

    viewButton: {
        border: "none",
        background: "#0d6efd",
        color: "#ffffff",
        padding: "7px 11px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "7px",
        marginBottom: "5px"
    },

    editButton: {
        border: "none",
        background: "#4181ff",
        color: "#ffffff",
        padding: "7px 11px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "7px",
        marginBottom: "5px"
    },

    deleteButton: {
        border: "none",
        background: "#dc3545",
        color: "#ffffff",
        padding: "7px 11px",
        borderRadius: "6px",
        cursor: "pointer",
        marginBottom: "5px"
    }
};

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#344054",
    fontSize: "14px",
    fontWeight: "600"
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dce2eb",
    borderRadius: "7px",
    padding: "11px 12px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff"
};

const thStyle = {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #dce2eb",
    fontSize: "12px",
    color: "#718096",
    fontWeight: "600",
    whiteSpace: "nowrap"
};

const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #e8edf3",
    fontSize: "14px",
    color: "#273449",
    whiteSpace: "nowrap",
    verticalAlign: "middle"
};

export default Teachers;