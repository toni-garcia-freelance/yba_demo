export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
} 