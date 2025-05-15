import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthCard: React.FC = () => {
  const [tab, setTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === 'login' || customEvent.detail === 'register') {
        setTab(customEvent.detail);
      }
    };
    window.addEventListener('switch-auth-tab', handler);
    return () => window.removeEventListener('switch-auth-tab', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center">
        <h1 className="text-[#4361ee] text-2xl font-bold mb-1">RealEstate PRO</h1>
        <p className="text-[#adb5bd] text-sm">Система управления недвижимостью</p>
      </div>
      <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-lg p-4 animate-[fadeIn_0.5s_ease]">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`flex-1 py-1.5 text-base font-medium transition-colors ${tab === 'login' ? 'text-[#4361ee] border-b-2 border-[#4361ee] bg-white' : 'text-gray-400'}`}
            onClick={() => setTab('login')}
          >
            Вход
          </button>
          <button
            className={`flex-1 py-1.5 text-base font-medium transition-colors ${tab === 'register' ? 'text-[#4361ee] border-b-2 border-[#4361ee] bg-white' : 'text-gray-400'}`}
            onClick={() => setTab('register')}
          >
            Регистрация
          </button>
        </div>
        <div className="pt-1 pb-0">
          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default AuthCard; 