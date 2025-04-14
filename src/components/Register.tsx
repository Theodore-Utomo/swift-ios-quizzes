import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";
import "./../styles/Register.css";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            // Hardcode the role as "student"
            await api.post("/register/", { username, password, role: "student" });
            setMessage("Registration successful! You can now log in.");
            navigate("/login");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage("Registration failed: " + (error.response?.data.detail || "Unknown error"));
            } else {
                setMessage("Registration failed: An unexpected error occurred");
            }
        }
    };

    return (
        <div className="register-container">
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
            <button onClick={handleRegister}>Register</button>
            <p>{message}</p>
            <p>
                Already have an account? <Link to="/login">Log in here</Link>.
            </p>
        </div>
    );
};

export default Register;
