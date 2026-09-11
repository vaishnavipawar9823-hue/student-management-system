import { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "./api/config";

function StudentCount() {
    const [count, setCount] = useState(0);

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
                    setCount(response.data.data.length);
                }

            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        getStudents();
    }, []);

    return (
        <div>
            <h3>Total Students</h3>
            <p>{count}</p>
        </div>
    );
}

export default StudentCount;