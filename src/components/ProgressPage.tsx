import React from 'react';
import { jwtDecode } from "jwt-decode";
import QuizProgressList from './QuizProgressList'; 

interface DecodedToken {
  sub: string;
  role: string;
  exp?: number;
  iat?: number;
}

const ProgressPage: React.FC = () => {
  const token = localStorage.getItem("token");
  let username = "";
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      username = decoded.sub;
    } catch (error) {
      console.error("Failed to decode token:", error);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Quiz Progress</h1>
      <QuizProgressList username={username} />
    </div>
  );
};

export default ProgressPage;
