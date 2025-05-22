import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthCard from './components/auth/AuthCard';
import { VerifyEmailForm } from './components/auth/VerifyEmailForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import Dashboard from './components/dashboard/Dashboard';
import Objects from './components/objects/Objects';
import Tasks from './components/tasks/Tasks';
import Profile from './components/profile/Profile';
import Admin from './components/admin/Admin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ObjectDetails from './components/objects/ObjectDetails';
import TaskDetailsPage from './components/tasks/TaskDetailsPage';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Здесь в реальном приложении нужно получать статус админа и информацию о пользователе из контекста или хранилища
  const isAdmin = false; // Временное значение для демонстрации
  const userName = "Иван Иванов"; // Временное значение для демонстрации
  const userRole = isAdmin ? "Администратор" : "Пользователь";

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isAdmin} userName={userName} userRole={userRole} />
      <div className="flex-1 ml-[280px]">
        {children}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* Публичные маршруты */}
          <Route path="/login" element={<AuthCard />} />
          <Route path="/register" element={<AuthCard />} />
          <Route path="/verify-email" element={<VerifyEmailForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          
          {/* Защищенные маршруты */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/objects"
            element={
              <ProtectedRoute>
                <Layout>
                  <Objects />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/objects/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <ObjectDetails />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Layout>
                  <Tasks />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <TaskDetailsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <Admin />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Редирект для несуществующих маршрутов */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
