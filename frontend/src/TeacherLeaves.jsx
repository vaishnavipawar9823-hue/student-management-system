import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function TeacherLeaves() {
    const [leaves, setLeaves] = useState([]);
    const [statusFilter, setStatusFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =========================
    // GET ALL LEAVES
    // =========================
    const getLeaves = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_BASE_URL}/teacher_leaves/get.php`
            );

            if (response.data.status === 200) {
                setLeaves(response.data.data);
            } else {
                setLeaves([]);
                setError(
                    response.data.message ||
                    "Unable to load leaves."
                );
            }
        } catch (error) {
            console.error("Get leaves error:", error);
            setError("Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getLeaves();
    }, []);

    // =========================
    // UPDATE LEAVE STATUS
    // =========================
    const updateLeaveStatus = async (id, status) => {
        try {
            const response = await axios.post(
                `${API_BASE_URL}/teacher_leaves/update_status.php`,
                {
                    id: Number(id),
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
                    "Leave status updated successfully."
                );

                await getLeaves();
            } else {
                alert(
                    response.data.message ||
                    "Unable to update leave status."
                );
            }
        } catch (error) {
            console.error("Update leave status error:", error);

            alert(
                error.response?.data?.message ||
                "Unable to update leave status."
            );
        }
    };

    // =========================
    // FILTER
    // =========================
    const filteredLeaves =
        statusFilter === "All"
            ? leaves
            : leaves.filter(
                  (leave) =>
                      leave.status === statusFilter
              );

    // =========================
    // COUNTS
    // =========================
    const totalLeaves = leaves.length;

    const pendingLeaves = leaves.filter(
        (leave) => leave.status === "Pending"
    ).length;

    const approvedLeaves = leaves.filter(
        (leave) => leave.status === "Approved"
    ).length;

    const rejectedLeaves = leaves.filter(
        (leave) => leave.status === "Rejected"
    ).length;

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

    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div style={styles.page}>
                <div style={styles.error}>
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={styles.page}>

            {/* =========================
                HEADER
            ========================= */}

            <div style={styles.header}>

                <div>
                    <h1 style={styles.title}>
                        Teacher Leave Management
                    </h1>

                    <p style={styles.subtitle}>
                        View and manage teacher leave requests.
                    </p>
                </div>

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                    style={styles.filter}
                >
                    <option value="All">
                        All Leaves
                    </option>

                    <option value="Pending">
                        Pending
                    </option>

                    <option value="Approved">
                        Approved
                    </option>

                    <option value="Rejected">
                        Rejected
                    </option>
                </select>

            </div>

            {/* =========================
                SUMMARY
            ========================= */}

            <div style={styles.summaryGrid}>

                <SummaryCard
                    title="Total"
                    value={totalLeaves}
                    icon="bi-calendar3"
                />

                <SummaryCard
                    title="Pending"
                    value={pendingLeaves}
                    icon="bi-hourglass-split"
                />

                <SummaryCard
                    title="Approved"
                    value={approvedLeaves}
                    icon="bi-check-circle"
                />

                <SummaryCard
                    title="Rejected"
                    value={rejectedLeaves}
                    icon="bi-x-circle"
                />

            </div>

            {/* =========================
                TABLE
            ========================= */}

            <div style={styles.card}>

                <div style={styles.cardHeader}>
                    <h2 style={styles.cardTitle}>
                        Leave Requests
                    </h2>
                </div>

                <div style={styles.tableScroll}>

                    <table style={styles.table}>

                        <thead>
                            <tr>

                                <th style={styles.th}>
                                    ID
                                </th>

                                <th style={styles.th}>
                                    TEACHER
                                </th>

                                <th style={styles.th}>
                                    LEAVE TYPE
                                </th>

                                <th style={styles.th}>
                                    START DATE
                                </th>

                                <th style={styles.th}>
                                    END DATE
                                </th>

                                <th style={styles.th}>
                                    REASON
                                </th>

                                <th style={styles.th}>
                                    STATUS
                                </th>

                                <th style={styles.th}>
                                    ACTION
                                </th>

                            </tr>
                        </thead>

                        <tbody>

                            {filteredLeaves.map((leave) => (

                                <tr key={leave.id}>

                                    <td style={styles.td}>
                                        {leave.id}
                                    </td>

                                    <td
                                        style={{
                                            ...styles.td,
                                            fontWeight: "600"
                                        }}
                                    >
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

                                        {leave.status ===
                                        "Pending" ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        updateLeaveStatus(
                                                            leave.id,
                                                            "Approved"
                                                        )
                                                    }
                                                    style={{
                                                        ...styles.actionButton,
                                                        background:
                                                            "#198754"
                                                    }}
                                                >
                                                    <i className="bi bi-check-lg"></i>{" "}
                                                    Approve
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        updateLeaveStatus(
                                                            leave.id,
                                                            "Rejected"
                                                        )
                                                    }
                                                    style={{
                                                        ...styles.actionButton,
                                                        background:
                                                            "#dc3545"
                                                    }}
                                                >
                                                    <i className="bi bi-x-lg"></i>{" "}
                                                    Reject
                                                </button>
                                            </>
                                        ) : (
                                            <span
                                                style={{
                                                    color: "#778399",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                No action
                                            </span>
                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

                {filteredLeaves.length === 0 && (
                    <div style={styles.noData}>
                        No leave requests found.
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
        <div style={styles.summaryCard}>

            <i
                className={`bi ${icon}`}
                style={styles.summaryIcon}
            ></i>

            <div>
                <p style={styles.summaryTitle}>
                    {title}
                </p>

                <h2 style={styles.summaryValue}>
                    {value}
                </h2>
            </div>

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

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px"
    },

    title: {
        margin: 0,
        fontSize: "30px",
        color: "#172033"
    },

    subtitle: {
        margin: "7px 0 0",
        color: "#778399",
        fontSize: "14px"
    },

    filter: {
        border: "1px solid #dce2eb",
        borderRadius: "7px",
        padding: "10px 14px",
        background: "#ffffff",
        fontSize: "14px"
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "16px",
        marginBottom: "24px"
    },

    summaryCard: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        gap: "14px"
    },

    summaryIcon: {
        fontSize: "24px"
    },

    summaryTitle: {
        margin: 0,
        color: "#778399",
        fontSize: "13px"
    },

    summaryValue: {
        margin: "5px 0 0",
        color: "#172033"
    },

    card: {
        background: "#ffffff",
        border: "1px solid #dce2eb",
        borderRadius: "8px",
        overflow: "hidden"
    },

    cardHeader: {
        padding: "18px 20px",
        borderBottom: "1px solid #dce2eb"
    },

    cardTitle: {
        margin: 0,
        fontSize: "20px",
        color: "#172033"
    },

    tableScroll: {
        overflowX: "auto"
    },

    table: {
        width: "100%",
        minWidth: "1100px",
        borderCollapse: "collapse"
    },

    th: {
        textAlign: "left",
        padding: "14px 12px",
        background: "#f8faff",
        borderBottom: "1px solid #dce2eb",
        color: "#718096",
        fontSize: "12px",
        fontWeight: "600",
        whiteSpace: "nowrap"
    },

    td: {
        padding: "14px 12px",
        borderBottom: "1px solid #e8edf3",
        color: "#273449",
        fontSize: "14px",
        whiteSpace: "nowrap"
    },

    status: {
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "600"
    },

    actionButton: {
        color: "#ffffff",
        border: "none",
        padding: "7px 10px",
        borderRadius: "6px",
        cursor: "pointer",
        marginRight: "6px",
        marginBottom: "4px",
        fontSize: "12px",
        fontWeight: "600"
    },

    noData: {
        padding: "30px",
        textAlign: "center",
        color: "#778399"
    },

    error: {
        background: "#fee2e2",
        color: "#991b1b",
        padding: "15px",
        borderRadius: "8px"
    }
};

export default TeacherLeaves;