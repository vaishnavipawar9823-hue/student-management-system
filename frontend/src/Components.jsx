function Components() {
    return (
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

            {/* Page Heading */}
            <div style={{ marginBottom: "28px" }}>
                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Components
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    Common UI components used in the admin dashboard.
                </p>
            </div>


            {/* Buttons */}
            <div style={cardStyle}>
                <h2 style={headingStyle}>Buttons</h2>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >
                    <button style={primaryButton}>
                        Primary
                    </button>

                    <button style={secondaryButton}>
                        Secondary
                    </button>

                    <button style={successButton}>
                        Success
                    </button>

                    <button style={dangerButton}>
                        Delete
                    </button>

                    <button style={outlineButton}>
                        Outline
                    </button>
                </div>
            </div>


            {/* Badges */}
            <div style={cardStyle}>
                <h2 style={headingStyle}>Badges</h2>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        flexWrap: "wrap"
                    }}
                >
                    <span style={blueBadge}>Primary</span>
                    <span style={greenBadge}>Active</span>
                    <span style={yellowBadge}>Pending</span>
                    <span style={redBadge}>Inactive</span>
                </div>
            </div>


            {/* Alerts */}
            <div style={cardStyle}>
                <h2 style={headingStyle}>Alerts</h2>

                <div style={successAlert}>
                    <i className="bi bi-check-circle"></i>
                    Student added successfully.
                </div>

                <div style={infoAlert}>
                    <i className="bi bi-info-circle"></i>
                    This is an information message.
                </div>

                <div style={warningAlert}>
                    <i className="bi bi-exclamation-triangle"></i>
                    Please check the information.
                </div>

                <div style={errorAlert}>
                    <i className="bi bi-x-circle"></i>
                    Something went wrong.
                </div>
            </div>


            {/* Cards */}
            <div style={cardStyle}>
                <h2 style={headingStyle}>Cards</h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px"
                    }}
                >

                    <div style={smallCardStyle}>
                        <i
                            className="bi bi-people"
                            style={cardIconStyle}
                        ></i>

                        <h3>Total Students</h3>
                        <p>5</p>
                    </div>

                    <div style={smallCardStyle}>
                        <i
                            className="bi bi-book"
                            style={cardIconStyle}
                        ></i>

                        <h3>Total Courses</h3>
                        <p>4</p>
                    </div>

                    <div style={smallCardStyle}>
                        <i
                            className="bi bi-person-check"
                            style={cardIconStyle}
                        ></i>

                        <h3>Active Users</h3>
                        <p>5</p>
                    </div>

                </div>
            </div>


            {/* Modal Demo */}
            <div style={cardStyle}>
                <h2 style={headingStyle}>Modal</h2>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "14px",
                        marginBottom: "15px"
                    }}
                >
                    Your Student Management page already uses a
                    working modal for student details.
                </p>

                <button style={primaryButton}>
                    <i
                        className="bi bi-window"
                        style={{ marginRight: "7px" }}
                    ></i>
                    Modal Component
                </button>
            </div>

        </div>
    );
}


/* =========================
   Common Card
========================= */

const cardStyle = {
    background: "#ffffff",
    border: "1px solid #dce2eb",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "20px"
};


/* Heading */

const headingStyle = {
    fontSize: "20px",
    color: "#172033",
    marginBottom: "20px"
};


/* =========================
   Buttons
========================= */

const primaryButton = {
    background: "#2878ff",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    padding: "11px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
};

const secondaryButton = {
    background: "#eef1f5",
    color: "#39455a",
    border: "none",
    borderRadius: "7px",
    padding: "11px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
};

const successButton = {
    background: "#28a76a",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    padding: "11px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
};

const dangerButton = {
    background: "#dc4c4c",
    color: "#ffffff",
    border: "none",
    borderRadius: "7px",
    padding: "11px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
};

const outlineButton = {
    background: "#ffffff",
    color: "#2878ff",
    border: "1px solid #2878ff",
    borderRadius: "7px",
    padding: "10px 18px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600"
};


/* =========================
   Badges
========================= */

const blueBadge = {
    background: "#eef3ff",
    color: "#2878ff",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
};

const greenBadge = {
    background: "#e9f8ef",
    color: "#21874b",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
};

const yellowBadge = {
    background: "#fff7df",
    color: "#9b7600",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
};

const redBadge = {
    background: "#fff0f0",
    color: "#c73d3d",
    padding: "7px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600"
};


/* =========================
   Alerts
========================= */

const alertBase = {
    padding: "13px 15px",
    borderRadius: "7px",
    marginBottom: "10px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "9px"
};

const successAlert = {
    ...alertBase,
    background: "#e9f8ef",
    border: "1px solid #bfe8ce",
    color: "#21874b"
};

const infoAlert = {
    ...alertBase,
    background: "#eef6ff",
    border: "1px solid #c9ddf8",
    color: "#2878ff"
};

const warningAlert = {
    ...alertBase,
    background: "#fff7df",
    border: "1px solid #f2df9f",
    color: "#9b7600"
};

const errorAlert = {
    ...alertBase,
    background: "#fff0f0",
    border: "1px solid #f0c2c2",
    color: "#c73d3d"
};


/* =========================
   Small Cards
========================= */

const smallCardStyle = {
    border: "1px solid #e0e6ee",
    borderRadius: "9px",
    padding: "22px",
    background: "#fdfefe"
};

const cardIconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    background: "#eef3ff",
    color: "#2878ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "15px",
    fontSize: "18px"
};

export default Components;