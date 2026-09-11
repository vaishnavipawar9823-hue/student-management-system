import { useState } from "react";

function Forms() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        course: "",
        age: "",
        gender: "",
        message: ""
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        setSubmitted(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSubmitted(true);

        console.log("Form Data:", formData);
    };

    const handleReset = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            course: "",
            age: "",
            gender: "",
            message: ""
        });

        setSubmitted(false);
    };

    return (
        <div
            style={{
                maxWidth: "1000px",
                margin: "0 auto"
            }}
        >

            {/* Page Heading */}
            <div style={{ marginBottom: "28px" }}>

                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Forms
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    Example student form with validation and controls.
                </p>

            </div>


            {/* Form Card */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "10px",
                    padding: "30px"
                }}
            >

                <div
                    style={{
                        marginBottom: "25px"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            color: "#172033",
                            marginBottom: "6px"
                        }}
                    >
                        Student Form
                    </h2>

                    <p
                        style={{
                            fontSize: "13px",
                            color: "#8290a5"
                        }}
                    >
                        Enter student information below.
                    </p>
                </div>


                {/* Success Message */}
                {submitted && (
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
                        Form submitted successfully!
                    </div>
                )}


                <form onSubmit={handleSubmit}>

                    {/* First Row */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px"
                        }}
                    >

                        {/* Name */}
                        <div>
                            <label style={labelStyle}>
                                Full Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                                style={inputStyle}
                            />
                        </div>


                        {/* Email */}
                        <div>
                            <label style={labelStyle}>
                                Email Address
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                                style={inputStyle}
                            />
                        </div>


                        {/* Phone */}
                        <div>
                            <label style={labelStyle}>
                                Phone Number
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
                                min="1"
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


                    {/* Message */}
                    <div style={{ marginTop: "20px" }}>

                        <label style={labelStyle}>
                            Message
                        </label>

                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            style={{
                                ...inputStyle,
                                height: "120px",
                                paddingTop: "12px",
                                resize: "vertical"
                            }}
                        />

                    </div>


                    {/* Checkbox */}
                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >

                        <input
                            type="checkbox"
                            id="terms"
                            required
                        />

                        <label
                            htmlFor="terms"
                            style={{
                                fontSize: "14px",
                                color: "#536078"
                            }}
                        >
                            I confirm that the information is correct.
                        </label>

                    </div>


                    {/* Buttons */}
                    <div
                        style={{
                            marginTop: "25px",
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <button
                            type="submit"
                            style={{
                                background: "#2878ff",
                                color: "#ffffff",
                                border: "none",
                                borderRadius: "7px",
                                padding: "12px 22px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            <i
                                className="bi bi-check2-circle"
                                style={{
                                    marginRight: "8px"
                                }}
                            ></i>
                            Submit
                        </button>


                        <button
                            type="button"
                            onClick={handleReset}
                            style={{
                                background: "#eef1f5",
                                color: "#39455a",
                                border: "none",
                                borderRadius: "7px",
                                padding: "12px 22px",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Reset
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

export default Forms;