import React, { useState } from "react";
import ClassList from "./ClassList";
import QuizManager from "./QuizManager";
import "./../styles/InstructorPanel.css";

const InstructorPanel: React.FC = () => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");

  return (
    <div className="instructor-panel-container" style={{ display: "flex", gap: "20px" }}>
      <div className="class-list-container" style={{ flex: "1" }}>
        <h2>Your Classes</h2>
        <ClassList
          onSelectClass={(id, name) => {
            setSelectedClassId(id);
            setSelectedClassName(name);
          }}
          selectedClassId={selectedClassId}
        />
      </div>
      <div className="quiz-manager-container" style={{ flex: "2" }}>
        {selectedClassId ? (
          <>
            <h2>Manage Quizzes for: {selectedClassName}</h2>
            <QuizManager classId={selectedClassId} />
          </>
        ) : (
          <p>Please select a class to manage its quizzes.</p>
        )}
      </div>
    </div>
  );
};

export default InstructorPanel;
