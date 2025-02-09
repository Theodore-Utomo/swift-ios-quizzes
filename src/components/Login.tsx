import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import axios from "axios";

interface TokenResponse {
    access_token: string;
    token_type: string;
}

const Login: React.FC = () => {
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

            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const role = decodedToken.role;

            setMessage("Login successful!");
            
            console.log(role)
            // Navigate based on the user's role
            navigate("/quizzes");
           
        } catch (error) {
            setMessage("Login failed: " + (axios.isAxiosError(error) ? error.response?.data.detail : "An unexpected error occurred"));
        }
    };

    return (
        <div>
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
