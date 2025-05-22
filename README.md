# Auth Client

## Описание проекта
Auth Client - это клиентское приложение для аутентификации, разработанное с использованием React и TypeScript. Проект предоставляет современный пользовательский интерфейс для управления аутентификацией пользователей.

## Технологии
- React 19.1.0
- TypeScript 4.9.5
- React Router DOM 6.22.3
- React Hook Form 7.51.0
- Axios 1.9.0
- Yup 1.3.3
- React Toastify 10.0.4
- Tailwind CSS

## Структура проекта
```
src/
├── components/     # React компоненты
├── services/      # Сервисы для работы с API
├── types/         # TypeScript типы и интерфейсы
├── App.tsx        # Корневой компонент приложения
└── index.tsx      # Точка входа приложения
```

## Установка и запуск

### Предварительные требования
- Node.js (рекомендуется последняя LTS версия)
- npm или yarn

### Установка зависимостей
```bash
npm install
# или
yarn install
```

### Запуск в режиме разработки
```bash
npm start
# или
yarn start
```

### Сборка проекта
```bash
npm run build
# или
yarn build
```

### Запуск тестов
```bash
npm test
# или
yarn test
```

## Основные функции
- Аутентификация пользователей
- Управление сессиями
- Валидация форм
- Обработка ошибок
- Уведомления пользователей

## Разработка
Проект использует современные практики разработки:
- Строгая типизация с TypeScript
- Компонентный подход
- Управление состоянием через React Hooks
- Валидация форм с помощью Yup
- Стилизация с использованием Tailwind CSS

## Тестирование
Проект включает в себя тесты с использованием:
- Jest
- React Testing Library
- User Event Testing

## Лицензия
Private - Все права защищены

## Функциональность

- Вход в систему
- Регистрация новых пользователей
- Подтверждение email
- Сброс пароля
- Защищенные маршруты
- Адаптивный дизайн

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
