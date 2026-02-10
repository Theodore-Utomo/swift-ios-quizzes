import React, { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateQuizDialog } from "./CreateQuizDialog";
import { EditQuizDialog } from "./EditQuizDialog";
import { QuizCard } from "./QuizCard";
import type { Quiz } from "../../types/quiz";
import type { CourseData } from "./hooks/useInstructorDashboard";

interface QuizzesTabProps {
  selectedCourse: CourseData;
  quizzes: Quiz[];
  isCreateQuizOpen: boolean;
  setIsCreateQuizOpen: (open: boolean) => void;
  newQuizName: string;
  setNewQuizName: (name: string) => void;
  handleCreateQuiz: (quiz: Quiz) => void;
  isEditQuizOpen: boolean;
  editingQuiz: Quiz | null;
  handleEditQuiz: (quiz: Quiz) => void;
  handleDeleteQuiz: (quizId: string) => void;
  openEditQuiz: (quiz: Quiz) => void;
  closeEditQuiz: () => void;
}

export const QuizzesTab: React.FC<QuizzesTabProps> = ({
  selectedCourse,
  quizzes,
  isCreateQuizOpen,
  setIsCreateQuizOpen,
  newQuizName,
  setNewQuizName,
  handleCreateQuiz,
  isEditQuizOpen,
  editingQuiz,
  handleEditQuiz,
  handleDeleteQuiz,
  openEditQuiz,
  closeEditQuiz,
}) => {
  const sortedQuizzes = useMemo(() => {
    const cleaned = quizzes.map(q => ({ ...q, name: q.name.trim() }));
    const sorted = [...cleaned].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    return sorted;
  }, [quizzes]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quizzes for {selectedCourse.name}</h2>
          <p className="text-muted-foreground">{quizzes.length} quizzes</p>
        </div>
        <Button onClick={() => setIsCreateQuizOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Button>
      </div>

      <CreateQuizDialog
        open={isCreateQuizOpen}
        onOpenChange={(open) => {
          setIsCreateQuizOpen(open);
          if (!open) setNewQuizName("");
        }}
        courseName={selectedCourse.name}
        initialName={newQuizName}
        onCreate={handleCreateQuiz}
        onCancel={() => {
          setIsCreateQuizOpen(false);
          setNewQuizName("");
        }}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sortedQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onEdit={() => openEditQuiz(quiz)}
            onDelete={() => handleDeleteQuiz(quiz.id)}
          />
        ))}
      </div>

      {editingQuiz && (
        <EditQuizDialog
          open={isEditQuizOpen}
          onOpenChange={(open) => {
            if (!open) closeEditQuiz();
          }}
          courseName={selectedCourse.name}
          quiz={editingQuiz}
          onSave={handleEditQuiz}
          onCancel={closeEditQuiz}
        />
      )}
    </div>
  );
};
