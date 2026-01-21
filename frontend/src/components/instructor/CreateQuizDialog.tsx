import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizEditor from "./QuizEditor";
import { Quiz } from "../../types/quiz";

interface CreateQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseName: string;
  initialName: string;
  onCreate: (quiz: Quiz) => void;
  onCancel: () => void;
}

export const CreateQuizDialog: React.FC<CreateQuizDialogProps> = ({
  open,
  onOpenChange,
  courseName,
  initialName,
  onCreate,
  onCancel,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Create New Quiz</DialogTitle>
        <DialogDescription>
          Create a new quiz for {courseName}.
        </DialogDescription>
      </DialogHeader>
      <QuizEditor
        quiz={{ id: "", name: initialName, content: [] }}
        onSave={onCreate}
        onCancel={onCancel}
        isNew={true}
      />
    </DialogContent>
  </Dialog>
);
