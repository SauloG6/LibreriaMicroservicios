import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, LoginData, RegisterData, ForgotPasswordData, ResetPasswordData, User } from '@/types/auth';
import { getToken, removeToken } from '@/utils/auth';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    // Para desarrollo rápido, usar directamente localhost desde el navegador
    const baseURL = typeof window !== 'undefined' 
      ? 'http://localhost:3001' // Navegador: usar localhost
      : 'http://auth-service:3001'; // Servidor: usar nombre del servicio

    this.api = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token automáticamente
    this.api.interceptors.request.use(
      (config) => {
        const token = getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de autenticación
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          removeToken();
          // Redirigir al login si estamos en el cliente
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/api/auth/login', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/api/auth/register', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    try {
      const response = await this.api.post('/api/auth/forgot-password', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    try {
      const response = await this.api.post('/api/auth/reset-password', data);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get('/api/auth/profile');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await this.api.post('/api/auth/refresh', { refresh_token: refreshToken });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async logout(): Promise<{ message: string }> {
    try {
      const response = await this.api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.message || 'Error desconocido';
      return new Error(message);
    }
    return error;
  }
}

export const authService = new AuthService();
