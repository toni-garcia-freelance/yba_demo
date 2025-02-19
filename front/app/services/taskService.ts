import axios from 'axios';
import { Task } from '../interfaces/Task';

const API_URL = 'http://localhost:5000/api';

export const taskService = {
  async getTasks(): Promise<Task[]> {
    const response = await axios.get(`${API_URL}/tasks/`);
    return response.data;
  },
}; 