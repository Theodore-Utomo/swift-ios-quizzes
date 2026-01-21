import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
  open,
  onOpenChange,
  name,
  onNameChange,
  onSave,
  onCancel,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogDescription>
          Update the name of your course.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="editCourseName">Course Name</Label>
          <Input
            id="editCourseName"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>Save Changes</Button>
      </div>
    </DialogContent>
  </Dialog>
);
