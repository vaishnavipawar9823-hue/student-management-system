import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getStudents = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/students/get.php`,
                    {
                        withCredentials: true
                    }
                );

                if (response.data.status === 200) {
                    setStudents(response.data.data);
                }
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);

    if (loading) {
        return <h2>Loading dashboard...</h2>;
    }

    const totalStudents = students.length;

    const uniqueCourses = [
        ...new Set(
            students.map((student) => student.course)
        )
    ];

    const totalCourses = uniqueCourses.length;

    const maleStudents = students.filter(
        (student) => student.gender === "Male"
    ).length;

    const femaleStudents = students.filter(
        (student) => student.gender === "Female"
    ).length;

    const recentStudents = students.slice(0, 5);

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* Header */}
            <div style={{ marginBottom: "30px" }}>
                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Dashboard
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    Welcome back! Here is an overview of your
                    student management system.
                </p>
            </div>


            {/* Summary Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px"
                }}
            >

                {/* Students */}
                <div style={cardStyle}>
                    <div style={iconBoxStyle}>
                        <i className="bi bi-people"></i>
                    </div>

                    <p style={labelStyle}>
                        Total Students
                    </p>

                    <h2 style={numberStyle}>
                        {totalStudents}
                    </h2>

                    <p style={smallTextStyle}>
                        Registered students
                    </p>
                </div>


                {/* Courses */}
                <div style={cardStyle}>
                    <div style={iconBoxStyle}>
                        <i className="bi bi-book"></i>
                    </div>

                    <p style={labelStyle}>
                        Total Courses
                    </p>

                    <h2 style={numberStyle}>
                        {totalCourses}
                    </h2>

                    <p style={smallTextStyle}>
                        Available courses
                    </p>
                </div>


                {/* Male */}
                <div style={cardStyle}>
                    <div style={iconBoxStyle}>
                        <i className="bi bi-person"></i>
                    </div>

                    <p style={labelStyle}>
                        Male Students
                    </p>

                    <h2 style={numberStyle}>
                        {maleStudents}
                    </h2>

                    <p style={smallTextStyle}>
                        Male registrations
                    </p>
                </div>


                {/* Female */}
                <div style={cardStyle}>
                    <div style={iconBoxStyle}>
                        <i className="bi bi-person-hearts"></i>
                    </div>

                    <p style={labelStyle}>
                        Female Students
                    </p>

                    <h2 style={numberStyle}>
                        {femaleStudents}
                    </h2>

                    <p style={smallTextStyle}>
                        Female registrations
                    </p>
                </div>

            </div>


            {/* Recent Students */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "10px",
                    marginTop: "25px",
                    overflow: "hidden"
                }}
            >

                <div
                    style={{
                        padding: "20px 22px",
                        borderBottom: "1px solid #e5eaf0",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >

                    <div>
                        <h2
                            style={{
                                fontSize: "20px",
                                color: "#172033",
                                marginBottom: "4px"
                            }}
                        >
                            Recent Students
                        </h2>

                        <p
                            style={{
                                color: "#8290a5",
                                fontSize: "13px"
                            }}
                        >
                            Latest student registrations
                        </p>
                    </div>

                    <span
                        style={{
                            background: "#eef3ff",
                            color: "#2878ff",
                            padding: "7px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600"
                        }}
                    >
                        {recentStudents.length} Recent
                    </span>

                </div>


                <div style={{ overflowX: "auto" }}>

                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "800px"
                        }}
                    >

                        <thead>
                            <tr
                                style={{
                                    background: "#f8faff"
                                }}
                            >
                                <th style={thStyle}>PHOTO</th>
                                <th style={thStyle}>NAME</th>
                                <th style={thStyle}>EMAIL</th>
                                <th style={thStyle}>COURSE</th>
                                <th style={thStyle}>GENDER</th>
                            </tr>
                        </thead>


                        <tbody>

                            {recentStudents.map((student) => (

                                <tr key={student.id}>

                                    <td style={tdStyle}>

                                        {student.profile_image ? (

                                            <img
                                                src={`${API_BASE_URL}/uploads/${student.profile_image}`}
                                                alt={student.name}
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%"
                                                }}
                                            />

                                        ) : (

                                            <div
                                                style={{
                                                    width: "42px",
                                                    height: "42px",
                                                    borderRadius: "50%",
                                                    background: "#eef3ff",
                                                    color: "#2878ff",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center"
                                                }}
                                            >
                                                <i className="bi bi-person"></i>
                                            </div>

                                        )}

                                    </td>


                                    <td
                                        style={{
                                            ...tdStyle,
                                            fontWeight: "600"
                                        }}
                                    >
                                        {student.name}
                                    </td>


                                    <td style={tdStyle}>
                                        {student.email}
                                    </td>


                                    <td style={tdStyle}>
                                        {student.course}
                                    </td>


                                    <td style={tdStyle}>

                                        <span
                                            style={{
                                                background:
                                                    student.gender ===
                                                    "Female"
                                                        ? "#fff0f6"
                                                        : "#eef3ff",
                                                color:
                                                    student.gender ===
                                                    "Female"
                                                        ? "#d14d8b"
                                                        : "#2878ff",
                                                padding: "6px 10px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {student.gender}
                                        </span>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>


                {recentStudents.length === 0 && (
                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#8290a5"
                        }}
                    >
                        No students available.
                    </div>
                )}

            </div>


            {/* Course Overview */}
            <div
                style={{
                    marginTop: "25px",
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "10px",
                    padding: "24px"
                }}
            >

                <h2
                    style={{
                        fontSize: "20px",
                        color: "#172033",
                        marginBottom: "20px"
                    }}
                >
                    Course Overview
                </h2>


                {uniqueCourses.map((course) => {

                    const count = students.filter(
                        (student) =>
                            student.course === course
                    ).length;

                    const percentage =
                        totalStudents > 0
                            ? (count / totalStudents) * 100
                            : 0;

                    return (
                        <div
                            key={course}
                            style={{
                                marginBottom: "18px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "7px"
                                }}
                            >
                                <span
                                    style={{
                                        color: "#39455a",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}
                                >
                                    {course}
                                </span>

                                <span
                                    style={{
                                        color: "#2878ff",
                                        fontSize: "13px",
                                        fontWeight: "600"
                                    }}
                                >
                                    {count} students
                                </span>
                            </div>


                            <div
                                style={{
                                    width: "100%",
                                    height: "9px",
                                    background: "#edf1f6",
                                    borderRadius: "20px",
                                    overflow: "hidden"
                                }}
                            >
                                <div
                                    style={{
                                        width: `${percentage}%`,
                                        height: "100%",
                                        background: "#2878ff",
                                        borderRadius: "20px"
                                    }}
                                ></div>
                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
}


/* Card */

const cardStyle = {
    background: "#ffffff",
    border: "1px solid #dce2eb",
    borderRadius: "10px",
    padding: "22px"
};


/* Icon */

const iconBoxStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "9px",
    background: "#eef3ff",
    color: "#2878ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
    marginBottom: "16px"
};


/* Label */

const labelStyle = {
    color: "#8290a5",
    fontSize: "13px",
    marginBottom: "7px"
};


/* Number */

const numberStyle = {
    color: "#172033",
    fontSize: "30px",
    margin: 0,
    marginBottom: "5px"
};


/* Small text */

const smallTextStyle = {
    color: "#8290a5",
    fontSize: "12px",
    margin: 0
};


/* Table header */

const thStyle = {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #dce2eb",
    fontSize: "12px",
    color: "#718096",
    fontWeight: "600",
    whiteSpace: "nowrap"
};


/* Table cell */

const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #e8edf3",
    fontSize: "14px",
    color: "#273449",
    whiteSpace: "nowrap"
};

export default Dashboard;