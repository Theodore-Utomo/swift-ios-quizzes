import axios from 'axios';
import { Quiz, ClassCreate, ClassOut, QuizProgress, QuizProgressSubmission, AuthRequest } from '../types';

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const apiService = {
    // Classes
    getClasses: () => api.get<ClassOut[]>('/classes/'),
    getClass: (classId: string) => api.get<ClassOut>(`/classes/${classId}`),
    createClass: (data: ClassCreate) => api.post<ClassOut>('/classes/', data),
    updateClass: (classId: string, data: ClassCreate) => api.put<ClassOut>(`/classes/${classId}`, data),
    deleteClass: (classId: string) => api.delete(`/classes/${classId}`),

    // Quizzes
    getClassQuizzes: (classId: string) => api.get<Quiz[]>(`/classes/${classId}/quizzes/`),
    getQuiz: (classId: string, quizId: string) => api.get<Quiz>(`/classes/${classId}/quizzes/${quizId}`),
    createQuiz: (classId: string, quiz: Quiz) => api.post<Quiz>(`/classes/${classId}/quizzes/`, quiz),
    updateQuiz: (classId: string, quizId: string, quiz: Quiz) => api.put<Quiz>(`/classes/${classId}/quizzes/${quizId}`, quiz),
    deleteQuiz: (classId: string, quizId: string) => api.delete(`/classes/${classId}/quizzes/${quizId}`),

    // Quiz Progress (with explicit userId)
    getQuizProgress: (userId: string) => api.get<QuizProgress[]>(`/quizzes/${userId}/quizProgress`),
    submitQuizProgress: (userId: string, quizId: string, data: QuizProgressSubmission) => api.post<QuizProgress>(`/quizzes/${userId}/quizProgress/${quizId}`, data),

    // Auth (for AuthDebug component)
    authenticate: (data: AuthRequest) => api.post('/authenticate/', data),
};


export const createUserApiService = (userId: string) => ({
    getUserQuizProgress: () => apiService.getQuizProgress(userId),
    submitUserQuizProgress: (quizId: string, data: QuizProgressSubmission) => apiService.submitQuizProgress(userId, quizId, data),
});

export default api;
