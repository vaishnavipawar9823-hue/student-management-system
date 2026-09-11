import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Components from "./Components";
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

                {/* Login */}
                <Route
                    path="/"
                    element={<Login />}
                />


                {/* Protected Admin Pages */}
                <Route
                    element={
                        <ProtectedRoute>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/student-management"
                        element={<StudentManagement />}
                    />

                    <Route
                        path="/add-student"
                        element={<AddStudent />}
                    />

                    <Route
                        path="/profile"
                        element={<Profile />}
                    />

                    <Route
                        path="/charts"
                        element={<Charts />}
                    />

                    <Route
                        path="/tables"
                        element={<Tables />}
                    />

                    <Route
                        path="/forms"
                        element={<Forms />}
                    />

<Route
    path="/components"
    element={<Components />}
/>

                    <Route
                        path="/settings"
                        element={<Settings />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );
}

export default App;