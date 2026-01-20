import React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateCourseDialog } from "./CreateCourseDialog";
import { EditCourseDialog } from "./EditCourseDialog";
import { CourseCard } from "./CourseCard";
import type { CourseData } from "./hooks/useInstructorDashboard";

interface CoursesTabProps {
  courses: CourseData[];
  isCreateCourseOpen: boolean;
  setIsCreateCourseOpen: (open: boolean) => void;
  newCourseName: string;
  setNewCourseName: (name: string) => void;
  handleCreateCourse: () => void;
  isEditCourseOpen: boolean;
  editCourseName: string;
  setEditCourseName: (name: string) => void;
  handleEditCourse: () => void;
  handleDeleteCourse: (courseId: string) => void;
  openEditCourse: (course: CourseData) => void;
  closeEditCourse: () => void;
  selectCourseAndGoToQuizzes: (course: CourseData) => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({
  courses,
  isCreateCourseOpen,
  setIsCreateCourseOpen,
  newCourseName,
  setNewCourseName,
  handleCreateCourse,
  isEditCourseOpen,
  editCourseName,
  setEditCourseName,
  handleEditCourse,
  handleDeleteCourse,
  openEditCourse,
  closeEditCourse,
  selectCourseAndGoToQuizzes,
}) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold">Courses</h2>
      <Button onClick={() => setIsCreateCourseOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Course
      </Button>
    </div>

    <CreateCourseDialog
      open={isCreateCourseOpen}
      onOpenChange={(open) => {
        setIsCreateCourseOpen(open);
        if (!open) setNewCourseName("");
      }}
      name={newCourseName}
      onNameChange={setNewCourseName}
      onSubmit={handleCreateCourse}
      onCancel={() => {
        setIsCreateCourseOpen(false);
        setNewCourseName("");
      }}
    />

    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onManageQuizzes={() => selectCourseAndGoToQuizzes(course)}
          onEdit={() => openEditCourse(course)}
          onDelete={() => handleDeleteCourse(course.id)}
        />
      ))}
    </div>

    <EditCourseDialog
      open={isEditCourseOpen}
      onOpenChange={(open) => {
        if (!open) closeEditCourse();
      }}
      name={editCourseName}
      onNameChange={setEditCourseName}
      onSave={handleEditCourse}
      onCancel={closeEditCourse}
    />
  </div>
);
