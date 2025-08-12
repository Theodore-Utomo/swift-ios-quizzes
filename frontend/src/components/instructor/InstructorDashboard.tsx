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
import { ClassOut } from "../../types/class";

interface ClassData extends ClassOut {
  quiz_count?: number;
}

const InstructorDashboard: React.FC = () => {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Dialog states
  const [isCreateClassOpen, setIsCreateClassOpen] = useState(false);
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);
  
  // Form states
  const [newClassName, setNewClassName] = useState("");
  const [editClassName, setEditClassName] = useState("");
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [newQuizName, setNewQuizName] = useState("");

  // Fetch classes
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await apiService.getClasses();
      const data = res.data;
      
      // Fetch quiz count for each class
      const classesWithQuizCount = await Promise.all(
        data.map(async (cls: ClassData) => {
          try {
            const quizRes = await apiService.getClassQuizzes(cls.class_id);
            return { ...cls, quiz_count: quizRes.data.length };
          } catch {
            return { ...cls, quiz_count: 0 };
          }
        })
      );
      
      setClasses(classesWithQuizCount);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch quizzes for selected class
  const fetchQuizzes = async (classId: string) => {
    try {
      const res = await apiService.getClassQuizzes(classId);
      setQuizzes(res.data);
    } catch (error: any) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchQuizzes(selectedClass.class_id);
    }
  }, [selectedClass]);

  // Class handlers
  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    
    try {
      await apiService.createClass({ name: newClassName });
      
      await fetchClasses();
      setNewClassName("");
      setIsCreateClassOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditClass = async () => {
    if (!editingClass || !editClassName.trim()) return;
    
    try {
      await apiService.updateClass(editingClass.class_id, { name: editClassName });
      
      await fetchClasses();
      setEditingClass(null);
      setEditClassName("");
      setIsEditClassOpen(false);
      
      if (selectedClass && selectedClass.class_id === editingClass.class_id) {
        setSelectedClass({ ...editingClass, name: editClassName });
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteClass = async (classId: string) => {
    try {
      await apiService.deleteClass(classId);
      
      await fetchClasses();
      if (selectedClass && selectedClass.class_id === classId) {
        setSelectedClass(null);
        setQuizzes([]);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  // Quiz handlers
  const handleCreateQuiz = async (quiz: Quiz) => {
    if (!selectedClass) return;
    
    try {
      await apiService.createQuiz(selectedClass.class_id, quiz);
      
      await fetchQuizzes(selectedClass.class_id);
      await fetchClasses();
      setIsCreateQuizOpen(false);
      setNewQuizName("");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    if (!selectedClass) return;
    
    try {
      await apiService.updateQuiz(selectedClass.class_id, quiz.id, quiz);
      
      await fetchQuizzes(selectedClass.class_id);
      setEditingQuiz(null);
      setIsEditQuizOpen(false);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!selectedClass) return;
    
    try {
      await apiService.deleteQuiz(selectedClass.class_id, quizId);
      
      await fetchQuizzes(selectedClass.class_id);
      await fetchClasses();
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
          <p className="text-muted-foreground">Manage your classes and quizzes</p>
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
          <TabsTrigger value="classes">Manage Classes</TabsTrigger>
          {selectedClass && <TabsTrigger value="quizzes">Manage Quizzes</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classes.reduce((sum, cls) => sum + (cls.quiz_count || 0), 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Classes</CardTitle>
                <CardDescription>Your most recently created classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classes.slice(0, 5).map((cls) => (
                    <div key={cls.class_id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cls.name}</span>
                        <Badge variant="secondary">{cls.quiz_count || 0} quizzes</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(cls);
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

        <TabsContent value="classes" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Classes</h2>
            <Dialog open={isCreateClassOpen} onOpenChange={setIsCreateClassOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Class
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Class</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new class.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="className">Class Name</Label>
                    <Input
                      id="className"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      placeholder="e.g., Introduction to Programming"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateClassOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateClass}>Create Class</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((cls) => (
              <Card key={cls.class_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{cls.name}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingClass(cls);
                          setEditClassName(cls.name);
                          setIsEditClassOpen(true);
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
                            <AlertDialogTitle>Delete Class</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{cls.name}"? This action cannot be undone and will delete all associated quizzes.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteClass(cls.class_id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardDescription>
                    <Badge variant="secondary">{cls.quiz_count || 0} quizzes</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => {
                      setSelectedClass(cls);
                      setActiveTab("quizzes");
                    }}
                  >
                    Manage Quizzes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Class Dialog */}
          <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Class</DialogTitle>
                <DialogDescription>
                  Update the name of your class.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="editClassName">Class Name</Label>
                  <Input
                    id="editClassName"
                    value={editClassName}
                    onChange={(e) => setEditClassName(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditClassOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditClass}>Save Changes</Button>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        {selectedClass && (
          <TabsContent value="quizzes" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Quizzes for {selectedClass.name}</h2>
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
                      Create a new quiz for {selectedClass.name}.
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
                      Edit "{editingQuiz.name}" for {selectedClass.name}.
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