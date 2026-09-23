import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";
import { useParams, useNavigate } from "react-router-dom";

function TeacherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [teacher, setTeacher] = useState(null);
    const [attendance, setAttendance] = useState([]);
    const [selectedAttendanceMonth, setSelectedAttendanceMonth] =
    useState(new Date().toISOString().slice(0, 7));
    const [documents, setDocuments] = useState([]);
const [leaves, setLeaves] = useState([]);

const [leaveType, setLeaveType] = useState("Casual Leave");
const [leaveStartDate, setLeaveStartDate] = useState("");
const [leaveEndDate, setLeaveEndDate] = useState("");
const [leaveReason, setLeaveReason] = useState("");
const [applyingLeave, setApplyingLeave] = useState(false);
    const [documentName, setDocumentName] = useState("");
    const [documentType, setDocumentType] = useState("Resume");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // GET TEACHER
    // =========================
    const getTeacher = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teachers/get_single.php?id=${id}`
            );

            if (response.data.status === 200) {
                setTeacher(response.data.data);
            } else {
                setError(
                    response.data.message ||
                    "Teacher not found."
                );
            }
        } catch (error) {
            console.error("Get teacher error:", error);
            setError("Unable to load teacher profile.");
        }
    };

    // =========================
    // GET ATTENDANCE
    // =========================
    const getAttendance = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teacher_attendance/get.php`
            );

            if (response.data.status === 200) {
                const teacherAttendance =
                    response.data.data.filter(
                        (item) =>
                            Number(item.teacher_id) === Number(id)
                    );

                setAttendance(teacherAttendance);
            }
        } catch (error) {
            console.error(
                "Get teacher attendance error:",
                error
            );
        }
    };

    // =========================
    // GET DOCUMENTS
    // =========================
    const getDocuments = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/teacher_documents/get.php`,
                {
                    params: {
                        teacher_id: id
                    }
                }
            );

            if (response.data.status === 200) {
                setDocuments(
                    Array.isArray(response.data.data)
                        ? response.data.data
                        : []
                );
            } else {
                setDocuments([]);
            }

        } catch (error) {
            console.error(
                "Get documents error:",
                error
            );
            setDocuments([]);
        }
    };

    // =========================
// GET LEAVES
// =========================
const getLeaves = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/teacher_leaves/get.php`,
            {
                params: {
                    teacher_id: id
                }
            }
        );

        if (response.data.status === 200) {
            setLeaves(response.data.data);
        } else {
            setLeaves([]);
        }
    } catch (error) {
        console.error("Get leaves error:", error);
        setLeaves([]);
    }
};

    // =========================
    // LOAD ALL DATA
    // =========================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError("");

            await Promise.all([
                getTeacher(),
                getAttendance(),
                getDocuments(),
                    getLeaves()

            ]);

            setLoading(false);
        };

        loadData();
    }, [id]);

    // =========================
    // UPLOAD DOCUMENT
    // =========================
    const handleUploadDocument = async (e) => {
        e.preventDefault();

        if (!documentName.trim()) {
            alert("Please enter document name.");
            return;
        }

        if (!selectedFile) {
            alert("Please select a file.");
            return;
        }

        try {
            setUploading(true);

            const formData = new FormData();

            formData.append("teacher_id", id);
            formData.append(
                "document_name",
                documentName
            );
            formData.append(
                "document_type",
                documentType
            );
            formData.append(
                "document",
                selectedFile
            );

            const response = await axios.post(
                `${API_BASE_URL}/teacher_documents/upload.php`,
                formData
            );

            if (response.data.status === 200) {

                alert(
                    response.data.message ||
                    "Document uploaded successfully!"
                );

                setDocumentName("");
                setDocumentType("Resume");
                setSelectedFile(null);

                e.target.reset();

                await getDocuments();

            } else {

                alert(
                    response.data.message ||
                    "Unable to upload document."
                );
            }

        } catch (error) {

            console.error(
                "Upload document error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to upload document."
            );

        } finally {
            setUploading(false);
        }
    };

