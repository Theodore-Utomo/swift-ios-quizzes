import React from 'react';
import QuizProgressList from './QuizProgressList'; 

const ProgressPage: React.FC = () => {
  return (
    <div style={{ padding: "1rem" }}>
      <h1>Your Quiz Progress</h1>
      <QuizProgressList />
    </div>
  );
};

export default ProgressPage;
