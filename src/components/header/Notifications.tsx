import React, { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: number;
  message: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      message: 'Новая задача создана',
      time: '5 минут назад',
      read: false
    },
    {
      id: 2,
      message: 'Объект обновлен',
      time: '1 час назад',
      read: false
    },
    {
      id: 3,
      message: 'Новое сообщение',
      time: '2 часа назад',
      read: false
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600 hover:text-gray-900 focus:outline-none relative"
      >
        <BellIcon className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-[var(--warning)] rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900">Уведомления</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
              >
                <p className="text-sm text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
          {notifications.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Нет новых уведомлений
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications; 