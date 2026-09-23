import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Leaves() {
    const [activeTab, setActiveTab] = useState("student");

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);

    const [studentLeaves, setStudentLeaves] = useState([]);
    const [teacherLeaves, setTeacherLeaves] = useState([]);

    const [loading, setLoading] = useState(true);

    // =========================
    // STUDENT FORM
    // =========================
    const [studentId, setStudentId] = useState("");
    const [studentLeaveType, setStudentLeaveType] =
        useState("Casual Leave");
    const [studentStartDate, setStudentStartDate] = useState("");
    const [studentEndDate, setStudentEndDate] = useState("");
    const [studentReason, setStudentReason] = useState("");

    // =========================
    // TEACHER FORM
    // =========================
    const [teacherId, setTeacherId] = useState("");
    const [teacherLeaveType, setTeacherLeaveType] =
        useState("Casual Leave");
    const [teacherStartDate, setTeacherStartDate] = useState("");
    const [teacherEndDate, setTeacherEndDate] = useState("");
    const [teacherReason, setTeacherReason] = useState("");

    // =========================
    // STATUS FILTER
    // =========================
    const [studentFilter, setStudentFilter] = useState("All");
    const [teacherFilter, setTeacherFilter] = useState("All");

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
            }
        } catch (error) {
            console.error("Get students error:", error);
            setStudents([]);
        }
    };

    // =========================
    // GET TEACHERS
    // =========================
    const getTeachers = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teachers/get.php`
            );

            if (
                response.data.status === 200 &&
                Array.isArray(response.data.data)
            ) {
                setTeachers(response.data.data);
            } else {
                setTeachers([]);
            }
        } catch (error) {
            console.error("Get teachers error:", error);
            setTeachers([]);
        }
    };

    // =========================
    // GET STUDENT LEAVES
    // =========================
    const getStudentLeaves = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/student_leaves/get.php`
            );

            if (
                response.data.status === 200 &&
                Array.isArray(response.data.data)
            ) {
                setStudentLeaves(response.data.data);
            } else {
                setStudentLeaves([]);
            }
        } catch (error) {
            console.error("Get student leaves error:", error);
            setStudentLeaves([]);
        }
    };

    // =========================
    // GET TEACHER LEAVES
    // =========================
    const getTeacherLeaves = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teacher_leaves/get.php`
            );

            if (
                response.data.status === 200 &&
                Array.isArray(response.data.data)
            ) {
                setTeacherLeaves(response.data.data);
            } else {
                setTeacherLeaves([]);
            }
        } catch (error) {
            console.error("Get teacher leaves error:", error);
            setTeacherLeaves([]);
        }
    };

    // =========================
    // LOAD DATA
    // =========================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            await Promise.all([
                getStudents(),
                getTeachers(),
                getStudentLeaves(),
                getTeacherLeaves()
            ]);

            setLoading(false);
        };

        loadData();
    }, []);

    // =========================
    // APPLY STUDENT LEAVE
    // =========================
    const handleStudentLeave = async (e) => {
        e.preventDefault();

        if (
            !studentId ||
            !studentStartDate ||
            !studentEndDate
        ) {
            alert("Please fill all required student leave details.");
            return;
        }

        if (studentEndDate < studentStartDate) {
            alert("End date cannot be before start date.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/student_leaves/create.php`,
                {
                    student_id: Number(studentId),
                    leave_type: studentLeaveType,
                    start_date: studentStartDate,
                    end_date: studentEndDate,
                    reason: studentReason
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
                    "Student leave applied successfully."
                );

                setStudentId("");
                setStudentLeaveType("Casual Leave");
                setStudentStartDate("");
                setStudentEndDate("");
                setStudentReason("");

                await getStudentLeaves();
            } else {
                alert(
                    response.data.message ||
                    "Unable to apply student leave."
                );
            }
        } catch (error) {
            console.error("Apply student leave error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to connect to the backend."
            );
        }
    };

    // =========================
    // APPLY TEACHER LEAVE
    // =========================
    const handleTeacherLeave = async (e) => {
        e.preventDefault();

        if (
            !teacherId ||
            !teacherStartDate ||
            !teacherEndDate
        ) {
            alert("Please fill all required teacher leave details.");
            return;
        }

        if (teacherEndDate < teacherStartDate) {
            alert("End date cannot be before start date.");
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/teacher_leaves/create.php`,
                {
                    teacher_id: Number(teacherId),
                    leave_type: teacherLeaveType,
                    start_date: teacherStartDate,
                    end_date: teacherEndDate,
                    reason: teacherReason
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
                    "Teacher leave applied successfully."
                );

                setTeacherId("");
                setTeacherLeaveType("Casual Leave");
                setTeacherStartDate("");
                setTeacherEndDate("");
                setTeacherReason("");

                await getTeacherLeaves();
            } else {
                alert(
                    response.data.message ||
                    "Unable to apply teacher leave."
                );
            }
        } catch (error) {
            console.error("Apply teacher leave error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to connect to the backend."
            );
        }
    };

    // =========================
    // UPDATE STUDENT STATUS
    // =========================
    const updateStudentLeaveStatus = async (id, status) => {
        const action = status === "Approved" ? "approve" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} this student leave?`
            )
        ) {
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/student_leaves/update_status.php`,
                {
                    id: Number(id),
                    status
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
                    `Student leave ${status.toLowerCase()} successfully.`
                );

                await getStudentLeaves();
            } else {
                alert(
                    response.data.message ||
                    "Unable to update student leave."
                );
            }
        } catch (error) {
            console.error("Student leave status error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update leave status."
            );
        }
    };

    // =========================
    // UPDATE TEACHER STATUS
    // =========================
    const updateTeacherLeaveStatus = async (id, status) => {
        const action = status === "Approved" ? "approve" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} this teacher leave?`
            )
        ) {
            return;
        }

        try {
            const response = await axios.post(
                `${API_BASE_URL}/teacher_leaves/update_status.php`,
                {
                    id: Number(id),
                    status
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
                    `Teacher leave ${status.toLowerCase()} successfully.`
                );

                await getTeacherLeaves();
            } else {
                alert(
                    response.data.message ||
                    "Unable to update teacher leave."
                );
            }
        } catch (error) {
            console.error("Teacher leave status error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update leave status."
            );
        }
    };

    // =========================
    // COUNTS
    // =========================
    const studentPending = studentLeaves.filter(
        (leave) => leave.status === "Pending"
    ).length;

    const studentApproved = studentLeaves.filter(
        (leave) => leave.status === "Approved"
    ).length;

    const studentRejected = studentLeaves.filter(
        (leave) => leave.status === "Rejected"
    ).length;

    const teacherPending = teacherLeaves.filter(
        (leave) => leave.status === "Pending"
    ).length;

    const teacherApproved = teacherLeaves.filter(
        (leave) => leave.status === "Approved"
    ).length;

    const teacherRejected = teacherLeaves.filter(
        (leave) => leave.status === "Rejected"
    ).length;

    // =========================
    // FILTERED DATA
    // =========================
    const filteredStudentLeaves =
        studentFilter === "All"
            ? studentLeaves
            : studentLeaves.filter(
                  (leave) => leave.status === studentFilter
              );

    const filteredTeacherLeaves =
        teacherFilter === "All"
            ? teacherLeaves
            : teacherLeaves.filter(
                  (leave) => leave.status === teacherFilter
              );

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div style={styles.page}>
                <h2>Loading leaves...</h2>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* HEADER */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <i className="bi bi-calendar2-week"></i>{" "}
                    Leaves
                </h1>

                <p style={styles.subtitle}>
                    Manage student and teacher leave requests from one place.
                </p>
            </div>

            {/* TABS */}
            <div style={styles.tabs}>
                <button
                    onClick={() => setActiveTab("student")}
                    style={{
                        ...styles.tabButton,
                        ...(activeTab === "student"
                            ? styles.activeTab
                            : {})
                    }}
                >
                    <i className="bi bi-person"></i>{" "}
                    Student Leave
                </button>

                <button
                    onClick={() => setActiveTab("teacher")}
                    style={{
                        ...styles.tabButton,
                        ...(activeTab === "teacher"
                            ? styles.activeTab
                            : {})
                    }}
                >
                    <i className="bi bi-person-workspace"></i>{" "}
                    Teacher Leave
                </button>
            </div>

            {/* =====================================================
                STUDENT LEAVE
            ===================================================== */}
            {activeTab === "student" && (
                <>
                    <div style={styles.summaryGrid}>
                        <SummaryCard
                            title="Total"
                            value={studentLeaves.length}
                            icon="bi-list-ul"
                        />

                        <SummaryCard
                            title="Pending"
                            value={studentPending}
                            icon="bi-hourglass-split"
                        />

                        <SummaryCard
                            title="Approved"
                            value={studentApproved}
                            icon="bi-check-circle"
                        />

                        <SummaryCard
                            title="Rejected"
                            value={studentRejected}
                            icon="bi-x-circle"
                        />
                    </div>

                    {/* APPLY */}
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>
                            <i className="bi bi-plus-circle"></i>{" "}
                            Apply Student Leave
                        </h2>

                        <form onSubmit={handleStudentLeave}>
                            <div style={styles.formGrid}>

                                <FormField label="Student">
                                    <select
                                        value={studentId}
                                        onChange={(e) =>
                                            setStudentId(e.target.value)
                                        }
                                        style={styles.input}
                                    >
                                        <option value="">
                                            Select Student
                                        </option>

                                        {students.map((student) => (
                                            <option
                                                key={student.id}
                                                value={student.id}
                                            >
                                                {student.name}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Leave Type">
                                    <select
                                        value={studentLeaveType}
                                        onChange={(e) =>
                                            setStudentLeaveType(e.target.value)
                                        }
                                        style={styles.input}
                                    >
                                        <option>Casual Leave</option>
                                        <option>Sick Leave</option>
                                        <option>Earned Leave</option>
                                        <option>Emergency Leave</option>
                                        <option>Other</option>
                                    </select>
                                </FormField>

                                <FormField label="Start Date">
                                    <input
                                        type="date"
                                        value={studentStartDate}
                                        onChange={(e) =>
                                            setStudentStartDate(e.target.value)
                                        }
                                        style={styles.input}
                                    />
                                </FormField>

                                <FormField label="End Date">
                                    <input
                                        type="date"
                                        value={studentEndDate}
                                        onChange={(e) =>
                                            setStudentEndDate(e.target.value)
                                        }
                                        style={styles.input}
                                    />
                                </FormField>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <label style={styles.label}>
                                    Reason
                                </label>

                                <textarea
                                    rows="4"
                                    value={studentReason}
                                    onChange={(e) =>
                                        setStudentReason(e.target.value)
                                    }
                                    placeholder="Enter leave reason..."
                                    style={{
                                        ...styles.input,
                                        resize: "vertical"
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={styles.primaryButton}
                            >
                                <i className="bi bi-send"></i>{" "}
                                Apply Leave
                            </button>
                        </form>
                    </div>

                    {/* HISTORY */}
                    <div style={styles.card}>
                        <div style={styles.historyHeader}>
                            <h2 style={styles.sectionTitle}>
                                <i className="bi bi-clock-history"></i>{" "}
                                Student Leave History
                            </h2>

                            <select
                                value={studentFilter}
                                onChange={(e) =>
                                    setStudentFilter(e.target.value)
                                }
                                style={styles.filter}
                            >
                                <option>All</option>
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>
                        </div>

                        <div style={styles.tableScroll}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Student</th>
                                        <th style={styles.th}>Leave Type</th>
                                        <th style={styles.th}>Start Date</th>
                                        <th style={styles.th}>End Date</th>
                                        <th style={styles.th}>Reason</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredStudentLeaves.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                style={styles.empty}
                                            >
                                                No student leave records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredStudentLeaves.map((leave) => (
                                            <tr key={leave.id}>
                                                <td style={styles.td}>
                                                    {leave.student_name}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.leave_type}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.start_date}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.end_date}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.reason || "-"}
                                                </td>

                                                <td style={styles.td}>
                                                    <StatusBadge
                                                        status={leave.status}
                                                    />
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.status === "Pending" ? (
                                                        <div style={styles.actions}>
                                                            <button
                                                                onClick={() =>
                                                                    updateStudentLeaveStatus(
                                                                        leave.id,
                                                                        "Approved"
                                                                    )
                                                                }
                                                                style={
                                                                    styles.approveButton
                                                                }
                                                            >
                                                                <i className="bi bi-check-lg"></i>{" "}
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    updateStudentLeaveStatus(
                                                                        leave.id,
                                                                        "Rejected"
                                                                    )
                                                                }
                                                                style={
                                                                    styles.rejectButton
                                                                }
                                                            >
                                                                <i className="bi bi-x-lg"></i>{" "}
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={styles.completed}>
                                                            Completed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* =====================================================
                TEACHER LEAVE
            ===================================================== */}
            {activeTab === "teacher" && (
                <>
                    <div style={styles.summaryGrid}>
                        <SummaryCard
                            title="Total"
                            value={teacherLeaves.length}
                            icon="bi-list-ul"
                        />

                        <SummaryCard
                            title="Pending"
                            value={teacherPending}
                            icon="bi-hourglass-split"
                        />

                        <SummaryCard
                            title="Approved"
                            value={teacherApproved}
                            icon="bi-check-circle"
                        />

                        <SummaryCard
                            title="Rejected"
                            value={teacherRejected}
                            icon="bi-x-circle"
                        />
                    </div>

                    {/* APPLY */}
                    <div style={styles.card}>
                        <h2 style={styles.sectionTitle}>
                            <i className="bi bi-plus-circle"></i>{" "}
                            Apply Teacher Leave
                        </h2>

                        <form onSubmit={handleTeacherLeave}>
                            <div style={styles.formGrid}>

                                <FormField label="Teacher">
                                    <select
                                        value={teacherId}
                                        onChange={(e) =>
                                            setTeacherId(e.target.value)
                                        }
                                        style={styles.input}
                                    >
                                        <option value="">
                                            Select Teacher
                                        </option>

                                        {teachers.map((teacher) => (
                                            <option
                                                key={teacher.id}
                                                value={teacher.id}
                                            >
                                                {teacher.teacher_name}
                                            </option>
                                        ))}
                                    </select>
                                </FormField>

                                <FormField label="Leave Type">
                                    <select
                                        value={teacherLeaveType}
                                        onChange={(e) =>
                                            setTeacherLeaveType(e.target.value)
                                        }
                                        style={styles.input}
                                    >
                                        <option>Casual Leave</option>
                                        <option>Sick Leave</option>
                                        <option>Earned Leave</option>
                                        <option>Emergency Leave</option>
                                        <option>Other</option>
                                    </select>
                                </FormField>

                                <FormField label="Start Date">
                                    <input
                                        type="date"
                                        value={teacherStartDate}
                                        onChange={(e) =>
                                            setTeacherStartDate(e.target.value)
                                        }
                                        style={styles.input}
                                    />
                                </FormField>

                                <FormField label="End Date">
                                    <input
                                        type="date"
                                        value={teacherEndDate}
                                        onChange={(e) =>
                                            setTeacherEndDate(e.target.value)
                                        }
                                        style={styles.input}
                                    />
                                </FormField>
                            </div>

                            <div style={{ marginTop: "15px" }}>
                                <label style={styles.label}>
                                    Reason
                                </label>

                                <textarea
                                    rows="4"
                                    value={teacherReason}
                                    onChange={(e) =>
                                        setTeacherReason(e.target.value)
                                    }
                                    placeholder="Enter leave reason..."
                                    style={{
                                        ...styles.input,
                                        resize: "vertical"
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={styles.primaryButton}
                            >
                                <i className="bi bi-send"></i>{" "}
                                Apply Leave
                            </button>
                        </form>
                    </div>

                    {/* HISTORY */}
                    <div style={styles.card}>
                        <div style={styles.historyHeader}>
                            <h2 style={styles.sectionTitle}>
                                <i className="bi bi-clock-history"></i>{" "}
                                Teacher Leave History
                            </h2>

                            <select
                                value={teacherFilter}
                                onChange={(e) =>
                                    setTeacherFilter(e.target.value)
                                }
                                style={styles.filter}
                            >
                                <option>All</option>
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                            </select>
                        </div>

                        <div style={styles.tableScroll}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Teacher</th>
                                        <th style={styles.th}>Leave Type</th>
                                        <th style={styles.th}>Start Date</th>
                                        <th style={styles.th}>End Date</th>
                                        <th style={styles.th}>Reason</th>
                                        <th style={styles.th}>Status</th>
                                        <th style={styles.th}>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredTeacherLeaves.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                style={styles.empty}
                                            >
                                                No teacher leave records found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTeacherLeaves.map((leave) => (
                                            <tr key={leave.id}>
                                                <td style={styles.td}>
                                                    {leave.teacher_name}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.leave_type}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.start_date}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.end_date}
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.reason || "-"}
                                                </td>

                                                <td style={styles.td}>
                                                    <StatusBadge
                                                        status={leave.status}
                                                    />
                                                </td>

                                                <td style={styles.td}>
                                                    {leave.status === "Pending" ? (
                                                        <div style={styles.actions}>
                                                            <button
                                                                onClick={() =>
                                                                    updateTeacherLeaveStatus(
                                                                        leave.id,
                                                                        "Approved"
                                                                    )
                                                                }
                                                                style={
                                                                    styles.approveButton
                                                                }
                                                            >
                                                                <i className="bi bi-check-lg"></i>{" "}
                                                                Approve
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    updateTeacherLeaveStatus(
                                                                        leave.id,
                                                                        "Rejected"
                                                                    )
                                                                }
                                                                style={
                                                                    styles.rejectButton
                                                                }
                                                            >
                                                                <i className="bi bi-x-lg"></i>{" "}
                                                                Reject
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <span style={styles.completed}>
                                                            Completed
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// =========================
// FORM FIELD
// =========================
function FormField({ label, children }) {
    return (
        <div>
            <label style={styles.label}>
                {label}
            </label>

            {children}
        </div>
    );
}

// =========================
// SUMMARY CARD
// =========================
function SummaryCard({ title, value, icon }) {
    return (
        <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>
                <i className={`bi ${icon}`}></i>
            </div>

            <div>
                <div style={styles.summaryTitle}>
                    {title}
                </div>

                <div style={styles.summaryValue}>
                    {value}
                </div>
            </div>
        </div>
    );
}

// =========================
// STATUS BADGE
// =========================
function StatusBadge({ status }) {
    let background = "#fef3c7";
    let color = "#92400e";

    if (status === "Approved") {
        background = "#d1fae5";
        color = "#065f46";
    }

    if (status === "Rejected") {
        background = "#fee2e2";
        color = "#991b1b";
    }

    return (
        <span
            style={{
                ...styles.status,
                background,
                color
            }}
        >
            {status}
        </span>
    );
}

// =========================
// STYLES
// =========================
const styles = {
    page: {
        padding: "25px",
        background: "#f5f7fb",
        minHeight: "100%"
    },

    header: {
        marginBottom: "25px"
    },

    title: {
        fontSize: "30px",
        color: "#172033",
        margin: "0 0 8px"
    },

    subtitle: {
        color: "#778399",
        margin: 0
    },

    tabs: {
        display: "flex",
        gap: "10px",
        marginBottom: "25px"
    },

    tabButton: {
        padding: "11px 24px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#e9edf3",
        color: "#172033",
        fontWeight: "600"
    },

    activeTab: {
        background: "#172033",
        color: "#ffffff"
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "15px",
        marginBottom: "25px"
    },

    summaryCard: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "10px",
        padding: "18px",
        display: "flex",
        alignItems: "center",
        gap: "14px"
    },

    summaryIcon: {
        width: "42px",
        height: "42px",
        borderRadius: "8px",
        background: "#eef3ff",
        color: "#4181ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px"
    },

    summaryTitle: {
        color: "#778399",
        fontSize: "13px",
        marginBottom: "4px"
    },

    summaryValue: {
        color: "#172033",
        fontSize: "26px",
        fontWeight: "700"
    },

    card: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "10px",
        padding: "25px",
        marginBottom: "25px"
    },

    sectionTitle: {
        fontSize: "21px",
        color: "#172033",
        margin: "0 0 20px"
    },

    formGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "15px"
    },

    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "14px",
        fontWeight: "600",
        color: "#344054"
    },

    input: {
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #dce2eb",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box"
    },

    primaryButton: {
        marginTop: "18px",
        padding: "10px 20px",
        background: "#172033",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600"
    },

    historyHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "15px",
        marginBottom: "15px"
    },

    filter: {
        padding: "9px 12px",
        border: "1px solid #dce2eb",
        borderRadius: "7px",
        background: "#ffffff"
    },

    tableScroll: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        minWidth: "900px",
        borderCollapse: "collapse"
    },

    th: {
        textAlign: "left",
        padding: "12px",
        background: "#f5f7fa",
        borderBottom: "1px solid #dce2eb",
        color: "#344054",
        fontSize: "13px",
        whiteSpace: "nowrap"
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #edf0f4",
        color: "#475467",
        fontSize: "13px"
    },

    status: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },

    actions: {
        display: "flex",
        gap: "7px",
        flexWrap: "wrap"
    },

    approveButton: {
        padding: "7px 11px",
        background: "#198754",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px"
    },

    rejectButton: {
        padding: "7px 11px",
        background: "#dc3545",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px"
    },

    completed: {
        color: "#778399",
        fontSize: "12px"
    },

    empty: {
        padding: "25px",
        textAlign: "center",
        color: "#778399"
    }
};

export default Leaves;