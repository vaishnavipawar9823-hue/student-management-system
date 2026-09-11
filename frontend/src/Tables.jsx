import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Tables() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

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
                console.error("Error loading students:", error);
            } finally {
                setLoading(false);
            }
        };

        getStudents();
    }, []);

    const filteredStudents = students.filter((student) => {
        const text = search.toLowerCase();

        return (
            student.name.toLowerCase().includes(text) ||
            student.email.toLowerCase().includes(text) ||
            student.course.toLowerCase().includes(text)
        );
    });

    if (loading) {
        return <h2>Loading table...</h2>;
    }

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "0 auto"
            }}
        >
            {/* Heading */}
            <div style={{ marginBottom: "28px" }}>
                <h1
                    style={{
                        fontSize: "30px",
                        color: "#172033",
                        marginBottom: "8px"
                    }}
                >
                    Tables
                </h1>

                <p
                    style={{
                        color: "#778399",
                        fontSize: "15px"
                    }}
                >
                    View and manage student records.
                </p>
            </div>

            {/* Table Card */}
            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "10px",
                    overflow: "hidden"
                }}
            >
                {/* Header */}
                <div
                    style={{
                        padding: "18px 20px",
                        borderBottom: "1px solid #dce2eb",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap"
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
                            Student Records
                        </h2>

                        <p
                            style={{
                                fontSize: "13px",
                                color: "#8290a5"
                            }}
                        >
                            {students.length} student records
                        </p>
                    </div>

                    <div
                        style={{
                            width: "250px",
                            height: "40px",
                            border: "1px solid #dce2eb",
                            borderRadius: "7px",
                            display: "flex",
                            alignItems: "center",
                            padding: "0 12px"
                        }}
                    >
                        <i
                            className="bi bi-search"
                            style={{
                                color: "#8290a5",
                                marginRight: "8px"
                            }}
                        ></i>

                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            style={{
                                width: "100%",
                                border: "none",
                                outline: "none",
                                fontSize: "14px"
                            }}
                        />
                    </div>
                </div>

                {/* Responsive Table */}
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "950px"
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#f8faff"
                                }}
                            >
                                <th style={thStyle}>ID</th>
                                <th style={thStyle}>PHOTO</th>
                                <th style={thStyle}>NAME</th>
                                <th style={thStyle}>EMAIL</th>
                                <th style={thStyle}>PHONE</th>
                                <th style={thStyle}>COURSE</th>
                                <th style={thStyle}>AGE</th>
                                <th style={thStyle}>GENDER</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td style={tdStyle}>
                                        {student.id}
                                    </td>

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
                                        {student.phone}
                                    </td>

                                    <td style={tdStyle}>
                                        {student.course}
                                    </td>

                                    <td style={tdStyle}>
                                        {student.age}
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
                                                padding:
                                                    "6px 10px",
                                                borderRadius:
                                                    "20px",
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

                {filteredStudents.length === 0 && (
                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#778399"
                        }}
                    >
                        No students found.
                    </div>
                )}
            </div>
        </div>
    );
}

const thStyle = {
    textAlign: "left",
    padding: "14px 12px",
    borderBottom: "1px solid #dce2eb",
    fontSize: "12px",
    color: "#718096",
    fontWeight: "600",
    whiteSpace: "nowrap"
};

const tdStyle = {
    padding: "14px 12px",
    borderBottom: "1px solid #e8edf3",
    fontSize: "14px",
    color: "#273449",
    whiteSpace: "nowrap"
};

export default Tables;