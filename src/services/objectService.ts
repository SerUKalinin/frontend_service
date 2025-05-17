import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true
});

export interface RealEstateObject {
  id: number;
  name: string;
  objectType: string;
  parentId?: number;
  createdAt: string;
  createdById: number;
  createdByFirstName: string;
  createdByLastName: string;
}

class ObjectService {
  private getAuthHeader() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn('No authentication token found');
      return {};
    }
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  async getAllObjects(): Promise<RealEstateObject[]> {
    try {
      const headers = this.getAuthHeader();
      console.log('Making request with headers:', headers);
      
      const response = await api.get<RealEstateObject[]>('/real-estate-objects', {
        headers
      });
      
      console.log('Response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Detailed error:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        headers: error?.response?.headers
      });

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        console.log('Unauthorized or forbidden access, redirecting to login');
        localStorage.removeItem('jwtToken');
        window.location.href = '/login';
      }
      
      throw new Error(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to fetch objects'
      );
    }
  }
}

export const objectService = new ObjectService(); 