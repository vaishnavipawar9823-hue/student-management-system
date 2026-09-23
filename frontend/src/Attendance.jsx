import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Attendance() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    // =========================
    // GET STUDENTS
    // =========================
    const getStudents = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/students/get.php`,
                {
                    withCredentials: true
                }
            );

            if (
                response.data.status === 200 &&
                Array.isArray(response.data.data)
            ) {
                setStudents(response.data.data);
            } else {
                setStudents([]);
                setError(
                    response.data.message ||
                    "Students could not be loaded."
                );
            }
        } catch (error) {
            console.error("Get students error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load students from the PHP API."
            );
        }
    };

    // =========================
    // GET ATTENDANCE
    // =========================
    const getAttendance = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/attendance/get.php`
            );

            if (
                response.data.status === 200 &&
                Array.isArray(response.data.data)
            ) {
                setAttendance(response.data.data);
            } else {
                setAttendance([]);
                setError(
                    response.data.message ||
                    "Unable to load attendance."
                );
            }
        } catch (error) {
            console.error("Get attendance error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to connect to the backend."
            );
        }
    };

    // =========================
    // GET STUDENT STATUS
    // =========================
    const getStudentStatus = (studentId) => {
        const record = attendance.find(
            (item) =>
                Number(item.student_id) === Number(studentId) &&
                item.attendance_date === selectedDate
        );

        return record ? record.status : "";
    };

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");

            try {
                await Promise.all([
                    getStudents(),
                    getAttendance()
                ]);
            } catch (error) {
                console.error("Load attendance error:", error);
                setError("Unable to load attendance.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    // =========================
    // MARK ATTENDANCE
    // =========================
    const markAttendance = async (studentId, status) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/attendance/create.php`,
                {
                    student_id: Number(studentId),
                    attendance_date: selectedDate,
                    status: status
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.status === 200) {
                alert(
                    response.data.message ||
                    "Attendance marked successfully!"
                );

                await getAttendance();
            } else {
                alert(
                    response.data.message ||
                    "Unable to save attendance."
                );
            }
        } catch (error) {
            console.error("Mark attendance error:", error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Unable to save attendance."
                );
            } else {
                alert("Unable to connect to the backend.");
            }
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>Loading attendance...</h2>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div style={{ padding: "30px" }}>
                <h2>{error}</h2>
            </div>
        );
    }

    // =========================
    // COUNTS
    // =========================
    const presentCount = students.filter(
        (student) =>
            getStudentStatus(student.id) === "Present"
    ).length;

    const absentCount = students.filter(
        (student) =>
            getStudentStatus(student.id) === "Absent"
    ).length;

    const lateCount = students.filter(
        (student) =>
            getStudentStatus(student.id) === "Late"
    ).length;

    // =========================
    // PAGE
    // =========================
    return (
        <div
            style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "20px"
            }}
        >
            {/* =========================
                HEADER
            ========================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "28px"
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "30px",
                            color: "#172033",
                            marginBottom: "8px"
                        }}
                    >
                        Attendance
                    </h1>

                    <p
                        style={{
                            color: "#778399",
                            fontSize: "15px",
                            margin: 0
                        }}
                    >
                        Manage student attendance.
                    </p>
                </div>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) =>
                        setSelectedDate(e.target.value)
                    }
                    style={{
                        border: "1px solid #dce2eb",
                        borderRadius: "7px",
                        padding: "10px 12px",
                        fontSize: "14px"
                    }}
                />
            </div>

            {/* =========================
                SUMMARY CARDS
            ========================= */}

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "16px",
                    marginBottom: "24px"
                }}
            >
                <SummaryCard
                    title="Total Students"
                    value={students.length}
                    icon="bi-people"
                />

                <SummaryCard
                    title="Present"
                    value={presentCount}
                    icon="bi-check-circle"
                />

                <SummaryCard
                    title="Absent"
                    value={absentCount}
                    icon="bi-x-circle"
                />

                <SummaryCard
                    title="Late"
                    value={lateCount}
                    icon="bi-clock"
                />
            </div>

            {/* =========================
                ATTENDANCE TABLE
            ========================= */}

            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        padding: "18px 20px",
                        borderBottom: "1px solid #dce2eb"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            color: "#172033",
                            margin: 0
                        }}
                    >
                        Student Attendance
                    </h2>
                </div>

                <div
                    style={{
                        overflowX: "auto"
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            minWidth: "1000px",
                            borderCollapse: "collapse"
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#f8faff"
                                }}
                            >
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>STUDENT</th>
                                <th style={thStyle}>COURSE</th>
                                <th style={thStyle}>DATE</th>
                                <th style={thStyle}>STATUS</th>
                                <th style={thStyle}>
                                    MARK ATTENDANCE
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {students.map((student) => {
                                const status =
                                    getStudentStatus(student.id);

                                return (
                                    <tr key={student.id}>
                                        <td style={tdStyle}>
                                            {student.id}
                                        </td>

                                        <td
                                            style={{
                                                ...tdStyle,
                                                fontWeight: "600"
                                            }}
                                        >
                                            {student.name}
                                        </td>

                                        <td style={tdStyle}>
                                            {student.course}
                                        </td>

                                        <td style={tdStyle}>
                                            {selectedDate}
                                        </td>

                                        <td style={tdStyle}>
                                            <span
                                                style={{
                                                    display:
                                                        "inline-block",
                                                    padding:
                                                        "6px 10px",
                                                    borderRadius:
                                                        "20px",
                                                    background:
                                                        status ===
                                                        "Present"
                                                            ? "#d1fae5"
                                                            : status ===
                                                              "Absent"
                                                            ? "#fee2e2"
                                                            : status ===
                                                              "Late"
                                                            ? "#fef3c7"
                                                            : "#eef1f5",
                                                    color:
                                                        status ===
                                                        "Present"
                                                            ? "#047857"
                                                            : status ===
                                                              "Absent"
                                                            ? "#b91c1c"
                                                            : status ===
                                                              "Late"
                                                            ? "#b45309"
                                                            : "#667085",
                                                    fontSize: "12px",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {status ||
                                                    "Not Marked"}
                                            </span>
                                        </td>

                                        <td style={tdStyle}>
                                            <button
                                                onClick={() =>
                                                    markAttendance(
                                                        student.id,
                                                        "Present"
                                                    )
                                                }
                                                style={{
                                                    ...buttonStyle,
                                                    background:
                                                        "#198754"
                                                }}
                                            >
                                                <i className="bi bi-check-lg"></i>{" "}
                                                Present
                                            </button>

                                            <button
                                                onClick={() =>
                                                    markAttendance(
                                                        student.id,
                                                        "Absent"
                                                    )
                                                }
                                                style={{
                                                    ...buttonStyle,
                                                    background:
                                                        "#dc3545"
                                                }}
                                            >
                                                <i className="bi bi-x-lg"></i>{" "}
                                                Absent
                                            </button>

                                            <button
                                                onClick={() =>
                                                    markAttendance(
                                                        student.id,
                                                        "Late"
                                                    )
                                                }
                                                style={{
                                                    ...buttonStyle,
                                                    background:
                                                        "#f59e0b"
                                                }}
                                            >
                                                <i className="bi bi-clock"></i>{" "}
                                                Late
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {students.length === 0 && (
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
        </div>
    );
}

// =========================
// SUMMARY CARD
// =========================

function SummaryCard({ title, value, icon }) {
    return (
        <div
            style={{
                background: "#ffffff",
                border: "1px solid #dce2eb",
                borderRadius: "8px",
                padding: "20px"
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}
            >
                <i
                    className={`bi ${icon}`}
                    style={{
                        fontSize: "22px"
                    }}
                ></i>

                <div>
                    <p
                        style={{
                            margin: 0,
                            color: "#778399",
                            fontSize: "13px"
                        }}
                    >
                        {title}
                    </p>

                    <h2
                        style={{
                            margin: "5px 0 0",
                            color: "#172033"
                        }}
                    >
                        {value}
                    </h2>
                </div>
            </div>
        </div>
    );
}

// =========================
// BUTTON STYLE
// =========================

const buttonStyle = {
    color: "#ffffff",
    border: "none",
    padding: "7px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
    marginBottom: "4px",
    fontSize: "12px",
    fontWeight: "600"
};

// =========================
// TABLE HEADER STYLE
// =========================

const thStyle = {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #dce2eb",
    fontSize: "12px",
    color: "#718096",
    fontWeight: "600",
    whiteSpace: "nowrap"
};

// =========================
// TABLE DATA STYLE
// =========================

const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #e8edf3",
    fontSize: "14px",
    color: "#273449",
    whiteSpace: "nowrap"
};

export default Attendance;