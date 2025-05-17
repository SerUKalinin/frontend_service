import axios from 'axios';
import { AuthResponse, LoginFormData, RegisterFormData, ResetPasswordFormData } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/auth';

// Создаем два экземпляра axios: один для публичных запросов, другой для защищенных
const publicAxios = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const privateAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Добавляем перехватчик для защищенных запросов
privateAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем флаг для отслеживания состояния выхода
let isLoggingOut = false;

// Обновляем перехватчик ответов
privateAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если это запрос на выход или мы уже в процессе выхода, не пытаемся обновить токен
    if (isLoggingOut || originalRequest.url?.includes('/logout')) {
      return Promise.reject(error);
    }

    // Если ошибка 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Пытаемся обновить токен
        const response = await authService.refreshToken();
        const { jwtToken } = response;

        // Сохраняем новый токен
        localStorage.setItem('jwtToken', jwtToken);

        // Обновляем заголовок Authorization
        originalRequest.headers.Authorization = `Bearer ${jwtToken}`;

        // Повторяем оригинальный запрос
        return privateAxios(originalRequest);
      } catch (refreshError) {
        // Если не удалось обновить токен, выходим из системы
        await authService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  // Публичные методы (без токена)
  async register(data: RegisterFormData): Promise<void> {
    await publicAxios.post('/register-user', data);
    // Сохраняем email для использования на странице подтверждения
    localStorage.setItem('pendingVerificationEmail', data.email);
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await publicAxios.post<AuthResponse>('/login', data);
    const { jwtToken, refreshToken } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.setItem('refreshToken', refreshToken);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      isLoggingOut = true; // Устанавливаем флаг выхода
      await privateAxios.post('/logout');
    } finally {
      // Очищаем все токены и данные пользователя
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('pendingVerificationEmail');
      isLoggingOut = false; // Сбрасываем флаг выхода
    }
  },

  async verifyEmail(code: string): Promise<AuthResponse> {
    const email = localStorage.getItem('pendingVerificationEmail');
    if (!email) {
      throw new Error('Email not found. Please register first.');
    }
    
    // Отправляем код на верификацию и получаем токен сразу
    const response = await publicAxios.post<AuthResponse>('/verify-email', { email, code });
    const { jwtToken } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    localStorage.removeItem('pendingVerificationEmail'); // Очищаем сохраненный email
    
    return response.data;
  },

  async resendVerificationCode(): Promise<void> {
    const email = localStorage.getItem('pendingVerificationEmail');
    if (!email) {
      throw new Error('Email not found. Please register first.');
    }
    await publicAxios.post('/resend-verification', { email });
  },

  async forgotPassword(email: string): Promise<void> {
    await publicAxios.post('/forgot-password', { email });
  },

  async resetPassword(data: ResetPasswordFormData): Promise<AuthResponse> {
    const response = await publicAxios.post<AuthResponse>('/reset-password', data);
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await publicAxios.post<AuthResponse>('/refresh-token');
    const { jwtToken } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    return response.data;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('jwtToken');
  },

  // Защищенные методы (с токеном)
  getProfile: async (): Promise<any> => {
    const response = await privateAxios.get('/profile');
    return response.data;
  },

  updateProfile: async (data: any): Promise<any> => {
    const response = await privateAxios.put('/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await privateAxios.post('/change-password', data);
  },

  validateToken: async (): Promise<boolean> => {
    try {
      await privateAxios.get('/validate');
      return true;
    } catch {
      return false;
    }
  },
}; 