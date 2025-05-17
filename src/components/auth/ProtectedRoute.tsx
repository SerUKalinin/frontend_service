import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    let isMounted = true;

    const validateToken = async () => {
      try {
        // Проверяем наличие токена перед валидацией
        if (!localStorage.getItem('jwtToken')) {
          if (isMounted) {
            setIsAuthenticated(false);
            setIsValidating(false);
          }
          return;
        }

        const isValid = await authService.validateToken();
        if (isMounted) {
          setIsAuthenticated(isValid);
          if (!isValid) {
            // Очищаем токены только если они невалидны
            await authService.logout();
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          await authService.logout();
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    validateToken();

    // Очистка при размонтировании
    return () => {
      isMounted = false;
    };
  }, []);

  if (isValidating) {
    // Можно добавить компонент загрузки
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 