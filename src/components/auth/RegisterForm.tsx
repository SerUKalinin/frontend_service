import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { RegisterFormData } from '../../types/auth';
import { authService } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';

const schema = yup.object({
  username: yup.string()
    .required('Введите логин')
    .min(3, 'Логин должен содержать минимум 3 символа')
    .max(50, 'Логин должен содержать максимум 50 символов'),
  email: yup.string()
    .required('Введите email')
    .email('Введите корректный email'),
  password: yup.string()
    .required('Введите пароль')
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру'),
  confirmPassword: yup.string()
    .required('Подтвердите пароль')
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
}).required();

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authService.register(data);
      toast.success('Регистрация успешна! Пожалуйста, проверьте вашу почту для подтверждения.');
      navigate('/verify-email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="username"
            label="Логин"
            type="text"
            error={errors.username?.message}
            {...register('username')}
          />

          <Input
            id="email"
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            id="password"
            label="Пароль"
            type="password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            id="confirmPassword"
            label="Подтверждение пароля"
            type="password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
          >
            Зарегистрироваться
          </Button>

          <p className="auth-subtitle">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="auth-link">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm; 