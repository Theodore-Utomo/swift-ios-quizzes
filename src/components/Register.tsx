import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await api.post("/register/", { username, password, role });
            setMessage("Registration successful! You can now log in.");
            navigate("/login"); // Redirect to login after successful registration
        } catch (error) {
            setMessage("Registration failed: " + (axios.isAxiosError(error) ? error.response?.data.detail : "An unexpected error occurred"));
        }
    };

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
            </select>
            <button onClick={handleRegister}>Register</button>
            <p>{message}</p>

            {/* Link to the login page */}
            <p>
                Already have an account? <Link to="/login">Log in here</Link>.
            </p>
        </div>
    );
};

export default Register;
