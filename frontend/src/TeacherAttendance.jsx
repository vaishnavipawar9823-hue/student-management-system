import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost/student-management-api";

const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const TeacherAttendance = () => {
    const [teachers, setTeachers] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(getToday());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Get teachers
    const getTeachers = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teachers/get.php`,
                {
                    withCredentials: true,
                }
            );

            if (response.data.status === 200) {
                setTeachers(response.data.data);
            } else {
                setError("Unable to load teachers.");
            }
        } catch (error) {
            console.error("Get teachers error:", error);
            setError("Unable to connect to the backend.");
        }
    };

    // Get teacher attendance for selected date
    const getAttendance = async (date = selectedDate) => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teacher_attendance/get.php`,
                {
                    params: {
                        date: date,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.status === 200) {
                setAttendance(response.data.data);
            } else {
                setAttendance([]);
            }
        } catch (error) {
            console.error("Get attendance error:", error);
            setError("Unable to load teacher attendance.");
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");

            await Promise.all([
                getTeachers(),
                getAttendance(selectedDate),
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // Get status for one teacher
    const getTeacherStatus = (teacherId) => {
        const record = attendance.find(
            (item) =>
                Number(item.teacher_id) === Number(teacherId) &&
                item.attendance_date === selectedDate
        );

        return record ? record.status : "";
    };

    // Mark attendance
    const markAttendance = async (teacherId, status) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/teacher_attendance/create.php`,
                {
                    teacher_id: teacherId,
                    attendance_date: selectedDate,
                    status: status,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.status === 200) {
                await getAttendance(selectedDate);
                setError("");
            } else {
                setError(
                    response.data.message ||
                        "Unable to mark attendance."
                );
            }
        } catch (error) {
            console.error("Mark attendance error:", error);
            setError("Unable to mark teacher attendance.");
        }
    };

    // Date change
    const handleDateChange = async (e) => {
        const newDate = e.target.value;

        setSelectedDate(newDate);
        await getAttendance(newDate);
    };

    const presentCount = teachers.filter(
        (teacher) =>
            getTeacherStatus(teacher.id) === "Present"
    ).length;

    const absentCount = teachers.filter(
        (teacher) =>
            getTeacherStatus(teacher.id) === "Absent"
    ).length;

    const lateCount = teachers.filter(
        (teacher) =>
            getTeacherStatus(teacher.id) === "Late"
    ).length;

    if (loading) {
        return (
            <div style={styles.page}>
                <h2>Teacher Attendance</h2>
                <p>Loading teachers...</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>
                        Teacher Attendance
                    </h2>

                    <p style={styles.subtitle}>
                        Manage daily teacher attendance
                    </p>
                </div>

                <div>
                    <label style={styles.dateLabel}>
                        Select Date
                    </label>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={styles.dateInput}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div style={styles.cards}>

                <div style={styles.card}>
                    <h4>Total Teachers</h4>
                    <h2>{teachers.length}</h2>
                </div>

                <div style={styles.card}>
                    <h4>Present</h4>
                    <h2>{presentCount}</h2>
                </div>

                <div style={styles.card}>
                    <h4>Absent</h4>
                    <h2>{absentCount}</h2>
                </div>

                <div style={styles.card}>
                    <h4>Late</h4>
                    <h2>{lateCount}</h2>
                </div>

            </div>

            {/* Table */}
            <div style={styles.tableCard}>

                <div style={styles.tableScroll}>

                    <table style={styles.table}>

                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Teacher</th>
                                <th style={styles.th}>Email</th>
                                <th style={styles.th}>Department</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>
                                    Mark Attendance
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {teachers.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="7"
                                        style={styles.empty}
                                    >
                                        No teachers found.
                                    </td>
                                </tr>

                            ) : (

                                teachers.map((teacher) => {

                                    const status =
                                        getTeacherStatus(
                                            teacher.id
                                        );

                                    return (
                                        <tr key={teacher.id}>

                                            <td style={styles.td}>
                                                {teacher.id}
                                            </td>

                                            <td style={styles.td}>
                                                {teacher.teacher_name}
                                            </td>

                                            <td style={styles.td}>
                                                {teacher.email}
                                            </td>

                                            <td style={styles.td}>
                                                {teacher.department_name}
                                            </td>

                                            <td style={styles.td}>
                                                {selectedDate}
                                            </td>

                                            <td style={styles.td}>

                                                {status ? (
                                                    <span
                                                        style={{
                                                            ...styles.status,
                                                            background:
                                                                status ===
                                                                "Present"
                                                                    ? "#d1fae5"
                                                                    : status ===
                                                                      "Absent"
                                                                    ? "#fee2e2"
                                                                    : "#fef3c7",
                                                            color:
                                                                status ===
                                                                "Present"
                                                                    ? "#065f46"
                                                                    : status ===
                                                                      "Absent"
                                                                    ? "#991b1b"
                                                                    : "#92400e",
                                                        }}
                                                    >
                                                        {status}
                                                    </span>
                                                ) : (
                                                    <span
                                                        style={
                                                            styles.notMarked
                                                        }
                                                    >
                                                        Not Marked
                                                    </span>
                                                )}

                                            </td>

                                            <td style={styles.td}>

                                                <div
                                                    style={
                                                        styles.buttonGroup
                                                    }
                                                >

                                                    <button
                                                        onClick={() =>
                                                            markAttendance(
                                                                teacher.id,
                                                                "Present"
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.button,
                                                            background:
                                                                "#198754",
                                                        }}
                                                    >
                                                        Present
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            markAttendance(
                                                                teacher.id,
                                                                "Absent"
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.button,
                                                            background:
                                                                "#dc3545",
                                                        }}
                                                    >
                                                        Absent
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            markAttendance(
                                                                teacher.id,
                                                                "Late"
                                                            )
                                                        }
                                                        style={{
                                                            ...styles.button,
                                                            background:
                                                                "#ffc107",
                                                            color: "#000",
                                                        }}
                                                    >
                                                        Late
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    );
                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
};

const styles = {

    page: {
        padding: "25px",
        background: "#f5f7fb",
        minHeight: "100%",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
        gap: "20px",
        flexWrap: "wrap",
    },

    title: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "700",
    },

    subtitle: {
        marginTop: "6px",
        color: "#6c757d",
    },

    dateLabel: {
        display: "block",
        marginBottom: "6px",
        fontWeight: "600",
    },

    dateInput: {
        padding: "10px 12px",
        border: "1px solid #dce2eb",
        borderRadius: "7px",
        background: "#fff",
    },

    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "12px",
        borderRadius: "8px",
        marginBottom: "20px",
    },

    cards: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "25px",
    },

    card: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow:
            "0 2px 10px rgba(0, 0, 0, 0.05)",
    },

    tableCard: {
        background: "#fff",
        borderRadius: "10px",
        padding: "20px",
        boxShadow:
            "0 2px 10px rgba(0, 0, 0, 0.05)",
    },

    tableScroll: {
        width: "100%",
        overflowX: "auto",
    },

    table: {
        width: "100%",
        minWidth: "1100px",
        borderCollapse: "collapse",
    },

    th: {
        background: "#f8f9fa",
        padding: "12px",
        textAlign: "left",
        borderBottom: "1px solid #dee2e6",
        whiteSpace: "nowrap",
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #eee",
        whiteSpace: "nowrap",
    },

    buttonGroup: {
        display: "flex",
        gap: "6px",
    },

    button: {
        border: "none",
        color: "#fff",
        padding: "7px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "12px",
    },

    status: {
        padding: "5px 9px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600",
    },

    notMarked: {
        color: "#6c757d",
        fontSize: "12px",
    },

    empty: {
        padding: "30px",
        textAlign: "center",
        color: "#6c757d",
    },
};

export default TeacherAttendance;