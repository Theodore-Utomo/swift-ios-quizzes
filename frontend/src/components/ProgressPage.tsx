import React from 'react';
import QuizProgressList from './QuizProgressList'; 

const ProgressPage: React.FC = () => {
  // Get user email from localStorage (new Stytch system)
  const userEmail = localStorage.getItem("user_email") || "";

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Quiz Progress</h1>
      <QuizProgressList username={userEmail} />
    </div>
  );
};

export default ProgressPage;
