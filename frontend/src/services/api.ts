import axios from 'axios';
import { Quiz } from '../types/quiz';
import { CourseCreate, CourseOut } from '../types/course';
import { QuizProgress, QuizProgressSubmission } from '../types/progress';
import { AuthRequest } from '../types/auth';
import { MetricsOut } from '../types/metrics';

export const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const sessionToken = localStorage.getItem('stytch_session');
        if (sessionToken) {
            config.headers.Authorization = `Bearer ${sessionToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear auth data on 401
            localStorage.removeItem('stytch_session');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_role');
            localStorage.removeItem('user_id');
            localStorage.removeItem('stytch_user_id');
            // Redirect to login
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    // Courses
    getCourses: () => api.get<CourseOut[]>('/courses/'),
    getCourse: (courseId: string) => api.get<CourseOut>(`/courses/${courseId}`),
    createCourse: (data: CourseCreate) => api.post<CourseOut>('/courses/', data),
    updateCourse: (courseId: string, data: CourseCreate) => api.put<CourseOut>(`/courses/${courseId}`, data),
    deleteCourse: (courseId: string) => api.delete(`/courses/${courseId}`),

    // Quizzes 
    getAllQuizzes: () => api.get<Quiz[]>('/quizzes/'),
    getQuizById: (quizId: string) => api.get<Quiz>(`/quizzes/${quizId}`),
    getCourseQuizzes: (courseId: string) => api.get<Quiz[]>(`/quizzes/courses/${courseId}/quizzes`),
    getQuiz: (courseId: string, quizId: string) => api.get<Quiz>(`/quizzes/courses/${courseId}/quizzes/${quizId}`),
    createQuiz: (courseId: string, quiz: Quiz) => api.post<Quiz>(`/quizzes/courses/${courseId}/quizzes`, quiz),
    updateQuiz: (courseId: string, quizId: string, quiz: Quiz) => api.put<Quiz>(`/quizzes/courses/${courseId}/quizzes/${quizId}`, quiz),
    deleteQuiz: (courseId: string, quizId: string) => api.delete(`/quizzes/courses/${courseId}/quizzes/${quizId}`),

    getQuizProgress: (userId: string) => api.get<QuizProgress[]>(`/QuizProgress/${userId}`),
    submitQuizProgress: (userId: string, quizId: string, data: QuizProgressSubmission) => api.post<QuizProgress>(`/QuizProgress/${userId}/quizProgress/${quizId}`, data),

    // Auth (for AuthDebug component)
    authenticate: (data: AuthRequest) => api.post('/authenticate/', data),

    // Feedback
    submitFeedback: (feedbackBody: string, userId: string) => api.post('/feedback/', {
        feedback_body: feedbackBody,
        submitted_at: new Date().toISOString(),
        user_id: userId,
    }),

    // Metrics
    getMetrics: () => api.get<MetricsOut>('/metrics/metrics'),
};


export const createUserApiService = (userId: string) => ({
    getUserQuizProgress: () => apiService.getQuizProgress(userId),
    submitUserQuizProgress: (quizId: string, data: QuizProgressSubmission) => apiService.submitQuizProgress(userId, quizId, data),
});

export default api;
