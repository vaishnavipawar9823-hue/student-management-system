import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function Departments() {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);

    const [formData, setFormData] = useState({
        department_name: "",
        head_of_department: "",
        description: ""
    });

    const getDepartments = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/departments/get.php`
            );

            if (response.data.status === 200) {
                setDepartments(response.data.data);
                setError("");
            } else {
                setError(
                    response.data.message ||
                    "Unable to load departments."
                );
            }
        } catch (error) {
            console.error("Get departments error:", error);
            setError("Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDepartments();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleEdit = (department) => {
        setEditingDepartment(department);

        setFormData({
            department_name: department.department_name,
            head_of_department: department.head_of_department,
            description: department.description || ""
        });

        setShowForm(true);
    };

    const resetForm = () => {
        setFormData({
            department_name: "",
            head_of_department: "",
            description: ""
        });

        setEditingDepartment(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.department_name.trim() ||
            !formData.head_of_department.trim()
        ) {
            alert(
                "Please enter department name and head of department."
            );
            return;
        }

        try {
            let response;

            if (editingDepartment) {
                response = await axios.post(
                    `${API_BASE_URL}/departments/update.php`,
                    {
                        id: editingDepartment.id,
                        ...formData
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
            } else {
                response = await axios.post(
                    `${API_BASE_URL}/departments/create.php`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );
            }

            if (response.data.status === 200) {
                alert(
                    editingDepartment
                        ? "Department updated successfully!"
                        : "Department added successfully!"
                );

                resetForm();
                getDepartments();
            } else {
                alert(
                    response.data.message ||
                    "Unable to save department."
                );
            }
        } catch (error) {
            console.error("Save department error:", error);

            if (error.response) {
                alert(
                    error.response.data.message ||
                    "Unable to save department."
                );
            } else {
                alert("Unable to connect to the backend.");
            }
        }
    };

    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this department?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        const response = await axios.delete(
            `${API_BASE_URL}/departments/delete.php`,
            {
                data: { id },
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.data.status === 200) {
            alert("Department deleted successfully!");

            setDepartments(
                departments.filter(
                    (department) => department.id !== id
                )
            );
        } else {
            alert(
                response.data.message ||
                "Unable to delete department."
            );
        }

    } catch (error) {
        console.error("Delete department error:", error);

        if (error.response) {
            alert(
                error.response.data.message ||
                "Unable to delete department."
            );
        } else {
            alert("Unable to connect to the backend.");
        }
    }
};
    
    if (loading) {
        return <h2>Loading departments...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div
            style={{
                maxWidth: "1100px",
                margin: "0 auto"
            }}
        >
            {/* Heading */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "28px"
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: "30px",
                            color: "#172033",
                            marginBottom: "8px"
                        }}
                    >
                        Departments
                    </h1>

                    <p
                        style={{
                            color: "#778399",
                            fontSize: "15px",
                            margin: 0
                        }}
                    >
                        Manage all college departments.
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (editingDepartment) {
                            resetForm();
                        } else {
                            setShowForm(!showForm);
                        }
                    }}
                    style={{
                        background: "#4181ff",
                        color: "#ffffff",
                        border: "none",
                        padding: "12px 18px",
                        borderRadius: "7px",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    <i
                        className="bi bi-plus-lg"
                        style={{ marginRight: "7px" }}
                    ></i>

                    Add Department
                </button>
            </div>

            {/* Add / Edit Form */}

            {showForm && (
                <div
                    style={{
                        background: "#ffffff",
                        border: "1px solid #dce2eb",
                        borderRadius: "8px",
                        padding: "25px",
                        marginBottom: "24px"
                    }}
                >
                    <h2
                        style={{
                            marginTop: 0,
                            marginBottom: "20px",
                            color: "#172033",
                            fontSize: "21px"
                        }}
                    >
                        {editingDepartment
                            ? "Edit Department"
                            : "Add Department"}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(250px, 1fr))",
                                gap: "18px"
                            }}
                        >
                            <div>
                                <label style={labelStyle}>
                                    Department Name
                                </label>

                                <input
                                    type="text"
                                    name="department_name"
                                    value={formData.department_name}
                                    onChange={handleChange}
                                    placeholder="Enter department name"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    Head of Department
                                </label>

                                <input
                                    type="text"
                                    name="head_of_department"
                                    value={
                                        formData.head_of_department
                                    }
                                    onChange={handleChange}
                                    placeholder="Enter HOD name"
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "18px" }}>
                            <label style={labelStyle}>
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter department description"
                                rows="4"
                                style={{
                                    ...inputStyle,
                                    resize: "vertical"
                                }}
                            ></textarea>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                marginTop: "20px"
                            }}
                        >
                            <button
                                type="submit"
                                style={{
                                    background: "#4181ff",
                                    color: "#ffffff",
                                    border: "none",
                                    padding: "11px 18px",
                                    borderRadius: "7px",
                                    cursor: "pointer",
                                    fontWeight: "600"
                                }}
                            >
                                {editingDepartment
                                    ? "Update Department"
                                    : "Save Department"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                style={{
                                    background: "#eef1f5",
                                    color: "#344054",
                                    border: "none",
                                    padding: "11px 18px",
                                    borderRadius: "7px",
                                    cursor: "pointer"
                                }}
                            >
                                Cancel
                            </button>

                            <button
    onClick={() =>
        handleDelete(department.id)
    }
    style={{
        background: "#dc3545",
        color: "#ffffff",
        border: "none",
        padding: "7px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        marginLeft: "8px"
    }}
>
    <i className="bi bi-trash"></i>
    {" "}Delete
</button>

                        </div>
                    </form>
                </div>
            )}

            {/* Department Table */}

            <div
                style={{
                    background: "#ffffff",
                    border: "1px solid #dce2eb",
                    borderRadius: "8px",
                    overflow: "hidden"
                }}
            >
                <div
                    style={{
                        padding: "18px 20px",
                        borderBottom: "1px solid #dce2eb"
                    }}
                >
                    <h2
                        style={{
                            fontSize: "20px",
                            color: "#172033",
                            margin: 0
                        }}
                    >
                        All Departments
                    </h2>
                </div>

<div className="departments-table-scroll">                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            minWidth: "1100px"
                        }}
                    >
                        <thead>
                            <tr
                                style={{
                                    background: "#f8faff"
                                }}
                            >
                                <th style={thStyle}>ID</th>

                                <th style={thStyle}>
                                    DEPARTMENT
                                </th>

                                <th style={thStyle}>
                                    HEAD OF DEPARTMENT
                                </th>

                                <th style={thStyle}>
                                    DESCRIPTION
                                </th>

                                <th style={thStyle}>
                                    ACTION
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {departments.map((department) => (
                                <tr key={department.id}>

    <td style={tdStyle}>
        {department.id}
    </td>

    <td
        style={{
            ...tdStyle,
            fontWeight: "600"
        }}
    >
        {department.department_name}
    </td>

    <td style={tdStyle}>
        {department.head_of_department}
    </td>

    <td style={tdStyle}>
        {department.description}
    </td>

    <td style={tdStyle}>

        {/* Edit Button */}
        <button
            onClick={() => handleEdit(department)}
            style={{
                background: "#4181ff",
                color: "#ffffff",
                border: "none",
                padding: "7px 12px",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "8px"
            }}
        >
            <i className="bi bi-pencil"></i>
            {" "}Edit
        </button>

        {/* Delete Button */}
        <button
            onClick={() => handleDelete(department.id)}
            style={{
                background: "#dc3545",
                color: "#ffffff",
                border: "none",
                padding: "7px 12px",
                borderRadius: "6px",
                cursor: "pointer"
            }}
        >
            <i className="bi bi-trash"></i>
            {" "}Delete
        </button>

    </td>

</tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {departments.length === 0 && (
                    <div
                        style={{
                            padding: "30px",
                            textAlign: "center",
                            color: "#778399"
                        }}
                    >
                        No departments found.
                    </div>
                )}
            </div>
        </div>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "7px",
    color: "#344054",
    fontSize: "14px",
    fontWeight: "600"
};

const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #dce2eb",
    borderRadius: "7px",
    padding: "11px 12px",
    fontSize: "14px",
    outline: "none"
};

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
    color: "#273449"
};

export default Departments;