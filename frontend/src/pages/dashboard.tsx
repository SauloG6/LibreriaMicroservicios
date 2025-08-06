import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const DashboardPage = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user) {
        // Redirigir según el rol
        if (user.role === UserRole.ADMIN) {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/dashboard');
        }
      }
    }
  }, [isAuthenticated, loading, user, router]);

  // Mostrar loading mientras se determina la redirección
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