// =========================
// APPLY LEAVE
// =========================
const handleApplyLeave = async (e) => {
    e.preventDefault();

    if (!leaveStartDate || !leaveEndDate) {
        alert("Please select start date and end date.");
        return;
    }

    if (leaveEndDate < leaveStartDate) {
        alert("End date cannot be before start date.");
        return;
    }

    try {
        setApplyingLeave(true);

        const response = await axios.post(
            `${API_BASE_URL}/teacher_leaves/create.php`,
            {
                teacher_id: Number(id),
                leave_type: leaveType,
                start_date: leaveStartDate,
                end_date: leaveEndDate,
                reason: leaveReason
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
                "Leave applied successfully!"
            );

            setLeaveStartDate("");
            setLeaveEndDate("");
            setLeaveReason("");

            await getLeaves();
        } else {
            alert(
                response.data.message ||
                "Unable to apply leave."
            );
        }

    } catch (error) {
        console.error("Apply leave error:", error);

        if (error.response) {
            alert(
                error.response.data.message ||
                "Unable to apply leave."
            );
        } else {
            alert("Unable to connect to the backend.");
        }

    } finally {
        setApplyingLeave(false);
    }
};

const handleLeaveStatus = async (leaveId, status) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/teacher_leaves/update_status.php`,
            {
                id: Number(leaveId),
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
                `Leave ${status.toLowerCase()} successfully.`
            );

            await getLeaves();
        } else {
            alert(
                response.data.message ||
                "Unable to update leave status."
            );
        }
    } catch (error) {
        console.error("Leave status error:", error);

        alert(
            error.response?.data?.message ||
            "Unable to update leave status."
        );
    }
};

    // =========================
    // ATTENDANCE COUNT
    // =========================
    const presentCount = attendance.filter(
        (item) => item.status === "Present"
    ).length;

    const absentCount = attendance.filter(
        (item) => item.status === "Absent"
    ).length;

    const lateCount = attendance.filter(
        (item) => item.status === "Late"
    ).length;

    const totalAttendance = attendance.length;

    const attendancePercentage =
        totalAttendance > 0
            ? Math.round(
                  (presentCount / totalAttendance) * 100
              )
            : 0;

            // =========================
// MONTHLY ATTENDANCE
// =========================

const monthlyAttendance = attendance.filter(
    (item) =>
        item.attendance_date &&
        item.attendance_date.startsWith(
            selectedAttendanceMonth
        )
);

const monthlyPresentCount = monthlyAttendance.filter(
    (item) => item.status === "Present"
).length;

const monthlyAbsentCount = monthlyAttendance.filter(
    (item) => item.status === "Absent"
).length;

const monthlyLateCount = monthlyAttendance.filter(
    (item) => item.status === "Late"
).length;

const monthlyTotalAttendance =
    monthlyAttendance.length;

const monthlyAttendancePercentage =
    monthlyTotalAttendance > 0
        ? Math.round(
              (monthlyPresentCount /
                  monthlyTotalAttendance) *
                  100
          )
        : 0;

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div style={styles.page}>
                <h2>Loading teacher profile...</h2>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error || !teacher) {
        return (
            <div style={styles.page}>

                <div style={styles.error}>
                    {error || "Teacher not found."}
                </div>

                <button
                    onClick={() =>
                        navigate("/teachers")
                    }
                    style={styles.backButton}
                >
                    ← Back to Teachers
                </button>

            </div>
        );
    }

    // =========================
    // PROFILE PAGE
    // =========================
    return (
        <div style={styles.page}>

            {/* TOP BAR */}
            <div style={styles.topBar}>

                <button
                    onClick={() =>
                        navigate("/teachers")
                    }
                    style={styles.backButton}
                >
                    ← Back to Teachers
                </button>

                <button
                    onClick={() =>
                        navigate("/teachers")
                    }
                    style={styles.editButton}
                >
                    <i className="bi bi-pencil"></i>
                    {" "}Edit Teacher
                </button>

            </div>

            {/* PROFILE HEADER */}
            <div style={styles.profileHeader}>

                <div style={styles.avatar}>
                    {teacher.teacher_name
                        ? teacher.teacher_name
                              .charAt(0)
                              .toUpperCase()
                        : "T"}
                </div>

                <div>

                    <h1 style={styles.name}>
                        {teacher.teacher_name}
                    </h1>

                    <p style={styles.department}>
                        {teacher.department_name}
                    </p>

                    <p style={styles.subject}>
                        {teacher.subject}
                    </p>

                </div>

            </div>

            {/* PERSONAL INFORMATION */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    <i className="bi bi-person"></i>
                    {" "}Personal Information
                </h2>

                <div style={styles.grid}>

                    <InfoItem
                        label="Teacher Name"
                        value={teacher.teacher_name}
                    />

                    <InfoItem
                        label="Email"
                        value={teacher.email}
                    />

                    <InfoItem
                        label="Phone"
                        value={
                            teacher.phone ||
                            "Not provided"
                        }
                    />

                    <InfoItem
                        label="Gender"
                        value={
                            teacher.gender ||
                            "Not provided"
                        }
                    />

                    <InfoItem
                        label="Department"
                        value={teacher.department_name}
                    />

                    <InfoItem
                        label="Subject"
                        value={teacher.subject}
                    />

                    <InfoItem
                        label="Experience"
                        value={`${teacher.experience || 0} years`}
                    />

                </div>

            </div>

            {/* SALARY */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    <i className="bi bi-cash-stack"></i>
                    {" "}Salary Information
                </h2>

                <div style={styles.salaryGrid}>

                    <div style={styles.salaryBox}>
                        <span style={styles.boxLabel}>
                            Monthly Salary
                        </span>

                        <strong style={styles.salaryValue}>
                            ₹
                            {Number(
                                teacher.salary || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                    <div style={styles.salaryBox}>
                        <span style={styles.boxLabel}>
                            Annual Salary
                        </span>

                        <strong style={styles.salaryValue}>
                            ₹
                            {(
                                Number(
                                    teacher.salary || 0
                                ) * 12
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>

            </div>

            {/* ATTENDANCE */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    <i className="bi bi-calendar-check"></i>
                    {" "}Attendance
                </h2>

                <div
    style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px"
    }}
>
    <label
        style={{
            fontWeight: "600",
            color: "#344054"
        }}
    >
        Select Month:
    </label>

    <input
        type="month"
        value={selectedAttendanceMonth}
        onChange={(e) =>
            setSelectedAttendanceMonth(e.target.value)
        }
        style={{
            border: "1px solid #dce2eb",
            borderRadius: "7px",
            padding: "9px 12px",
            fontSize: "14px"
        }}
    />
</div>

                <div style={styles.attendanceGrid}>

    <div style={styles.attendanceBox}>
        <span>Total Records</span>
        <strong>
            {monthlyTotalAttendance}
        </strong>
    </div>

    <div style={styles.attendanceBox}>
        <span>Present</span>
        <strong>
            {monthlyPresentCount}
        </strong>
    </div>

    <div style={styles.attendanceBox}>
        <span>Absent</span>
        <strong>
            {monthlyAbsentCount}
        </strong>
    </div>

    <div style={styles.attendanceBox}>
        <span>Late</span>
        <strong>
            {monthlyLateCount}
        </strong>
    </div>

    <div style={styles.attendanceBox}>
        <span>Attendance %</span>
        <strong>
            {monthlyAttendancePercentage}%
        </strong>
    </div>

</div>

                <div style={styles.historyContainer}>

                    <h3 style={styles.historyTitle}>
                        Attendance History
                    </h3>

{monthlyAttendance.length === 0 ? (

                        <p style={styles.noData}>
No attendance records found for this month.                        </p>

                    ) : (

                        <div style={styles.tableScroll}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>
                                        <th style={styles.th}>
                                            Date
                                        </th>

                                        <th style={styles.th}>
                                            Status
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

{monthlyAttendance.map(
                                            (item) => (
                                            <tr key={item.id}>

                                                <td
                                                    style={styles.td}
                                                >
                                                    {
                                                        item.attendance_date
                                                    }
                                                </td>

                                                <td
                                                    style={styles.td}
                                                >

                                                    <span
                                                        style={{
                                                            ...styles.status,
                                                            background:
                                                                item.status ===
                                                                "Present"
                                                                    ? "#d1fae5"
                                                                    : item.status ===
                                                                      "Absent"
                                                                    ? "#fee2e2"
                                                                    : "#fef3c7",

                                                            color:
                                                                item.status ===
                                                                "Present"
                                                                    ? "#065f46"
                                                                    : item.status ===
                                                                      "Absent"
                                                                    ? "#991b1b"
                                                                    : "#92400e"
                                                        }}
                                                    >
                                                        {
                                                            item.status
                                                        }
                                                    </span>

                                                </td>

                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* =========================
                LEAVES
            ========================= */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    <i className="bi bi-calendar-x"></i>
                    {" "}Leaves
                </h2>

                {/* Apply Leave Form */}
                <form
                    onSubmit={handleApplyLeave}
                    style={styles.uploadForm}
                >

                    <div>
                        <label style={styles.formLabel}>
                            Leave Type
                        </label>

                        <select
                            value={leaveType}
                            onChange={(e) =>
                                setLeaveType(e.target.value)
                            }
                            style={styles.formInput}
                        >
                            <option value="Casual Leave">
                                Casual Leave
                            </option>

                            <option value="Sick Leave">
                                Sick Leave
                            </option>

                            <option value="Earned Leave">
                                Earned Leave
                            </option>

                            <option value="Emergency Leave">
                                Emergency Leave
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>
                    </div>

                    <div>
                        <label style={styles.formLabel}>
                            Start Date
                        </label>

                        <input
                            type="date"
                            value={leaveStartDate}
                            onChange={(e) =>
                                setLeaveStartDate(e.target.value)
                            }
                            style={styles.formInput}
                        />
                    </div>

                    <div>
                        <label style={styles.formLabel}>
                            End Date
                        </label>

                        <input
                            type="date"
                            value={leaveEndDate}
                            onChange={(e) =>
                                setLeaveEndDate(e.target.value)
                            }
                            style={styles.formInput}
                        />
                    </div>

                    <div>
                        <label style={styles.formLabel}>
                            Reason
                        </label>

                        <textarea
                            value={leaveReason}
                            onChange={(e) =>
                                setLeaveReason(e.target.value)
                            }
                            placeholder="Enter reason for leave"
                            style={{
                                ...styles.formInput,
                                minHeight: "90px",
                                resize: "vertical"
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={applyingLeave}
                        style={{
                            ...styles.uploadButton,
                            opacity:
                                applyingLeave ? 0.7 : 1
                        }}
                    >
                        <i className="bi bi-send"></i>
                        {" "}
                        {applyingLeave
                            ? "Applying..."
                            : "Apply Leave"}
                    </button>

                </form>

                {/* Leave History */}
                <div style={styles.documentsList}>

                    <h3 style={styles.historyTitle}>
                        Leave History
                    </h3>

                    {leaves.length === 0 ? (

                        <p style={styles.noData}>
                            No leave requests found.
                        </p>

                    ) : (

                        <div style={styles.tableScroll}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>
    <th style={styles.th}>Leave Type</th>
    <th style={styles.th}>Start Date</th>
    <th style={styles.th}>End Date</th>
    <th style={styles.th}>Reason</th>
    <th style={styles.th}>Status</th>
    <th style={styles.th}>Applied On</th>
    <th style={styles.th}>Action</th>
</tr>
                                </thead>

                                <tbody>

                                    {leaves.map((leave) => (

                                        <tr key={leave.id}>

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

                                                <span
                                                    style={{
                                                        ...styles.status,
                                                        background:
                                                            leave.status ===
                                                            "Approved"
                                                                ? "#d1fae5"
                                                                : leave.status ===
                                                                  "Rejected"
                                                                ? "#fee2e2"
                                                                : "#fef3c7",

                                                        color:
                                                            leave.status ===
                                                            "Approved"
                                                                ? "#065f46"
                                                                : leave.status ===
                                                                  "Rejected"
                                                                ? "#991b1b"
                                                                : "#92400e"
                                                    }}
                                                >
                                                    {leave.status}
                                                </span>

                                            </td>

                                            <td style={styles.td}>
                                                {leave.applied_at}
                                            </td>

<td style={styles.td}>
    {leave.status === "Pending" ? (
        <div
            style={{
                display: "flex",
                gap: "8px"
            }}
        >
            <button
                onClick={() =>
                    handleLeaveStatus(
                        leave.id,
                        "Approved"
                    )
                }
                style={{
                    background: "#198754",
                    color: "#ffffff",
                    border: "none",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                <i className="bi bi-check-circle"></i>{" "}
                Approve
            </button>

            <button
                onClick={() =>
                    handleLeaveStatus(
                        leave.id,
                        "Rejected"
                    )
                }
                style={{
                    background: "#dc3545",
                    color: "#ffffff",
                    border: "none",
                    padding: "7px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                <i className="bi bi-x-circle"></i>{" "}
                Reject
            </button>
        </div>
    ) : (
        <span style={{ color: "#778399" }}>
            Completed
        </span>
    )}
</td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* DOCUMENTS */}
            <div style={styles.card}>

                <h2 style={styles.sectionTitle}>
                    <i className="bi bi-file-earmark-text"></i>
                    {" "}Documents
                </h2>

                {/* UPLOAD FORM */}
                <form
                    onSubmit={handleUploadDocument}
                    style={styles.uploadForm}
                >

                    <div>
                        <label style={styles.formLabel}>
                            Document Type
                        </label>

                        <select
                            value={documentType}
                            onChange={(e) =>
                                setDocumentType(
                                    e.target.value
                                )
                            }
                            style={styles.formInput}
                        >
                            <option value="Resume">
                                Resume
                            </option>

                            <option value="ID Proof">
                                ID Proof
                            </option>

                            <option value="Degree Certificate">
                                Degree Certificate
                            </option>

                            <option value="Experience Certificate">
                                Experience Certificate
                            </option>

                            <option value="Other">
                                Other
                            </option>
                        </select>
                    </div>

                    <div>
                        <label style={styles.formLabel}>
                            Document Name
                        </label>

                        <input
                            type="text"
                            value={documentName}
                            onChange={(e) =>
                                setDocumentName(
                                    e.target.value
                                )
                            }
                            placeholder="Example: Priya Resume"
                            style={styles.formInput}
                        />
                    </div>

                    <div>
                        <label style={styles.formLabel}>
                            Select File
                        </label>

                        <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) =>
                                setSelectedFile(
                                    e.target.files[0] || null
                                )
                            }
                            style={styles.fileInput}
                        />

                        <small style={styles.fileHelp}>
                            PDF, JPG, JPEG, PNG, DOC, DOCX
                            — maximum 5 MB
                        </small>
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        style={{
                            ...styles.uploadButton,
                            opacity: uploading ? 0.7 : 1
                        }}
                    >
                        <i className="bi bi-upload"></i>
                        {" "}
                        {uploading
                            ? "Uploading..."
                            : "Upload Document"}
                    </button>

                </form>

                {/* DOCUMENT LIST */}
                <div style={styles.documentsList}>

                    <h3 style={styles.historyTitle}>
                        Uploaded Documents
                    </h3>

                    {documents.length === 0 ? (

                        <p style={styles.noData}>
                            No documents uploaded yet.
                        </p>

                    ) : (

                        <div style={styles.tableScroll}>

                            <table style={styles.table}>

                                <thead>
                                    <tr>

                                        <th style={styles.th}>
                                            Document
                                        </th>

                                        <th style={styles.th}>
                                            Type
                                        </th>

                                        <th style={styles.th}>
                                            Uploaded
                                        </th>

                                        <th style={styles.th}>
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {documents.map(
                                        (document) => (

                                            <tr
                                                key={
                                                    document.id
                                                }
                                            >

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        document.document_name
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        document.document_type
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >
                                                    {
                                                        document.uploaded_at
                                                    }
                                                </td>

                                                <td
                                                    style={
                                                        styles.td
                                                    }
                                                >

                                                    <a
                                                        href={`${API_BASE_URL}/teacher_documents/view.php?id=${document.id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={
                                                            styles.viewButton
                                                        }
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                        {" "}View
                                                    </a>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

// =========================
// INFO ITEM
// =========================

function InfoItem({ label, value }) {
    return (
        <div style={styles.infoItem}>

            <span style={styles.infoLabel}>
                {label}
            </span>

            <strong style={styles.infoValue}>
                {value}
            </strong>

        </div>
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

    topBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        gap: "10px"
    },

    backButton: {
        border: "none",
        background: "#eef1f5",
        color: "#344054",
        padding: "10px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    editButton: {
        border: "none",
        background: "#4181ff",
        color: "#ffffff",
        padding: "10px 14px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    profileHeader: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "10px",
        padding: "25px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        marginBottom: "20px"
    },

    avatar: {
        width: "75px",
        height: "75px",
        borderRadius: "50%",
        background: "#4181ff",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "30px",
        fontWeight: "700"
    },

    name: {
        margin: 0,
        fontSize: "28px",
        color: "#172033"
    },

    department: {
        margin: "6px 0",
        color: "#4181ff",
        fontWeight: "600"
    },

    subject: {
        margin: 0,
        color: "#778399"
    },

    card: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "10px",
        padding: "25px",
        marginBottom: "20px"
    },

    sectionTitle: {
        marginTop: 0,
        marginBottom: "22px",
        color: "#172033",
        fontSize: "20px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",
        gap: "20px"
    },

    infoItem: {
        borderBottom: "1px solid #edf0f5",
        paddingBottom: "12px"
    },

    infoLabel: {
        display: "block",
        color: "#778399",
        fontSize: "13px",
        marginBottom: "6px"
    },

    infoValue: {
        color: "#273449",
        fontSize: "15px"
    },

    salaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px"
    },

    salaryBox: {
        background: "#f8faff",
        border: "1px solid #e0e7f0",
        borderRadius: "8px",
        padding: "20px"
    },

    boxLabel: {
        display: "block",
        color: "#778399",
        marginBottom: "8px"
    },

    salaryValue: {
        fontSize: "24px",
        color: "#172033"
    },

    attendanceGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(150px, 1fr))",
        gap: "15px"
    },

    attendanceBox: {
        background: "#f8faff",
        border: "1px solid #e0e7f0",
        borderRadius: "8px",
        padding: "18px",
        textAlign: "center"
    },

    historyContainer: {
        marginTop: "25px"
    },

    historyTitle: {
        fontSize: "17px",
        color: "#273449",
        marginBottom: "15px"
    },

    tableScroll: {
        width: "100%",
        overflowX: "auto"
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: "500px"
    },

    th: {
        textAlign: "left",
        padding: "12px",
        background: "#f8faff",
        borderBottom: "1px solid #dce2eb"
    },

    td: {
        padding: "12px",
        borderBottom: "1px solid #edf0f5"
    },

    status: {
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },

    uploadForm: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
        padding: "20px",
        background: "#f8faff",
        border: "1px solid #e0e7f0",
        borderRadius: "8px"
    },

    formLabel: {
        display: "block",
        marginBottom: "7px",
        color: "#344054",
        fontSize: "14px",
        fontWeight: "600"
    },

    formInput: {
        width: "100%",
        boxSizing: "border-box",
        padding: "10px 12px",
        border: "1px solid #dce2eb",
        borderRadius: "7px",
        background: "#ffffff"
    },

    fileInput: {
        width: "100%",
        fontSize: "13px"
    },

    fileHelp: {
        display: "block",
        marginTop: "7px",
        color: "#778399"
    },

    uploadButton: {
        alignSelf: "end",
        border: "none",
        background: "#198754",
        color: "#ffffff",
        padding: "11px 16px",
        borderRadius: "7px",
        cursor: "pointer",
        fontWeight: "600"
    },

    documentsList: {
        marginTop: "25px"
    },

    viewButton: {
        display: "inline-block",
        textDecoration: "none",
        background: "#0d6efd",
        color: "#ffffff",
        padding: "7px 12px",
        borderRadius: "6px",
        fontSize: "13px"
    },

    noData: {
        color: "#778399",
        margin: "5px 0"
    },

    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "15px",
        borderRadius: "8px",
        marginBottom: "15px"
    }
};

export default TeacherProfile;