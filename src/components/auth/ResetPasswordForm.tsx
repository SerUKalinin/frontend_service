import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ResetPasswordFormData } from '../../types/auth';
import { authService } from '../../services/authService';
import Input from '../common/Input';
import Button from '../common/Button';

const schema = yup.object({
  newPassword: yup.string()
    .required('Введите новый пароль')
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .matches(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
    .matches(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
    .matches(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')
    .matches(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Пароль должен содержать хотя бы один специальный символ'),
  confirmPassword: yup.string()
    .required('Подтвердите новый пароль')
    .oneOf([yup.ref('newPassword')], 'Пароли не совпадают')
}).required();

interface PasswordRequirement {
  id: string;
  label: string;
  regex: RegExp;
  met: boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { id: 'length', label: 'Минимум 8 символов', regex: /.{8,}/, met: false },
  { id: 'uppercase', label: 'Хотя бы одна заглавная буква', regex: /[A-Z]/, met: false },
  { id: 'lowercase', label: 'Хотя бы одна строчная буква', regex: /[a-z]/, met: false },
  { id: 'number', label: 'Хотя бы одна цифра', regex: /[0-9]/, met: false },
  { id: 'special', label: 'Хотя бы один специальный символ (!@#$%^&*()_+-=[]{}|;:,.<>?)', regex: /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, met: false }
];

const ResetPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [requirements, setRequirements] = useState<PasswordRequirement[]>(passwordRequirements);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema)
  });

  const watchPassword = watch('newPassword', '');
  const watchConfirmPassword = watch('confirmPassword', '');

  useEffect(() => {
    const newRequirements = requirements.map(req => ({
      ...req,
      met: req.regex.test(watchPassword)
    }));
    setRequirements(newRequirements);
    
    const doPasswordsMatch = watchPassword === watchConfirmPassword && watchPassword !== '';
    setPasswordsMatch(doPasswordsMatch);
    
    const isAllRequirementsMet = newRequirements.every(req => req.met);
    setIsPasswordValid(isAllRequirementsMet && doPasswordsMatch);
  }, [watchPassword, watchConfirmPassword, requirements]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Недействительная ссылка для сброса пароля');
      return;
    }

    // Проверяем все требования и совпадение паролей перед отправкой
    const allRequirementsMet = requirements.every(req => req.met);
    const doPasswordsMatch = data.newPassword === data.confirmPassword && data.newPassword !== '';
    
    if (!allRequirementsMet || !doPasswordsMatch) {
      toast.error('Пароль не соответствует требованиям или пароли не совпадают');
      return;
    }

    try {
      const response = await authService.resetPassword({
        ...data,
        token
      });
      
      if (response.jwtToken) {
        localStorage.setItem('jwtToken', response.jwtToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        toast.success('Пароль успешно изменен!');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error('Ошибка при получении токена авторизации');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data || 'Ошибка при сбросе пароля');
    }
  };

  if (!token) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title text-red-500">Ошибка</h2>
          <p className="auth-subtitle">
            Недействительная ссылка для сброса пароля.
            Пожалуйста, запросите новую ссылку.
          </p>
          <Button
            onClick={() => navigate('/forgot-password')}
            fullWidth
          >
            Запросить новую ссылку
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Сброс пароля</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <Input
              id="newPassword"
              label="Новый пароль"
              type={showPassword ? "text" : "password"}
              error={errors.newPassword?.message}
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[calc(50%+11px)] -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm font-medium text-gray-700">Требования к паролю:</p>
            <ul className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {requirements.map((requirement) => (
                <li
                  key={requirement.id}
                  className={`flex items-center text-sm ${
                    requirement.met ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  <span className="mr-2 flex-shrink-0">
                    {requirement.met ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </span>
                  <span className="flex-grow">{requirement.label}</span>
                </li>
              ))}
              <li
                className={`flex items-center text-sm ${
                  passwordsMatch ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                <span className="mr-2 flex-shrink-0">
                  {passwordsMatch ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </span>
                <span className="flex-grow">Пароли совпадают</span>
              </li>
            </ul>
          </div>

          <div className="relative">
            <Input
              id="confirmPassword"
              label="Подтверждение пароля"
              type={showConfirmPassword ? "text" : "password"}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[calc(50%+11px)] -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isPasswordValid || !passwordsMatch}
            fullWidth
            className={`${(!isPasswordValid || !passwordsMatch) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Сменить пароль
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

export default ResetPasswordForm; 