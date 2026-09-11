import API_BASE_URL from "./api/config";

function StudentModal({ student, onClose }) {

    if (!student) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(15, 23, 42, 0.55)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                zIndex: 1000
            }}
            onClick={onClose}
        >

            {/* Modal Box */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "520px",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background: "#ffffff",
                    borderRadius: "12px",
                    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)"
                }}
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div
                    style={{
                        padding: "20px 24px",
                        borderBottom: "1px solid #e5eaf0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <div>
                        <h2
                            style={{
                                margin: 0,
                                fontSize: "20px",
                                color: "#172033"
                            }}
                        >
                            Student Details
                        </h2>

                        <p
                            style={{
                                margin: "5px 0 0",
                                fontSize: "12px",
                                color: "#8290a5"
                            }}
                        >
                            Student information
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            width: "36px",
                            height: "36px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#f1f4f8",
                            color: "#536078",
                            cursor: "pointer",
                            fontSize: "18px"
                        }}
                    >
                        ×
                    </button>
                </div>


                {/* Profile Section */}
                <div
                    style={{
                        padding: "25px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        borderBottom: "1px solid #e5eaf0"
                    }}
                >

                    {student.profile_image ? (
                        <img
                            src={`${API_BASE_URL}/uploads/${student.profile_image}`}
                            alt={student.name}
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "4px solid #eef3ff"
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100px",
                                height: "100px",
                                borderRadius: "50%",
                                background: "#eef3ff",
                                color: "#2878ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "34px"
                            }}
                        >
                            <i className="bi bi-person"></i>
                        </div>
                    )}

                    <h3
                        style={{
                            marginTop: "15px",
                            marginBottom: "4px",
                            color: "#172033"
                        }}
                    >
                        {student.name}
                    </h3>

                    <p
                        style={{
                            margin: 0,
                            color: "#8290a5",
                            fontSize: "13px"
                        }}
                    >
                        {student.course}
                    </p>

                </div>


                {/* Student Information */}
                <div style={{ padding: "24px" }}>

                    <InfoRow
                        icon="bi-person-badge"
                        label="Student ID"
                        value={student.id}
                    />

                    <InfoRow
                        icon="bi-envelope"
                        label="Email"
                        value={student.email}
                    />

                    <InfoRow
                        icon="bi-telephone"
                        label="Phone"
                        value={student.phone}
                    />

                    <InfoRow
                        icon="bi-book"
                        label="Course"
                        value={student.course}
                    />

                    <InfoRow
                        icon="bi-calendar3"
                        label="Age"
                        value={student.age}
                    />

                    <InfoRow
                        icon="bi-person"
                        label="Gender"
                        value={student.gender}
                    />

                    <InfoRow
                        icon="bi-geo-alt"
                        label="Address"
                        value={student.address}
                        last
                    />

                </div>


                {/* Footer */}
                <div
                    style={{
                        padding: "16px 24px",
                        background: "#f8faff",
                        borderTop: "1px solid #e5eaf0",
                        textAlign: "right"
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{
                            background: "#2878ff",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "7px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        Close
                    </button>
                </div>

            </div>

        </div>
    );
}


/* Information Row */
function InfoRow({ icon, label, value, last }) {

    return (
        <div
            style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "15px",
                padding: "15px 0",
                borderBottom: last
                    ? "none"
                    : "1px solid #e8edf3"
            }}
        >

            <div
                style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "7px",
                    background: "#eef3ff",
                    color: "#2878ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                }}
            >
                <i className={`bi ${icon}`}></i>
            </div>

            <div>
                <p
                    style={{
                        margin: "0 0 4px",
                        fontSize: "12px",
                        color: "#8290a5"
                    }}
                >
                    {label}
                </p>

                <p
                    style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#273449",
                        fontWeight: "600",
                        wordBreak: "break-word"
                    }}
                >
                    {value}
                </p>
            </div>

        </div>
    );
}

export default StudentModal;