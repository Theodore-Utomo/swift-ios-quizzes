import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { Quiz } from "../../../types/quiz";
import { CourseOut } from "../../../types/course";
import { getApiErrorMessage } from "@/lib/utils";

export interface CourseData extends CourseOut {
  quiz_count?: number;
}

export function useInstructorDashboard() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");

  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isEditCourseOpen, setIsEditCourseOpen] = useState(false);
  const [isCreateQuizOpen, setIsCreateQuizOpen] = useState(false);
  const [isEditQuizOpen, setIsEditQuizOpen] = useState(false);

  const [newCourseName, setNewCourseName] = useState("");
  const [editCourseName, setEditCourseName] = useState("");
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [newQuizName, setNewQuizName] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await apiService.getCourses();
      const data = res.data;
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async (courseId: string) => {
    try {
      const res = await apiService.getCourseQuizzes(courseId);
      setQuizzes(res.data);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
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

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    try {
      await apiService.createCourse({ name: newCourseName });
      await fetchCourses();
      setNewCourseName("");
      setIsCreateCourseOpen(false);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
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
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleCreateQuiz = async (quiz: Quiz) => {
    if (!selectedCourse) return;
    try {
      await apiService.createQuiz(selectedCourse.id, quiz);
      await fetchQuizzes(selectedCourse.id);
      await fetchCourses();
      setIsCreateQuizOpen(false);
      setNewQuizName("");
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    if (!selectedCourse) return;
    try {
      await apiService.updateQuiz(selectedCourse.id, quiz.id, quiz);
      await fetchQuizzes(selectedCourse.id);
      setEditingQuiz(null);
      setIsEditQuizOpen(false);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!selectedCourse) return;
    try {
      await apiService.deleteQuiz(selectedCourse.id, quizId);
      await fetchQuizzes(selectedCourse.id);
      await fetchCourses();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    }
  };

  const openEditCourse = (course: CourseData) => {
    setEditingCourse(course);
    setEditCourseName(course.name);
    setIsEditCourseOpen(true);
  };

  const closeEditCourse = () => {
    setEditingCourse(null);
    setEditCourseName("");
    setIsEditCourseOpen(false);
  };

  const openEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setIsEditQuizOpen(true);
  };

  const closeEditQuiz = () => {
    setEditingQuiz(null);
    setIsEditQuizOpen(false);
  };

  const selectCourseAndGoToQuizzes = (course: CourseData) => {
    setSelectedCourse(course);
    setActiveTab("quizzes");
  };

  return {
    courses,
    selectedCourse,
    setSelectedCourse,
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
    setIsEditCourseOpen,
    editingCourse,
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
    setIsEditQuizOpen,
    editingQuiz,
    setEditingQuiz,
    handleEditQuiz,
    handleDeleteQuiz,
    openEditQuiz,
    closeEditQuiz,
    selectCourseAndGoToQuizzes,
  };
}
