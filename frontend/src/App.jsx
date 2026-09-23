import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";
import axios from "axios";

import Login from "./Login";
import Dashboard from "./Dashboard";
import StudentManagement from "./StudentManagement";
import AddStudent from "./AddStudent";
import Profile from "./Profile";
import Charts from "./Charts";
import Tables from "./Tables";
import Forms from "./Forms";
import Settings from "./Settings";
import Teachers from "./Teachers";
import Components from "./Components";
import Attendance from "./Attendance";
import TeacherAttendance from "./TeacherAttendance";
import TeacherProfile from "./TeacherProfile";
import Leaves from "./Leaves";
import Departments from "./Departments";
import AdminLayout from "./AdminLayout";
import API_BASE_URL from "./api/config";


function ProtectedRoute({ children }) {

    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {

        const checkLogin = async () => {

            try {

                const response = await axios.get(
                    `${API_BASE_URL}/auth/profile.php`,
                    {
                        withCredentials: true
                    }
                );

                if (response.data.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }

            } catch (error) {

                console.error("Login check error:", error);
                setIsLoggedIn(false);

            } finally {

                setLoading(false);

            }
        };

        checkLogin();

    }, []);


    if (loading) {
        return <h2>Checking login...</h2>;
    }


    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }


    return children;
}


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                   LOGIN
                ========================= */}

                <Route
                    path="/"
                    element={<Login />}
                />


                {/* =========================
                   PROTECTED ADMIN AREA
                ========================= */}

                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* Dashboard */}

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />


                    {/* Student Management */}

                    <Route
                        path="/student-management"
                        element={<StudentManagement />}
                    />


                    {/* Add Student */}

                    <Route
                        path="/add-student"
                        element={<AddStudent />}
                    />


                    {/* Departments */}

                    <Route
                        path="/departments"
                        element={<Departments />}
                    />

<Route
    path="/teachers"
    element={<Teachers />}
/>

<Route
    path="/attendance"
    element={<Attendance />}
/>

<Route
    path="/teacher-attendance"
    element={<TeacherAttendance />}
/>

<Route
    path="/teacher-profile/:id"
    element={<TeacherProfile />}
/>

<Route
    path="/teacher-leaves"
    element={<Navigate to="/leaves" replace />}
/>

<Route path="/leaves" element={<Leaves />} />

                    {/* Profile */}

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />


                    {/* Charts */}

                    <Route
                        path="/charts"
                        element={<Charts />}
                    />


                    {/* Tables */}

                    <Route
                        path="/tables"
                        element={<Tables />}
                    />


                    {/* Forms */}

                    <Route
                        path="/forms"
                        element={<Forms />}
                    />


                    {/* Components */}

                    <Route
                        path="/components"
                        element={<Components />}
                    />


                    {/* Settings */}

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>


                {/* Unknown URL */}

                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />

            </Routes>

        </BrowserRouter>

    );
}

export default App;