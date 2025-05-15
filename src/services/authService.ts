import axios from 'axios';
import { AuthResponse, LoginFormData, RegisterFormData, ResetPasswordFormData } from '../types/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/auth';

// Создаем два экземпляра axios: один для публичных запросов, другой для защищенных
const publicAxios = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

export const authService = {
  // Публичные методы (без токена)
  async register(data: RegisterFormData): Promise<void> {
    await publicAxios.post('/register-user', data);
    // Сохраняем email для использования на странице подтверждения
    localStorage.setItem('pendingVerificationEmail', data.email);
  },

  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await publicAxios.post<AuthResponse>('/login', data);
    const { jwtToken } = response.data;
    localStorage.setItem('jwtToken', jwtToken);
    return response.data;
  },

  async logout(): Promise<void> {
    await privateAxios.post('/logout');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('pendingVerificationEmail');
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

  validateToken: async (token: string): Promise<boolean> => {
    try {
      await privateAxios.get('/validate');
      return true;
    } catch {
      return false;
    }
  },
}; 