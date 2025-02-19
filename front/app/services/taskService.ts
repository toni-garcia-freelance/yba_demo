import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../interfaces/Task';

const API_URL = 'http://localhost:5000/api';

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getTasks = async (): Promise<Task[]> => {
  try {
    const config = await getAuthHeader();
    const response = await axios.get<Task[]>(`${API_URL}/tasks`, config);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
};

export const getTask = async (id: number): Promise<Task> => {
  try {
    const config = await getAuthHeader();
    const response = await axios.get<Task>(`${API_URL}/tasks/${id}`, config);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch task');
  }
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
  try {
    const config = await getAuthHeader();
    const response = await axios.post<Task>(`${API_URL}/tasks`, task, config);
    return response.data;
  } catch (error) {
    throw new Error('Failed to create task');
  }
};

export const updateTask = async (id: number, task: Partial<Task>): Promise<Task> => {
  try {
    const config = await getAuthHeader();
    const response = await axios.put<Task>(`${API_URL}/tasks/${id}`, task, config);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update task');
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    const config = await getAuthHeader();
    await axios.delete(`${API_URL}/tasks/${id}`, config);
  } catch (error) {
    throw new Error('Failed to delete task');
  }
}; 