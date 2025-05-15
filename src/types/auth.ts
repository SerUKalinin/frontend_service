export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface VerifyEmailFormData {
  email: string;
  code: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
  token?: string;
}

export interface AuthResponse {
  jwtToken: string;
  refreshToken: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

export interface ApiError {
  message: string;
  status: number;
} 