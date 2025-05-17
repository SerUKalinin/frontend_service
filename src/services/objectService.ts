import axios from 'axios';
import { Object } from '../components/objects/types';

// Настройка базового URL для axios
axios.defaults.baseURL = 'http://localhost:8080';

class ObjectService {
  private getAuthHeader() {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      console.warn('No authentication token found');
      return {};
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  private handleAuthError(error: any) {
    if (error?.response?.status === 401 || error?.response?.status === 403) {
      console.log('Unauthorized or forbidden access, redirecting to login');
      localStorage.removeItem('jwtToken');
      window.location.href = '/login';
    }
    throw error;
  }

  async getAllObjects(): Promise<Object[]> {
    try {
      const response = await axios.get<Object[]>('/real-estate-objects', {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching objects:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  async getObjectById(id: number): Promise<Object> {
    try {
      const response = await axios.get<Object>(`/real-estate-objects/${id}`, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching object:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  async createObject(object: Partial<Object>): Promise<Object> {
    try {
      const response = await axios.post<Object>('/real-estate-objects', object, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error creating object:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  async updateObject(id: number, object: Partial<Object>): Promise<Object> {
    try {
      const response = await axios.put<Object>(`/real-estate-objects/${id}`, object, {
        headers: this.getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error updating object:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  async deleteObject(id: number): Promise<void> {
    try {
      await axios.delete(`/real-estate-objects/${id}`, {
        headers: this.getAuthHeader()
      });
    } catch (error) {
      console.error('Error deleting object:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  async assignResponsibleUser(objectId: number, userId: number): Promise<Object> {
    try {
      const response = await axios.put<Object>(
        `/real-estate-objects/${objectId}/assign-responsible/${userId}`,
        {},
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning responsible user:', error);
      this.handleAuthError(error);
      throw error;
    }
  }

  async removeResponsibleUser(objectId: number): Promise<Object> {
    try {
      const response = await axios.put<Object>(
        `/real-estate-objects/${objectId}/remove-responsible`,
        {},
        { headers: this.getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error('Error removing responsible user:', error);
      this.handleAuthError(error);
      throw error;
    }
  }
}

export const objectService = new ObjectService(); 