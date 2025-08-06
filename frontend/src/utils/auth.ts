import Cookies from 'js-cookie';
import { User, UserRole } from '@/types/auth';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    Cookies.set(TOKEN_KEY, token, { 
      expires: 1, // 1 día
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return Cookies.get(TOKEN_KEY) || null;
  }
  return null;
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  }
};

export const setUser = (user: User): void => {
  if (typeof window !== 'undefined') {
    Cookies.set(USER_KEY, JSON.stringify(user), { 
      expires: 1, // 1 día
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
  }
};

export const getUser = (): User | null => {
  if (typeof window !== 'undefined') {
    const userStr = Cookies.get(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user data:', error);
        removeToken();
        return null;
      }
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const hasRole = (role: UserRole): boolean => {
  const user = getUser();
  return user?.role === role;
};

export const isAdmin = (): boolean => {
  return hasRole(UserRole.ADMIN);
};

export const isUser = (): boolean => {
  return hasRole(UserRole.USER);
};

export const logout = (): void => {
  removeToken();
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login';
  }
};

export const redirectAfterLogin = (userRole: UserRole): string => {
  switch (userRole) {
    case UserRole.ADMIN:
      return '/admin/books';
    case UserRole.USER:
      return '/user/dashboard';
    default:
      return '/';
  }
};
