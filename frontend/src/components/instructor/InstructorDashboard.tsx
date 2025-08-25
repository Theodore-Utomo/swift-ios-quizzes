import React, { useState, useEffect } from "react";
import { Plus, BookOpen, Users, Edit2, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import QuizEditor from "./QuizEditor";
import { apiService } from "../../services/api";
import { Quiz } from "../../types/quiz";
import { CourseOut } from "../../types/course";

interface CourseData extends CourseOut {
  quiz_count?: number;
}

const InstructorDashboard: React.FC = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialog states
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);
  
  // Form states
  const [newCourseName, setNewCourseName] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [newQuizName, setNewQuizName] = useState("");

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await apiService.getCourses();
      const data = res.data;
      
      // Fetch quiz count for each course
      const coursesWithQuizCount = await Promise.all(
        data.map(async (course: CourseData) => {
          try {
            const quizRes = await apiService.getCourseQuizzes(course.id);
            return { ...course, quiz_count: quizRes.data.length };
          } catch {
            return { ...course, quiz_count: 0 };
          }
        })
      );
      
      setCourses(coursesWithQuizCount);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quizzes for selected course
  const fetchQuizzes = async (courseId: string) => {
    try {
      const res = await apiService.getCourseQuizzes(courseId);
      setQuizzes(res.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchQuizzes(selectedCourse.id);
    }
  }, [selectedCourse]);

  // Course handlers
  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    
    try {
      await apiService.createCourse({ name: newCourseName });
      
      await fetchCourses();
      setNewCourseName("");
      setIsCreateCourseOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditCourse = async () => {
    if (!editingCourse || !editCourseName.trim()) return;
    
    try {
      await apiService.updateCourse(editingCourse.id, { name: editCourseName });
      
      await fetchCourses();
      setEditingCourse(null);
      setEditCourseName("");
      setIsEditCourseOpen(false);
      
      if (selectedCourse && selectedCourse.id === editingCourse.id) {
        setSelectedCourse({ ...editingCourse, name: editCourseName });
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await apiService.deleteCourse(courseId);
      
      await fetchCourses();
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(null);
        setQuizzes([]);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Quiz handlers
  const handleCreateQuiz = async (quiz: Quiz) => {
    if (!selectedCourse) return;
    
    try {
      await apiService.createQuiz(selectedCourse.id, quiz);
      
      await fetchQuizzes(selectedCourse.id);
      await fetchCourses();
      setIsCreateQuizOpen(false);
      setNewQuizName("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    if (!selectedCourse) return;
    
    try {
      await apiService.updateQuiz(selectedCourse.id, quiz.id, quiz);
      
      await fetchQuizzes(selectedCourse.id);
      setEditingQuiz(null);
      setIsEditQuizOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!selectedCourse) return;
    
    try {
      await apiService.deleteQuiz(selectedCourse.id, quizId);
      
      await fetchQuizzes(selectedCourse.id);
      await fetchCourses();
    } catch (error: any) {
      setError(error.message);
    }
  };

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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {courses.reduce((sum, course) => sum + (course.quiz_count || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
                <CardDescription>Your most recently created courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {courses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{course.name}</span>
                        <Badge variant="secondary">{course.quiz_count || 0} quizzes</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course);
                          setActiveTab("quizzes");
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Courses</h2>
            <Dialog open={isCreateCourseOpen} onOpenChange={setIsCreateCourseOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Course</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new course.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input
                      id="courseName"
                      value={newCourseName}
                      onChange={(e) => setNewCourseName(e.target.value)}
                      placeholder="e.g., Introduction to Programming"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateCourseOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCourse}>Create Course</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCourse(course);
                          setEditCourseName(course.name);
                          setIsEditCourseOpen(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Course</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{course.name}"? This action cannot be undone and will delete all associated quizzes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteCourse(course.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardDescription>
                    <Badge variant="secondary">{course.quiz_count || 0} quizzes</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedCourse(course);
                      setActiveTab("quizzes");
                    }}
                  >
                    Manage Quizzes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Course Dialog */}
          <Dialog open={isEditCourseOpen} onOpenChange={setIsEditCourseOpen}>
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
                    value={editCourseName}
                    onChange={(e) => setEditCourseName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditCourseOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCourse}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {selectedCourse && (
          <TabsContent value="quizzes" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Quizzes for {selectedCourse.name}</h2>
                <p className="text-muted-foreground">{quizzes.length} quizzes</p>
              </div>
              <Dialog open={isCreateQuizOpen} onOpenChange={setIsCreateQuizOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Quiz
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New Quiz</DialogTitle>
                    <DialogDescription>
                      Create a new quiz for {selectedCourse.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <QuizEditor
                    quiz={{
                      id: "",
                      name: newQuizName,
                      content: []
                    }}
                    onSave={handleCreateQuiz}
                    onCancel={() => {
                      setIsCreateQuizOpen(false);
                      setNewQuizName("");
                    }}
                    isNew={true}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{quiz.name}</CardTitle>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingQuiz(quiz);
                            setIsEditQuizOpen(true);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{quiz.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteQuiz(quiz.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <CardDescription>
                      <Badge variant="secondary">{quiz.content.length} questions</Badge>
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Edit Quiz Dialog */}
            {editingQuiz && (
              <Dialog open={isEditQuizOpen} onOpenChange={setIsEditQuizOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Quiz</DialogTitle>
                    <DialogDescription>
                      Edit "{editingQuiz.name}" for {selectedCourse.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <QuizEditor
                    quiz={editingQuiz}
                    onSave={handleEditQuiz}
                    onCancel={() => {
                      setEditingQuiz(null);
                      setIsEditQuizOpen(false);
                    }}
                    isNew={false}
                  />
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default InstructorDashboard;
