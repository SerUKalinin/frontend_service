import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { userService, User } from '../services/userService';
import {
  HomeIcon,
  BuildingOfficeIcon,
  ClipboardDocumentListIcon,
  UserIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
  isAdmin: boolean;
  userName?: string;
  userRole?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin, userName = 'Пользователь', userRole = 'Пользователь' }) => {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const userData = await userService.getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const navigation = [
    { name: 'Главная', href: '/', icon: HomeIcon },
    { name: 'Объекты', href: '/objects', icon: BuildingOfficeIcon },
    { name: 'Задачи', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Профиль', href: '/profile', icon: UserIcon },
  ];

  if (isAdmin) {
    navigation.push({ name: 'Пользователи', href: '/admin', icon: UsersIcon });
  }

  // Получаем инициалы пользователя
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Функция для отображения роли на русском языке
  const getRoleLabel = (role: string | undefined) => {
    if (!role) return '';
    if (role.includes('ADMIN')) return 'Администратор';
    if (role.includes('USER')) return 'Пользователь';
    if (role.includes('MANAGER')) return 'Менеджер';
    return role;
  };

  return (
    <aside className="fixed top-0 left-0 w-[280px] h-screen bg-[var(--sidebar-bg)] text-white p-8 flex flex-col shadow-[2px_0_10px_rgba(0,0,0,0.1)] transition-all duration-300 z-50">
      {/* Шапка сайдбара */}
      <div className="flex items-center mb-8">
        <BuildingOfficeIcon className="h-8 w-8 text-white mr-3" />
        <h2 className="text-xl font-bold">RealEstate PRO</h2>
      </div>

      {/* Навигационное меню */}
      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'bg-[var(--primary)] text-white'
                  : 'text-gray-300 hover:bg-[var(--primary)]/10 hover:text-white'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                }`}
                aria-hidden="true"
              />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Профиль пользователя */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-medium">
              {loading ? '...' : getInitials(user?.firstName + ' ' + user?.lastName || userName)}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">
              {loading ? 'Загрузка...' : user ? `${user.firstName} ${user.lastName}` : userName}
            </p>
            <p className="text-xs text-gray-400">
              {loading ? '...' : getRoleLabel(user?.roles || userRole)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 