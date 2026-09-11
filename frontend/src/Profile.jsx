import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/auth/profile.php`,
                    {
                        withCredentials: true
                    }
                );

                if (response.data.status === 200) {
                    setUser(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (error) {
                console.error(error);
                setError("Unable to load profile.");
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, []);

    if (loading) {
        return <h2>Loading profile...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

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
                    My Profile
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    View your administrator account information.
                </p>
            </div>


            {/* Profile Card */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >

                {/* Profile Header */}
                <div
                    style={{
                        background:
                            "linear-gradient(135deg, #2878ff, #13a5a5)",
                        padding: "35px 30px",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        gap: "20px"
                    }}
                >

                    {/* Avatar */}
                    <div
                        style={{
                            width: "90px",
                            height: "90px",
                            borderRadius: "50%",
                            background: "rgba(255,255,255,0.2)",
                            border:
                                "3px solid rgba(255,255,255,0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "30px",
                            fontWeight: "bold"
                        }}
                    >
                        {user.name
                            ? user.name
                                  .substring(0, 2)
                                  .toUpperCase()
                            : "AD"}
                    </div>

                    <div>
                        <h2
                            style={{
                                fontSize: "25px",
                                marginBottom: "5px"
                            }}
                        >
                            {user.name}
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                opacity: 0.9
                            }}
                        >
                            {user.role}
                        </p>
                    </div>

                </div>


                {/* Profile Information */}
                <div style={{ padding: "30px" }}>

                    <h3
                        style={{
                            color: "#172033",
                            marginBottom: "22px"
                        }}
                    >
                        Account Information
                    </h3>


                    {/* User ID */}
                    <div style={rowStyle}>

                        <div style={labelStyle}>
                            <i
                                className="bi bi-person-badge"
                                style={iconStyle}
                            ></i>
                            User ID
                        </div>

                        <div style={valueStyle}>
                            {user.id}
                        </div>

                    </div>


                    {/* Name */}
                    <div style={rowStyle}>

                        <div style={labelStyle}>
                            <i
                                className="bi bi-person"
                                style={iconStyle}
                            ></i>
                            Name
                        </div>

                        <div style={valueStyle}>
                            {user.name}
                        </div>

                    </div>


                    {/* Email */}
                    <div style={rowStyle}>

                        <div style={labelStyle}>
                            <i
                                className="bi bi-envelope"
                                style={iconStyle}
                            ></i>
                            Email
                        </div>

                        <div style={valueStyle}>
                            {user.email}
                        </div>

                    </div>


                    {/* Role */}
                    <div
                        style={{
                            ...rowStyle,
                            borderBottom: "none"
                        }}
                    >

                        <div style={labelStyle}>
                            <i
                                className="bi bi-shield-check"
                                style={iconStyle}
                            ></i>
                            Role
                        </div>

                        <div>
                            <span
                                style={{
                                    background: "#eef3ff",
                                    color: "#2878ff",
                                    padding: "7px 13px",
                                    borderRadius: "20px",
                                    fontSize: "13px",
                                    fontWeight: "600"
                                }}
                            >
                                {user.role}
                            </span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


/* Row */
const rowStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "17px 0",
    borderBottom: "1px solid #e8edf3",
    gap: "20px"
};


/* Label */
const labelStyle = {
    color: "#617087",
    fontSize: "14px",
    fontWeight: "600"
};


/* Value */
const valueStyle = {
    color: "#273449",
    fontSize: "14px"
};


/* Icon */
const iconStyle = {
    marginRight: "10px",
    color: "#2878ff"
};

export default Profile;