import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';
const TOKEN_KEY = '@auth_token';

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, data);
    this.setAuthToken(response.data.token);
    return response.data;
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, data);
    this.setAuthToken(response.data.token);
    return response.data;
  },

  setAuthToken(token: string): void {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeAuthToken(): void {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem(TOKEN_KEY);
  },

  loadStoredToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      this.setAuthToken(token);
    }
    return token;
  },

  isAuthenticated(): boolean {
    const token = this.loadStoredToken();
    return !!token;
  },
}; 