import { useEffect, useState } from "react";

function Settings() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [dashboardNotifications, setDashboardNotifications] = useState(true);
    const [language, setLanguage] = useState("English");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedEmailNotifications = localStorage.getItem(
            "sms_email_notifications"
        );
        const savedDashboardNotifications = localStorage.getItem(
            "sms_dashboard_notifications"
        );
        const savedLanguage = localStorage.getItem("sms_language");

        if (savedEmailNotifications !== null) {
            setEmailNotifications(savedEmailNotifications === "true");
        }

        if (savedDashboardNotifications !== null) {
            setDashboardNotifications(
                savedDashboardNotifications === "true"
            );
        }

        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    const handleSave = (e) => {
        e.preventDefault();

        localStorage.setItem(
            "sms_email_notifications",
            String(emailNotifications)
        );
        localStorage.setItem(
            "sms_dashboard_notifications",
            String(dashboardNotifications)
        );
        localStorage.setItem("sms_language", language);

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

            {/* Page Heading */}
            <div style={{ marginBottom: "28px" }}>
                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Settings
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    Manage your account and system preferences.
                </p>
            </div>


            {/* Success Message */}
            {saved && (
                <div
                    style={{
                        background: "#e9f8ef",
                        border: "1px solid #bfe8ce",
                        color: "#21874b",
                        padding: "12px 15px",
                        borderRadius: "7px",
                        marginBottom: "20px"
                    }}
                >
                    Settings saved successfully!
                </div>
            )}


            <form onSubmit={handleSave}>

                {/* Account Settings */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce2eb",
                        borderRadius: "10px",
                        padding: "25px",
                        marginBottom: "20px"
                    }}
                >

                    <div style={{ marginBottom: "20px" }}>
                        <h2
                            style={{
                                fontSize: "20px",
                                color: "#172033",
                                marginBottom: "5px"
                            }}
                        >
                            Account Settings
                        </h2>

                        <p
                            style={{
                                color: "#8290a5",
                                fontSize: "13px"
                            }}
                        >
                            Control how you receive notifications.
                        </p>
                    </div>


                    {/* Email Notification */}
                    <div style={settingRowStyle}>

                        <div>
                            <strong style={titleStyle}>
                                Email Notifications
                            </strong>

                            <p style={descriptionStyle}>
                                Receive important updates by email.
                            </p>
                        </div>

                        <label style={switchStyle}>
                            <input
                                type="checkbox"
                                checked={emailNotifications}
                                onChange={(e) =>
                                    setEmailNotifications(
                                        e.target.checked
                                    )
                                }
                            />

                            <span
                                style={
                                    emailNotifications
                                        ? switchOnStyle
                                        : switchOffStyle
                                }
                            >
                                <span
                                    style={
                                        emailNotifications
                                            ? knobOnStyle
                                            : knobOffStyle
                                    }
                                ></span>
                            </span>
                        </label>

                    </div>


                    {/* Dashboard Notification */}
                    <div
                        style={{
                            ...settingRowStyle,
                            borderBottom: "none"
                        }}
                    >

                        <div>
                            <strong style={titleStyle}>
                                Dashboard Notifications
                            </strong>

                            <p style={descriptionStyle}>
                                Show notifications inside the dashboard.
                            </p>
                        </div>

                        <label style={switchStyle}>
                            <input
                                type="checkbox"
                                checked={dashboardNotifications}
                                onChange={(e) =>
                                    setDashboardNotifications(
                                        e.target.checked
                                    )
                                }
                            />

                            <span
                                style={
                                    dashboardNotifications
                                        ? switchOnStyle
                                        : switchOffStyle
                                }
                            >
                                <span
                                    style={
                                        dashboardNotifications
                                            ? knobOnStyle
                                            : knobOffStyle
                                    }
                                ></span>
                            </span>
                        </label>

                    </div>

                </div>


                {/* System Settings */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce2eb",
                        borderRadius: "10px",
                        padding: "25px",
                        marginBottom: "20px"
                    }}
                >

                    <div style={{ marginBottom: "20px" }}>
                        <h2
                            style={{
                                fontSize: "20px",
                                color: "#172033",
                                marginBottom: "5px"
                            }}
                        >
                            System Settings
                        </h2>

                        <p
                            style={{
                                color: "#8290a5",
                                fontSize: "13px"
                            }}
                        >
                            Configure basic application preferences.
                        </p>
                    </div>


                    {/* Language */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "14px",
                                fontWeight: "600",
                                color: "#39455a",
                                marginBottom: "8px"
                            }}
                        >
                            Language
                        </label>

                        <select
                            value={language}
                            onChange={(e) =>
                                setLanguage(e.target.value)
                            }
                            style={{
                                width: "100%",
                                maxWidth: "400px",
                                height: "44px",
                                border: "1px solid #dce2eb",
                                borderRadius: "7px",
                                padding: "0 12px",
                                outline: "none",
                                background: "#ffffff",
                                fontSize: "14px",
                                color: "#273449"
                            }}
                        >
                            <option value="English">
                                English
                            </option>

                            <option value="Hindi">
                                Hindi
                            </option>

                            <option value="Marathi">
                                Marathi
                            </option>
                        </select>
                    </div>

                </div>


                {/* Save Button */}
                <button
                    type="submit"
                    style={{
                        background: "#2878ff",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "7px",
                        padding: "12px 24px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    <i
                        className="bi bi-check2"
                        style={{ marginRight: "8px" }}
                    ></i>

                    Save Settings
                </button>

            </form>

        </div>
    );
}


/* Setting Row */
const settingRowStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    padding: "18px 0",
    borderBottom: "1px solid #e8edf3"
};


/* Title */
const titleStyle = {
    display: "block",
    color: "#273449",
    fontSize: "14px",
    marginBottom: "4px"
};


/* Description */
const descriptionStyle = {
    color: "#8290a5",
    fontSize: "12px",
    margin: 0
};


/* Switch */
const switchStyle = {
    position: "relative",
    display: "inline-block",
    width: "48px",
    height: "26px",
    flexShrink: 0
};


/* Hide checkbox */
const switchInput = {
    display: "none"
};


/* Switch ON */
const switchOnStyle = {
    position: "absolute",
    inset: 0,
    borderRadius: "20px",
    background: "#2878ff",
    cursor: "pointer",
    transition: "0.2s"
};


/* Switch OFF */
const switchOffStyle = {
    position: "absolute",
    inset: 0,
    borderRadius: "20px",
    background: "#cbd3df",
    cursor: "pointer",
    transition: "0.2s"
};


/* Knob ON */
const knobOnStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    top: "3px",
    right: "3px",
    background: "white",
    borderRadius: "50%",
    transition: "0.2s"
};


/* Knob OFF */
const knobOffStyle = {
    position: "absolute",
    width: "20px",
    height: "20px",
    top: "3px",
    left: "3px",
    background: "white",
    borderRadius: "50%",
    transition: "0.2s"
};

export default Settings;