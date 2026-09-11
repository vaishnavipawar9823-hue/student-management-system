import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "./api/config";
import StudentModal from "./StudentModal";

function StudentManagement() {
    const location = useLocation();

    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState(
        location.state?.search || ""
    );
    const [courseFilter, setCourseFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);

    /* =========================
       Global Search
    ========================= */

    useEffect(() => {
        if (location.state?.search !== undefined) {
            setSearch(location.state.search);
        }
    }, [location.state]);


    /* =========================
       Get Students
    ========================= */

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/students/get.php`,
                    {
                        withCredentials: true
                    }
                );

                if (response.data.status === 200) {
                    setStudents(response.data.data);
                } else {
                    setError(response.data.message);
                }

            } catch (error) {
                console.error(error);
                setError("Unable to load students.");

            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);


    /* =========================
       Update Student
    ========================= */

    const handleUpdate = async () => {
        try {
            const data = new FormData();

            data.append("id", editingStudent.id);
            data.append("name", editingStudent.name);
            data.append("email", editingStudent.email);
            data.append("phone", editingStudent.phone);
            data.append("course", editingStudent.course);
            data.append("age", editingStudent.age);
            data.append("gender", editingStudent.gender);
            data.append("address", editingStudent.address);

            if (editingStudent.profile_image instanceof File) {
                data.append(
                    "profile_image",
                    editingStudent.profile_image
                );
            }

            const response = await axios.post(
                `${API_BASE_URL}/students/update.php`,
                data,
                {
                    withCredentials: true
                }
            );

            if (response.data.status === 200) {
                alert("Student updated successfully!");

                setStudents(
                    students.map((student) =>
                        student.id === editingStudent.id
                            ? response.data.data
                            : student
                    )
                );

                setEditingStudent(null);

            } else {
                alert(response.data.message);
            }

        } catch (error) {
            console.error("Update student error:", error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Unable to update student."
                );
            } else {
                alert("Unable to connect to PHP server.");
            }
        }
    };


    /* =========================
       Delete Student
    ========================= */

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await axios.delete(
                `${API_BASE_URL}/students/delete.php`,
                {
                    data: {
                        id: id
                    },
                    withCredentials: true
                }
            );

            if (response.data.status === 200) {
                alert("Student deleted successfully!");

                setStudents(
                    students.filter(
                        (student) => student.id !== id
                    )
                );

            } else {
                alert(response.data.message);
            }

        } catch (error) {
            console.error("Delete student error:", error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Unable to delete student."
                );
            } else {
                alert("Unable to connect to PHP server.");
            }
        }
    };


    /* =========================
       Search + Course Filter
    ========================= */

    const filteredStudents = students.filter((student) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            student.name
                .toLowerCase()
                .includes(searchText) ||
            student.email
                .toLowerCase()
                .includes(searchText);

        const matchesCourse =
            courseFilter === "" ||
            student.course === courseFilter;

        return matchesSearch && matchesCourse;
    });


    /* =========================
       Loading
    ========================= */

    if (loading) {
        return <h2>Loading students...</h2>;
    }


    /* =========================
       Error
    ========================= */

    if (error) {
        return <h2>{error}</h2>;
    }


    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "0 auto"
            }}
        >

            {/* =========================
               PAGE HEADING
            ========================= */}

            <div
                style={{
                    marginBottom: "28px"
                }}
            >

                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Student Management
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    View all students registered in the database.
                </p>

            </div>


            {/* =========================
               TOTAL STUDENTS CARD
            ========================= */}

            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "8px",
                    padding: "22px",
                    marginBottom: "24px"
                }}
            >

                <h2
                    style={{
                        fontSize: "20px",
                        marginBottom: "10px",
                        color: "#172033"
                    }}
                >
                    Total Students
                </h2>

                <div
                    style={{
                        fontSize: "32px",
                        color: "#2878ff",
                        fontWeight: "600"
                    }}
                >
                    {students.length}
                </div>

            </div>


            {/* =========================
               STUDENT TABLE CARD
            ========================= */}

            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}
            >

                {/* Header */}

                <div
                    style={{
                        padding: "18px 20px",
                        borderBottom: "1px solid #dce2eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap"
                    }}
                >

                    <h2
                        style={{
                            fontSize: "20px",
                            color: "#172033"
                        }}
                    >
                        All Students
                    </h2>


                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap"
                        }}
                    >

                        {/* Search */}

                        <input
                            type="text"
                            placeholder="Search student..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                height: "40px",
                                width: "220px",
                                border: "1px solid #dce2eb",
                                borderRadius: "7px",
                                padding: "0 12px",
                                outline: "none",
                                fontSize: "14px"
                            }}
                        />


                        {/* Course Filter */}

                        <select
                            value={courseFilter}
                            onChange={(e) =>
                                setCourseFilter(e.target.value)
                            }
                            style={{
                                height: "40px",
                                border: "1px solid #dce2eb",
                                borderRadius: "7px",
                                padding: "0 12px",
                                background: "white",
                                fontSize: "14px"
                            }}
                        >

                            <option value="">
                                All Courses
                            </option>

                            <option value="Computer Science">
                                Computer Science
                            </option>

                            <option value="Information Technology">
                                Information Technology
                            </option>

                            <option value="Computer Applications">
                                Computer Applications
                            </option>

                            <option value="Data Science">
                                Data Science
                            </option>

                            <option value="Web Development">
                                Web Development
                            </option>

                        </select>

                    </div>

                </div>


                {/* =========================
                   TABLE
                ========================= */}

                <div
                    style={{
                        overflowX: "auto"
                    }}
                >

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "1000px"
                        }}
                    >

                        <thead>

                            <tr
                                style={{
                                    background: "#f8faff"
                                }}
                            >

                                <th style={thStyle}>
                                    ID
                                </th>

                                <th style={thStyle}>
                                    PHOTO
                                </th>

                                <th style={thStyle}>
                                    NAME
                                </th>

                                <th style={thStyle}>
                                    EMAIL
                                </th>

                                <th style={thStyle}>
                                    MOBILE
                                </th>

                                <th style={thStyle}>
                                    GENDER
                                </th>

                                <th style={thStyle}>
                                    COURSE
                                </th>

                                <th style={thStyle}>
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredStudents.map((student) => (

                                <tr key={student.id}>

                                    {/* ID */}

                                    <td style={tdStyle}>
                                        {student.id}
                                    </td>


                                    {/* Photo */}

                                    <td style={tdStyle}>

                                        {student.profile_image ? (

                                            <img
                                                src={`${API_BASE_URL}/uploads/${student.profile_image}`}
                                                alt={student.name}
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "50%",
                                                    background: "#eef3ff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#4181ff"
                                                }}
                                            >
                                                <i className="bi bi-person"></i>
                                            </div>

                                        )}

                                    </td>


                                    {/* Name */}

                                    <td
                                        style={{
                                            ...tdStyle,
                                            fontWeight: "600"
                                        }}
                                    >
                                        {student.name}
                                    </td>


                                    {/* Email */}

                                    <td style={tdStyle}>
                                        {student.email}
                                    </td>


                                    {/* Phone */}

                                    <td style={tdStyle}>
                                        {student.phone}
                                    </td>


                                    {/* Gender */}

                                    <td style={tdStyle}>

                                        <span
                                            style={{
                                                background:
                                                    student.gender === "Female"
                                                        ? "#fff0f6"
                                                        : "#eef3ff",
                                                color:
                                                    student.gender === "Female"
                                                        ? "#d14d8b"
                                                        : "#2878ff",
                                                padding: "6px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {student.gender}
                                        </span>

                                    </td>


                                    {/* Course */}

                                    <td style={tdStyle}>
                                        {student.course}
                                    </td>


                                    {/* Actions */}

                                    <td style={tdStyle}>

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px"
                                            }}
                                        >

                                            {/* View */}

                                            <button
                                                onClick={() =>
                                                    setSelectedStudent(
                                                        student
                                                    )
                                                }
                                                style={viewButtonStyle}
                                            >
                                                <i className="bi bi-eye"></i>
                                                <span>View</span>
                                            </button>


                                            {/* Edit */}

                                            <button
                                                onClick={() =>
                                                    setEditingStudent({
                                                        ...student
                                                    })
                                                }
                                                style={editButtonStyle}
                                            >
                                                <i className="bi bi-pencil"></i>
                                                <span>Edit</span>
                                            </button>


                                            {/* Delete */}

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        student.id
                                                    )
                                                }
                                                style={deleteButtonStyle}
                                            >
                                                <i className="bi bi-trash"></i>
                                                <span>Delete</span>
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {/* No Results */}

                {filteredStudents.length === 0 && (

                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#778399"
                        }}
                    >
                        No students found.
                    </div>

                )}

            </div>


            {/* =========================
               VIEW MODAL
            ========================= */}

            <StudentModal
                student={selectedStudent}
                onClose={() =>
                    setSelectedStudent(null)
                }
            />


            {/* =========================
               EDIT STUDENT
            ========================= */}

            {editingStudent && (

                <div
                    style={{
                        marginTop: "24px",
                        background: "#ffffff",
                        border: "1px solid #dce2eb",
                        borderRadius: "8px",
                        padding: "25px"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "20px",
                            color: "#172033"
                        }}
                    >
                        Edit Student
                    </h2>


                    {/* Edit Inputs */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "15px"
                        }}
                    >

                        {/* Name */}

                        <input
                            type="text"
                            placeholder="Name"
                            value={editingStudent.name}
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    name: e.target.value
                                })
                            }
                            style={inputStyle}
                        />


                        {/* Email */}

                        <input
                            type="email"
                            placeholder="Email"
                            value={editingStudent.email}
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    email: e.target.value
                                })
                            }
                            style={inputStyle}
                        />


                        {/* Phone */}

                        <input
                            type="text"
                            placeholder="Phone"
                            value={editingStudent.phone}
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    phone: e.target.value
                                })
                            }
                            style={inputStyle}
                        />


                        {/* Course */}

                        <input
                            type="text"
                            placeholder="Course"
                            value={editingStudent.course}
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    course: e.target.value
                                })
                            }
                            style={inputStyle}
                        />


                        {/* Age */}

                        <input
                            type="number"
                            placeholder="Age"
                            value={editingStudent.age}
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    age: e.target.value
                                })
                            }
                            style={inputStyle}
                        />


                        {/* Gender */}

                        <select
                            value={editingStudent.gender}
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    gender: e.target.value
                                })
                            }
                            style={inputStyle}
                        >
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


                    {/* Address */}

                    <textarea
                        placeholder="Address"
                        value={editingStudent.address}
                        onChange={(e) =>
                            setEditingStudent({
                                ...editingStudent,
                                address: e.target.value
                            })
                        }
                        style={{
                            ...inputStyle,
                            width: "100%",
                            marginTop: "15px",
                            minHeight: "100px",
                            paddingTop: "12px",
                            resize: "vertical"
                        }}
                    />


                    {/* Profile Image */}

                    <div
                        style={{
                            marginTop: "18px"
                        }}
                    >

                        <label
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#39455a",
                                fontWeight: "600",
                                fontSize: "14px"
                            }}
                        >
                            Profile Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setEditingStudent({
                                    ...editingStudent,
                                    profile_image:
                                        e.target.files[0]
                                })
                            }
                        />

                    </div>


                    {/* Current Photo */}

                    {typeof editingStudent.profile_image ===
                        "string" &&
                        editingStudent.profile_image && (

                            <div
                                style={{
                                    marginTop: "18px"
                                }}
                            >

                                <p
                                    style={{
                                        marginBottom: "8px",
                                        color: "#778399",
                                        fontSize: "13px"
                                    }}
                                >
                                    Current Photo
                                </p>

                                <img
                                    src={`${API_BASE_URL}/uploads/${editingStudent.profile_image}`}
                                    alt={editingStudent.name}
                                    style={{
                                        width: "75px",
                                        height: "75px",
                                        objectFit: "cover",
                                        borderRadius: "50%"
                                    }}
                                />

                            </div>

                        )}


                    {/* Update Buttons */}

                    <div
                        style={{
                            marginTop: "20px"
                        }}
                    >

                        <button
                            onClick={handleUpdate}
                            style={updateButtonStyle}
                        >
                            <i
                                className="bi bi-check2"
                                style={{
                                    marginRight: "7px"
                                }}
                            ></i>

                            Update Student
                        </button>


                        <button
                            onClick={() =>
                                setEditingStudent(null)
                            }
                            style={cancelButtonStyle}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}


/* =========================
   TABLE HEADER
========================= */

const thStyle = {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #dce2eb",
    fontSize: "12px",
    color: "#718096",
    fontWeight: "600",
    whiteSpace: "nowrap"
};


/* =========================
   TABLE CELL
========================= */

const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #e8edf3",
    fontSize: "14px",
    color: "#273449",
    whiteSpace: "nowrap"
};


/* =========================
   VIEW BUTTON
========================= */

const viewButtonStyle = {
    border: "1px solid #2878ff",
    background: "#eef3ff",
    color: "#2878ff",
    borderRadius: "6px",
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px"
};


/* =========================
   EDIT BUTTON
========================= */

const editButtonStyle = {
    border: "1px solid #6c63ff",
    background: "#f1efff",
    color: "#6c63ff",
    borderRadius: "6px",
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px"
};


/* =========================
   DELETE BUTTON
========================= */

const deleteButtonStyle = {
    border: "1px solid #d64545",
    background: "#fff0f0",
    color: "#d64545",
    borderRadius: "6px",
    padding: "7px 10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px"
};


/* =========================
   EDIT INPUT
========================= */

const inputStyle = {
    height: "42px",
    border: "1px solid #dce2eb",
    borderRadius: "7px",
    padding: "0 12px",
    outline: "none",
    fontSize: "14px",
    background: "white",
    color: "#273449"
};


/* =========================
   UPDATE BUTTON
========================= */

const updateButtonStyle = {
    background: "#2878ff",
    color: "#ffffff",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    marginRight: "10px"
};


/* =========================
   CANCEL BUTTON
========================= */

const cancelButtonStyle = {
    background: "#eef1f5",
    color: "#39455a",
    border: "none",
    padding: "11px 18px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600"
};


export default StudentManagement;