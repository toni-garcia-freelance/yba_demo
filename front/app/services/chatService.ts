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

export const sendChatMessage = async (message: string): Promise<Task[]> => {
  try {
    const config = await getAuthHeader();
    const response = await axios.post<Task[]>(
      `${API_URL}/chat/message`,
      { message },
      config
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to process chat message');
  }
};
