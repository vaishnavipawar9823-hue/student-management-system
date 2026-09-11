import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function AddStudent() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
        age: "",
        gender: "",
        address: "",
        profile_image: null
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleImageChange = (e) => {
        setFormData({
            ...formData,
            profile_image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("course", formData.course);
            data.append("age", formData.age);
            data.append("gender", formData.gender);
            data.append("address", formData.address);

            if (formData.profile_image) {
                data.append(
                    "profile_image",
                    formData.profile_image
                );
            }

            const response = await axios.post(
                `${API_BASE_URL}/students/create.php`,
                data,
                {
                    withCredentials: true
                }
            );

            if (response.data.status === 201) {
                setMessage("Student added successfully!");

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    course: "",
                    age: "",
                    gender: "",
                    address: "",
                    profile_image: null
                });

                // Reset file input
                document.getElementById("profile_image").value = "";
            } else {
                setError(response.data.message);
            }

        } catch (error) {
            console.error("Add student error:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "PHP API returned an error."
                );
            } else {
                setError("Unable to connect to PHP server.");
            }
        }
    };

    return (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

            {/* Page Heading */}
            <div style={{ marginBottom: "28px" }}>
                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Add User
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    Add a new student to the database.
                </p>
            </div>


            {/* Form Card */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "8px",
                    padding: "30px"
                }}
            >

                <h2
                    style={{
                        fontSize: "20px",
                        color: "#172033",
                        marginBottom: "25px"
                    }}
                >
                    Student Information
                </h2>


                {/* Success Message */}
                {message && (
                    <div
                        style={{
                            background: "#e9f8ef",
                            color: "#21874b",
                            border: "1px solid #bfe8ce",
                            borderRadius: "7px",
                            padding: "12px 15px",
                            marginBottom: "20px"
                        }}
                    >
                        {message}
                    </div>
                )}


                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            background: "#fff0f0",
                            color: "#c73d3d",
                            border: "1px solid #f0c2c2",
                            borderRadius: "7px",
                            padding: "12px 15px",
                            marginBottom: "20px"
                        }}
                    >
                        {error}
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* Name + Email */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px"
                        }}
                    >

                        <div>
                            <label style={labelStyle}>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter student name"
                                required
                                style={inputStyle}
                            />
                        </div>


                        <div>
                            <label style={labelStyle}>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                required
                                style={inputStyle}
                            />
                        </div>


                        {/* Phone */}
                        <div>
                            <label style={labelStyle}>
                                Phone
                            </label>

                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                required
                                style={inputStyle}
                            />
                        </div>


                        {/* Course */}
                        <div>
                            <label style={labelStyle}>
                                Course
                            </label>

                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">
                                    Select Course
                                </option>

                                <option value="Computer Science">
                                    Computer Science
                                </option>

                                <option value="Information Technology">
                                    Information Technology
                                </option>

                                <option value="Computer Applications">
                                    Computer Applications
                                </option>

                                <option value="Data Science">
                                    Data Science
                                </option>

                                <option value="Web Development">
                                    Web Development
                                </option>
                            </select>
                        </div>


                        {/* Age */}
                        <div>
                            <label style={labelStyle}>
                                Age
                            </label>

                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                required
                                style={inputStyle}
                            />
                        </div>


                        {/* Gender */}
                        <div>
                            <label style={labelStyle}>
                                Gender
                            </label>

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            >
                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>

                    </div>


                    {/* Address */}
                    <div style={{ marginTop: "20px" }}>
                        <label style={labelStyle}>
                            Address
                        </label>

                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter student address"
                            required
                            style={{
                                ...inputStyle,
                                width: "100%",
                                height: "110px",
                                paddingTop: "12px",
                                resize: "vertical"
                            }}
                        />
                    </div>


                    {/* Profile Image */}
                    <div style={{ marginTop: "20px" }}>

                        <label style={labelStyle}>
                            Profile Image
                        </label>

                        <input
                            id="profile_image"
                            type="file"
                            name="profile_image"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                width: "100%",
                                padding: "10px",
                                border: "1px solid #dce2eb",
                                borderRadius: "7px",
                                background: "#ffffff"
                            }}
                        />

                        <p
                            style={{
                                marginTop: "7px",
                                fontSize: "12px",
                                color: "#8290a5"
                            }}
                        >
                            JPG, PNG or other image files.
                        </p>

                    </div>


                    {/* Submit */}
                    <div style={{ marginTop: "28px" }}>

                        <button
                            type="submit"
                            style={{
                                background: "#2878ff",
                                color: "white",
                                border: "none",
                                padding: "12px 25px",
                                borderRadius: "7px",
                                cursor: "pointer",
                                fontSize: "14px",
                                fontWeight: "600"
                            }}
                        >
                            <i
                                className="bi bi-person-plus"
                                style={{
                                    marginRight: "8px"
                                }}
                            ></i>

                            Add Student
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


/* Label */
const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#39455a"
};


/* Input */
const inputStyle = {
    width: "100%",
    height: "44px",
    border: "1px solid #dce2eb",
    borderRadius: "7px",
    padding: "0 12px",
    outline: "none",
    fontSize: "14px",
    background: "#ffffff",
    color: "#273449"
};

export default AddStudent;