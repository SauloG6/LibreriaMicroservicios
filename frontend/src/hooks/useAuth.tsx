import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, AuthResponse, LoginData, RegisterData } from '@/types/auth';
import { authService } from '@/services/authService';
import { getUser, setUser, setToken, removeToken, isAuthenticated } from '@/utils/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = getUser();
        if (storedUser && isAuthenticated()) {
          // Verificar que el token siga siendo válido
          const profileData = await authService.getProfile();
          setUserState(profileData);
          setUser(profileData);
        } else {
          removeToken();
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        removeToken();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (data: LoginData) => {
    setLoading(true);
    try {
      const response: AuthResponse = await authService.login(data);
      
      setToken(response.access_token);
      setUser(response.user as User);
      setUserState(response.user as User);
      
      toast.success(`¡Bienvenido, ${response.user.firstName}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesión';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    try {
      const response: AuthResponse = await authService.register(data);
      
      setToken(response.access_token);
      setUser(response.user as User);
      setUserState(response.user as User);
      
      toast.success(`¡Registro exitoso! Bienvenido, ${response.user.firstName}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al registrarse';
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUserState(null);
    toast.success('Sesión cerrada exitosamente');
    
    // Redirigir al login
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const updateUser = (newUser: User) => {
    setUserState(newUser);
    setUser(newUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
