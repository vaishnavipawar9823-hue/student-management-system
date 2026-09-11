import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        setMessage("");

        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/login.php`,
                {
                    email: email,
                    password: password
                },
                {
                    withCredentials: true
                }
            );

            if (response.data.status === 200) {
                window.location.href = "/dashboard";
            } else {
                setMessage(response.data.message);
            }

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server.");
        }
    };

    return (
        <div style={pageStyle}>

            <div style={loginCardStyle}>

                {/* Title */}
                <h1 style={titleStyle}>
                    Welcome Back
                </h1>

                <p style={subtitleStyle}>
                    Login to your Student Management System.
                </p>


                {/* Login Form */}
                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <div style={fieldStyle}>

                        <label style={labelStyle}>
                            E-mail Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                            style={inputStyle}
                        />

                    </div>


                    {/* Password */}
                    <div style={fieldStyle}>

                        <label style={labelStyle}>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            placeholder="Enter your password"
                            required
                            style={inputStyle}
                        />

                    </div>


                    {/* Remember Me */}
                    <div style={rememberStyle}>

                        <input
                            type="checkbox"
                            id="remember"
                        />

                        <label htmlFor="remember">
                            Remember me
                        </label>

                    </div>


                    {/* Message */}
                    {message && (
                        <div style={messageStyle}>
                            {message}
                        </div>
                    )}


                    {/* Login Button */}
                    <button
                        type="submit"
                        style={buttonStyle}
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}


/* =========================
   PAGE
========================= */

const pageStyle = {
    minHeight: "100vh",
    width: "100%",
    background: "#1769f5",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif"
};


/* =========================
   LOGIN CARD
========================= */

const loginCardStyle = {
    width: "540px",
    maxWidth: "100%",
    padding: "40px",
    border: "3px solid white",
    borderRadius: "10px",
    boxSizing: "border-box",
    color: "white"
};


/* =========================
   TITLE
========================= */

const titleStyle = {
    margin: "0 0 8px",
    fontSize: "32px",
    fontWeight: "700",
    color: "white"
};


/* =========================
   SUBTITLE
========================= */

const subtitleStyle = {
    margin: "0 0 28px",
    fontSize: "17px",
    color: "white"
};


/* =========================
   FIELD
========================= */

const fieldStyle = {
    marginBottom: "18px"
};


/* =========================
   LABEL
========================= */

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "15px",
    fontWeight: "600",
    color: "white"
};


/* =========================
   INPUT
========================= */

const inputStyle = {
    width: "100%",
    height: "46px",
    border: "none",
    borderRadius: "6px",
    padding: "0 16px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "white",
    color: "#222"
};


/* =========================
   REMEMBER ME
========================= */

const rememberStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    color: "white"
};


/* =========================
   MESSAGE
========================= */

const messageStyle = {
    padding: "10px 12px",
    marginBottom: "18px",
    borderRadius: "6px",
    background: "rgba(255, 255, 255, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    color: "white",
    fontSize: "14px"
};


/* =========================
   BUTTON
========================= */

const buttonStyle = {
    background: "#18202b",
    color: "white",
    border: "none",
    borderRadius: "7px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer"
};

export default Login;