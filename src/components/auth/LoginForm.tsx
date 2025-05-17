import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';
import { LoginFormData } from '../../types/auth';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await authService.login(data);
      toast.success('Вход выполнен успешно');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="auth-card">
      <h2 className="auth-title">Вход в систему</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          id="username"
          label="Логин или Email"
          type="text"
          error={errors.username?.message}
          {...register('username', { 
            required: 'Это поле обязательно' 
          })}
        />
        <Input
          id="password"
          label="Пароль"
          type="password"
          error={errors.password?.message}
          {...register('password', { 
            required: 'Это поле обязательно' 
          })}
        />
        <div className="flex items-center justify-between">
          <a href="/forgot-password" className="auth-link text-sm">
            Забыли пароль?
          </a>
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
        <p className="text-center text-sm text-gray-600">
          Нет аккаунта?{' '}
          <a href="/register" className="auth-link">
            Зарегистрироваться
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm; 