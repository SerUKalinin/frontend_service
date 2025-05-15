import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ForgotPasswordFormData } from '../../types/auth';
import { authService } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';

const schema = yup.object({
  email: yup.string()
    .required('Введите email')
    .email('Введите корректный email')
}).required();

const ForgotPasswordForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await authService.forgotPassword(data.email);
      toast.success('Инструкции по сбросу пароля отправлены на ваш email');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при отправке инструкций');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Восстановление пароля</h2>
        <p className="auth-subtitle mb-6">
          Введите ваш email, и мы отправим вам инструкции по сбросу пароля.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            fullWidth
          >
            Сбросить пароль
          </Button>

          <p className="auth-subtitle">
            <Link to="/login" className="auth-link">
              Вернуться к входу
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm; 