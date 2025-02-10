import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";
import './../styles/Login.css';
import {TokenResponse , LoginProps} from "../types";


const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post<TokenResponse>("/login/", {
                username,
                password,
            });

            const token = response.data.access_token;
            localStorage.setItem("token", token);

            onLogin(token);
            setMessage("Login successful!");
            navigate("/quizzes");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage("Login failed: " + (error.response?.data.detail || "Unknown error"));
            } else {
                setMessage("Login failed: An unexpected error occurred");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
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
            <button onClick={handleLogin}>Login</button>
            <p>{message}</p>

            <p>
                Don't have an account? <a href="/register">Register here</a>.
            </p>
        </div>
    );
};

export default Login;
