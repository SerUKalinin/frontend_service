import axios from 'axios';

// Настройка базового URL для axios
axios.defaults.baseURL = 'http://localhost:8080';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string;
  active: boolean;
}

class UserService {
  private getAuthHeader() {
    const token = localStorage.getItem('jwtToken');
    console.log('Current JWT token:', token);
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getCurrentUser(): Promise<User> {
    try {
      console.log('Fetching current user...');
      const headers = this.getAuthHeader();
      console.log('Request headers:', headers);
      
      const response = await axios.get<User>('/users/info', { headers });
      console.log('User data received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: any; status?: number } };
        console.error('Response data:', axiosError.response?.data);
        console.error('Response status:', axiosError.response?.status);
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const response = await axios.get<User[]>('/users/info/all', {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all users:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await axios.get<User>(`/users/info/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user by id:', error);
      throw error;
    }
  }

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    try {
      const response = await axios.put<User>(`/users/${userId}`, userData, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}

export const userService = new UserService(); 