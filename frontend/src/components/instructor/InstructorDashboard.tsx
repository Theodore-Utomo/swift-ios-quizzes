import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInstructorDashboard } from "./hooks/useInstructorDashboard";
import { OverviewTab } from "./OverviewTab";
import { CoursesTab } from "./CoursesTab";
import { QuizzesTab } from "./QuizzesTab";

const InstructorDashboard: React.FC = () => {
  const {
    courses,
    selectedCourse,
    quizzes,
    loading,
    error,
    activeTab,
    setActiveTab,
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
    selectCourseAndGoToQuizzes,
  } = useInstructorDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
          <p className="text-muted-foreground">Manage your courses and quizzes</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
          {selectedCourse && <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <OverviewTab
            courses={courses}
            onSelectCourse={selectCourseAndGoToQuizzes}
          />
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <CoursesTab
            courses={courses}
            isCreateCourseOpen={isCreateCourseOpen}
            setIsCreateCourseOpen={setIsCreateCourseOpen}
            newCourseName={newCourseName}
            setNewCourseName={setNewCourseName}
            handleCreateCourse={handleCreateCourse}
            isEditCourseOpen={isEditCourseOpen}
            editCourseName={editCourseName}
            setEditCourseName={setEditCourseName}
            handleEditCourse={handleEditCourse}
            handleDeleteCourse={handleDeleteCourse}
            openEditCourse={openEditCourse}
            closeEditCourse={closeEditCourse}
            selectCourseAndGoToQuizzes={selectCourseAndGoToQuizzes}
          />
        </TabsContent>

        {selectedCourse && (
          <TabsContent value="quizzes" className="space-y-4">
            <QuizzesTab
              selectedCourse={selectedCourse}
              quizzes={quizzes}
              isCreateQuizOpen={isCreateQuizOpen}
              setIsCreateQuizOpen={setIsCreateQuizOpen}
              newQuizName={newQuizName}
              setNewQuizName={setNewQuizName}
              handleCreateQuiz={handleCreateQuiz}
              isEditQuizOpen={isEditQuizOpen}
              editingQuiz={editingQuiz}
              handleEditQuiz={handleEditQuiz}
              handleDeleteQuiz={handleDeleteQuiz}
              openEditQuiz={openEditQuiz}
              closeEditQuiz={closeEditQuiz}
            />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default InstructorDashboard;
