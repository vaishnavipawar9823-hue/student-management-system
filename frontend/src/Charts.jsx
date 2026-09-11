import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Charts() {
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
                console.error(
                    "Error loading chart data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);

    if (loading) {
        return <h2>Loading charts...</h2>;
    }

    // Count students by course
    const courseCounts = {};

    students.forEach((student) => {
        courseCounts[student.course] =
            (courseCounts[student.course] || 0) + 1;
    });

    const courses = Object.entries(courseCounts);

    // Find highest value for bar width
    const maxCount =
        courses.length > 0
            ? Math.max(...courses.map(([, count]) => count))
            : 1;

    return (
        <div
            style={{
                maxWidth: "1100px",
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
                    Charts
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    View student statistics and course distribution.
                </p>

            </div>


            {/* Chart Card */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "10px",
                    padding: "25px"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "25px"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                fontSize: "20px",
                                color: "#172033",
                                marginBottom: "5px"
                            }}
                        >
                            Students by Course
                        </h2>

                        <p
                            style={{
                                fontSize: "13px",
                                color: "#8290a5"
                            }}
                        >
                            Number of students enrolled in each course.
                        </p>

                    </div>

                    <div
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "8px",
                            background: "#eef3ff",
                            color: "#2878ff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px"
                        }}
                    >
                        <i className="bi bi-bar-chart-line"></i>
                    </div>

                </div>


                {courses.length === 0 ? (

                    <p style={{ color: "#778399" }}>
                        No student data available.
                    </p>

                ) : (

                    <div>

                        {courses.map(([course, count]) => {

                            const barWidth =
                                (count / maxCount) * 100;

                            return (
                                <div
                                    key={course}
                                    style={{
                                        marginBottom: "22px"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            marginBottom: "8px"
                                        }}
                                    >

                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "#39455a",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {course}
                                        </span>

                                        <span
                                            style={{
                                                fontSize: "14px",
                                                color: "#2878ff",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {count}
                                        </span>

                                    </div>


                                    <div
                                        style={{
                                            height: "12px",
                                            background: "#edf1f6",
                                            borderRadius: "20px",
                                            overflow: "hidden"
                                        }}
                                    >

                                        <div
                                            style={{
                                                width: `${barWidth}%`,
                                                height: "100%",
                                                background:
                                                    "#2878ff",
                                                borderRadius: "20px",
                                                transition:
                                                    "width 0.4s ease"
                                            }}
                                        ></div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                )}

            </div>


            {/* Summary Cards */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >

                {/* Total Students */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce2eb",
                        borderRadius: "10px",
                        padding: "22px"
                    }}
                >

                    <p
                        style={{
                            color: "#8290a5",
                            fontSize: "13px",
                            marginBottom: "8px"
                        }}
                    >
                        Total Students
                    </p>

                    <h2
                        style={{
                            color: "#172033",
                            fontSize: "28px"
                        }}
                    >
                        {students.length}
                    </h2>

                </div>


                {/* Total Courses */}
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce2eb",
                        borderRadius: "10px",
                        padding: "22px"
                    }}
                >

                    <p
                        style={{
                            color: "#8290a5",
                            fontSize: "13px",
                            marginBottom: "8px"
                        }}
                    >
                        Total Courses
                    </p>

                    <h2
                        style={{
                            color: "#172033",
                            fontSize: "28px"
                        }}
                    >
                        {courses.length}
                    </h2>

                </div>

            </div>

        </div>
    );
}

export default Charts;