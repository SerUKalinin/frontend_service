import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from '../../services/authService';

export const VerifyEmailForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const email = localStorage.getItem('pendingVerificationEmail');
    if (!email) {
      navigate('/login');
      return;
    }
    setPendingEmail(email);
    startResendTimer();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const startResendTimer = () => {
    setResendTimer(60);
  };

  const handleInputChange = (index: number, value: string) => {
    // Обработка вставки кода
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      pastedCode.forEach((digit, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i]!.value = digit;
        }
      });
      // Фокус на последнем заполненном поле или следующем пустом
      const nextEmptyIndex = pastedCode.findIndex(digit => !digit) + 1;
      if (nextEmptyIndex > 0 && nextEmptyIndex < 6) {
        inputRefs.current[nextEmptyIndex]?.focus();
      } else {
        inputRefs.current[5]?.focus();
      }
      // Проверяем, заполнен ли весь код
      if (pastedCode.length === 6 && pastedCode.every(digit => digit)) {
        onSubmit(pastedCode.join(''));
      }
      return;
    }

    // Обычный ввод одной цифры
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Проверяем, заполнен ли весь код
    const code = inputRefs.current.map(input => input?.value || '').join('');
    if (code.length === 6 && code.split('').every(digit => digit)) {
      onSubmit(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const onSubmit = async (code: string) => {
    try {
      setIsLoading(true);
      const response = await authService.verifyEmail(code);
      // Сохраняем токен из ответа
      if (response?.jwtToken) {
        localStorage.setItem('jwtToken', response.jwtToken);
      }
      toast.success('Email успешно подтвержден');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при подтверждении email');
      // Очищаем поля при ошибке
      inputRefs.current.forEach(input => {
        if (input) input.value = '';
      });
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    
    try {
      setIsResending(true);
      await authService.resendVerificationCode();
      toast.success('Новый код отправлен на ваш email');
      startResendTimer();
      // Очищаем поля при повторной отправке
      inputRefs.current.forEach(input => {
        if (input) input.value = '';
      });
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при отправке кода');
    } finally {
      setIsResending(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('pendingVerificationEmail');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex justify-center items-center p-5">
      <div className="w-full max-w-[500px] p-8 bg-white rounded-xl shadow-sm text-center animate-[fadeIn_0.5s_ease]">
        <div className="mb-6">
          <h1 className="text-[#4361ee] text-2xl font-bold mb-2">RealEstate PRO</h1>
        </div>

        <h2 className="text-xl text-[#1b263b] mb-4">Подтверждение email</h2>
        <p className="text-[#adb5bd] mb-8 leading-relaxed">
          {pendingEmail ? `На ${pendingEmail} отправлен 6-значный код подтверждения. Проверьте вашу почту, включая папку "Спам".` : 'На ваш email отправлен 6-значный код подтверждения'}
        </p>

        <div className="flex justify-center gap-2.5 mb-8">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={6}
              pattern="[0-9]*"
              inputMode="numeric"
              autoComplete="one-time-code"
              className="w-[50px] h-[60px] text-center text-2xl border-2 border-[#ddd] rounded-lg transition-all focus:border-[#4361ee] focus:outline-none focus:shadow-[0_0_0_3px_rgba(67,97,238,0.2)]"
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onKeyPress={handleKeyPress}
              onPaste={e => {
                e.preventDefault();
                const pastedData = e.clipboardData.getData('text');
                if (/^\d{6}$/.test(pastedData)) {
                  handleInputChange(0, pastedData);
                }
              }}
              autoFocus={index === 0}
              disabled={isLoading}
            />
          ))}
        </div>

        {isLoading && (
          <div className="mb-6">
            <div className="w-5 h-5 border-3 border-[#4361ee]/30 border-t-[#4361ee] rounded-full animate-spin mx-auto" />
          </div>
        )}

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-[#4361ee] text-[#4361ee] rounded-lg font-medium cursor-pointer transition-all hover:bg-[rgba(67,97,238,0.1)]"
          >
            Отмена
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={handleResendCode}
            disabled={resendTimer > 0 || isResending}
            className={`text-[#4361ee] cursor-pointer transition-all hover:underline ${
              (resendTimer > 0 || isResending) ? 'text-[#adb5bd] cursor-not-allowed' : ''
            }`}
          >
            {isResending ? 'Отправка...' : 
             resendTimer > 0 ? `Отправить повторно (${resendTimer})` : 
             'Отправить код повторно'}
          </button>
        </div>
      </div>
    </div>
  );
}; 