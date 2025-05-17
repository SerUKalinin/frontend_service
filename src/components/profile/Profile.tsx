import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import PageLayout from '../layout/PageLayout';
import Input from '../common/Input';
import Button from '../common/Button';
import { userService, User } from '../../services/userService';

interface ProfileFormData {
  firstName: string;
  lastName: string;
}

const schema = yup.object({
  firstName: yup.string()
    .required('Введите имя')
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя должно содержать максимум 50 символов'),
  lastName: yup.string()
    .required('Введите фамилию')
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .max(50, 'Фамилия должна содержать максимум 50 символов')
}).required();

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileFormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
        reset({
          firstName: userData.firstName,
          lastName: userData.lastName
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Ошибка при загрузке данных пользователя');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (!user) return;
      
      const updatedUser = await userService.updateUser(user.id, data);
      setUser(updatedUser);
      toast.success('Профиль успешно обновлен');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка при обновлении профиля');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Профиль</h1>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Редактирование профиля</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              id="firstName"
              label="Имя"
              type="text"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              id="lastName"
              label="Фамилия"
              type="text"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile; 