import React from 'react';
import QuizProgressList from './QuizProgressList'; 

const ProgressPage: React.FC = () => {
  // Get user email from localStorage (new Stytch system)
  const userId = localStorage.getItem("user_id") || "";

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Quiz Progress</h1>
      <QuizProgressList userId={userId} />
    </div>
  );
};

export default ProgressPage;
