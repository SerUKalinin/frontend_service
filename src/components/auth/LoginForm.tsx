import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoginFormData } from '../../types/auth';
import { authService } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';

const schema = yup.object({
  username: yup.string().required('Введите логин или email'),
  password: yup.string().required('Введите пароль')
}).required();

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem('jwtToken', response.jwtToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      toast.success('Вход выполнен успешно!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при входе');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Вход в систему</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="username"
            label="Логин или Email"
            type="text"
            error={errors.username?.message}
            {...register('username', { required: true })}
          />

          <Input
            id="password"
            label="Пароль"
            type="password"
            error={errors.password?.message}
            {...register('password', { required: true })}
          />

          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="auth-link text-sm">
              Забыли пароль?
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
          >
            Войти
          </Button>

          <p className="auth-subtitle">
            Нет аккаунта?{' '}
            <Link to="/register" className="auth-link">
              Зарегистрироваться
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm; 