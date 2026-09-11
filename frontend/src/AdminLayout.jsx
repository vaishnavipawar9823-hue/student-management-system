import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";
import "./AdminLayout.css";

function AdminLayout() {
    const navigate = useNavigate();

    const [darkMode, setDarkMode] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);
    const [globalSearch, setGlobalSearch] = useState("");

    const handleLogout = async () => {
        try {
            const response = await axios.get(
                `${API_BASE_URL}/auth/logout.php`,
                {
                    withCredentials: true
                }
            );

            if (response.data.status === 200) {
                navigate("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Unable to logout.");
        }
    };

    return (
        <div
            className={
                darkMode
                    ? `admin-layout dark-mode ${
                          sidebarOpen ? "" : "sidebar-collapsed"
                      }`
                    : `admin-layout ${
                          sidebarOpen ? "" : "sidebar-collapsed"
                      }`
            }
        >

            {/* Sidebar */}
            <aside className="sidebar">

                {/* Logo */}
                <div className="sidebar-brand">

                    <div className="brand-icon">
                        <i className="bi bi-grid-1x2-fill"></i>
                    </div>

                    <div className="brand-text">
                        <h2>adminHMD</h2>
                        <p>Admin Template</p>
                    </div>

                </div>


                {/* Sidebar Menu */}
                <nav className="sidebar-menu">

                    <NavLink to="/dashboard">
                        <i className="bi bi-speedometer2"></i>
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink to="/student-management">
                        <i className="bi bi-people"></i>
                        <span>Users</span>
                    </NavLink>

                    <NavLink to="/add-student">
                        <i className="bi bi-person-plus"></i>
                        <span>Add User</span>
                    </NavLink>

                    <NavLink to="/profile">
                        <i className="bi bi-person-badge"></i>
                        <span>Profile</span>
                    </NavLink>

                    <NavLink to="/charts">
                        <i className="bi bi-bar-chart-line"></i>
                        <span>Charts</span>
                    </NavLink>

                    <NavLink to="/tables">
                        <i className="bi bi-table"></i>
                        <span>Tables</span>
                    </NavLink>

                    <NavLink to="/forms">
                        <i className="bi bi-ui-checks-grid"></i>
                        <span>Forms</span>
                    </NavLink>

                    <NavLink to="/components">
                        <i className="bi bi-grid-3x3-gap"></i>
                        <span>Components</span>
                    </NavLink>

                    <NavLink to="/settings">
                        <i className="bi bi-gear"></i>
                        <span>Settings</span>
                    </NavLink>

                </nav>


                {/* Logout */}
                <div className="sidebar-bottom">

                    <button onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i>
                        <span>Logout</span>
                    </button>

                </div>

            </aside>


            {/* Main Area */}
            <main className="admin-main">

                {/* Topbar */}
                <header className="topbar">

                    {/* Menu */}
                    <button
                        className="menu-button"
                        onClick={() =>
                            setSidebarOpen(!sidebarOpen)
                        }
                    >
                        <i className="bi bi-list"></i>
                    </button>


                    {/* Search */}
                    <div className="search-box">

                        <i className="bi bi-search"></i>

                        <input
    type="text"
    placeholder="Search students..."
    value={globalSearch}
    onChange={(e) => setGlobalSearch(e.target.value)}
    onKeyDown={(e) => {
        if (e.key === "Enter") {
    navigate("/student-management", {
        state: {
            search: globalSearch
        }
    });

    setGlobalSearch("");
}
    }}
/>

                    </div>


                    {/* Topbar Actions */}
                    <div className="topbar-actions">

                        {/* Dark Mode */}
                        <button
                            className="topbar-icon"
                            onClick={() =>
                                setDarkMode(!darkMode)
                            }
                        >
                            <i
                                className={
                                    darkMode
                                        ? "bi bi-sun"
                                        : "bi bi-moon-stars"
                                }
                            ></i>
                        </button>


                        {/* Notification */}
                        <button className="topbar-icon notification">

                            <i className="bi bi-bell"></i>

                            <span className="notification-dot"></span>

                        </button>


                        {/* Admin Profile */}
                        <div
                            className="admin-profile-wrapper"
                            onClick={() =>
                                setProfileOpen(!profileOpen)
                            }
                        >

                            <div className="admin-profile">

                                <div className="admin-avatar">
                                    AV
                                </div>

                                <div className="admin-info">
                                    <strong>Admin</strong>
                                    <span>Administrator</span>
                                </div>

                                <i
                                    className={
                                        profileOpen
                                            ? "bi bi-chevron-up"
                                            : "bi bi-chevron-down"
                                    }
                                ></i>

                            </div>


                            {/* Dropdown */}
                            {profileOpen && (
                                <div
                                    className="profile-dropdown"
                                    onClick={(e) =>
                                        e.stopPropagation()
                                    }
                                >

                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/profile");
                                        }}
                                    >
                                        <i className="bi bi-person"></i>
                                        Profile
                                    </button>


                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            navigate("/settings");
                                        }}
                                    >
                                        <i className="bi bi-gear"></i>
                                        Settings
                                    </button>


                                    <div className="dropdown-divider"></div>


                                    <button
                                        onClick={handleLogout}
                                    >
                                        <i className="bi bi-box-arrow-right"></i>
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>

                </header>


                {/* Page Content */}
                <section className="page-content">
                    <Outlet />
                </section>

            </main>

        </div>
    );
}

export default AdminLayout;