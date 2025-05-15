# Auth Client

Клиентская часть системы аутентификации, разработанная с использованием React и TypeScript.

## Функциональность

- Вход в систему
- Регистрация новых пользователей
- Подтверждение email
- Сброс пароля
- Защищенные маршруты
- Адаптивный дизайн

## Технологии

- React 18
- TypeScript
- React Router v6
- React Hook Form
- Yup для валидации
- Axios для HTTP-запросов
- Tailwind CSS для стилизации
- React Toastify для уведомлений

## Требования

- Node.js 16+
- npm 7+

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd auth-client
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории и добавьте необходимые переменные окружения:
```env
REACT_APP_API_URL=http://localhost:8080/auth
```

## Запуск

Для запуска в режиме разработки:
```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000)

## Сборка

Для создания production-сборки:
```bash
npm run build
```

## Структура проекта

```
src/
  ├── components/
  │   └── auth/
  │       ├── LoginForm.tsx
  │       ├── RegisterForm.tsx
  │       ├── VerifyEmailForm.tsx
  │       ├── ForgotPasswordForm.tsx
  │       └── ResetPasswordForm.tsx
  ├── services/
  │   └── authService.ts
  ├── types/
  │   └── auth.ts
  ├── App.tsx
  └── index.tsx
```

## API Endpoints

Приложение использует следующие эндпоинты:

- POST `/auth/login` - вход в систему
- POST `/auth/register-user` - регистрация пользователя
- POST `/auth/verify-email` - подтверждение email
- POST `/auth/resend-verification` - повторная отправка кода подтверждения
- POST `/auth/forgot-password` - запрос на сброс пароля
- POST `/auth/reset-password` - установка нового пароля
- GET `/auth/validate` - проверка токена
- POST `/auth/logout` - выход из системы

## Безопасность

- Все формы защищены от CSRF-атак
- Пароли валидируются на стороне клиента
- JWT-токены хранятся в localStorage
- Защищенные маршруты требуют аутентификации
- Все API-запросы используют HTTPS
