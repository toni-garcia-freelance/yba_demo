import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RegisterData } from '../interfaces/RegisterData';
import { LoginData } from '../interfaces/LoginData';
import { AuthResponse } from '../interfaces/AuthResponse';

const API_URL = 'http://localhost:5000/api/auth';

export const isLoggedIn = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    return false;
  }
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, data);
    const authResponse = response.data;

    await AsyncStorage.setItem('authToken', authResponse.token);

    return authResponse;
  } catch (error) {
    throw new Error('Failed to register');
  }
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, data);
    const authResponse = response.data;

    await AsyncStorage.setItem('authToken', authResponse.token);

    return authResponse;
  } catch (error) {
    throw new Error('Failed to login');
  }
};