import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import UserHeader from '@/components/layout/UserHeader';
import Link from 'next/link';

const UserDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user && user.role !== UserRole.USER) {
        router.push('/admin/dashboard');
      }
    }
  }, [isAuthenticated, loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== UserRole.USER) {
    return null;
  }

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Bienvenida */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-2xl">
                    {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    ¡Bienvenido, {user.firstName}!
                  </h1>
                  <p className="text-gray-600">Descubre tu próxima lectura favorita</p>
                </div>
              </div>
            </div>

            {/* Accesos rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Link
                href="/catalog"
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-blue-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Explorar Catálogo</h3>
                  <p className="text-sm text-gray-600">Descubre miles de libros</p>
                </div>
              </Link>

              <Link
                href="/user/cart"
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-purple-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5-1.5m11.5 1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Mi Carrito</h3>
                  <p className="text-sm text-gray-600">0 productos</p>
                </div>
              </Link>

              <Link
                href="/user/chat"
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200 border border-gray-200 hover:border-green-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Chat</h3>
                  <p className="text-sm text-gray-600">Iniciar conversación</p>
                </div>
              </Link>
            </div>

            {/* Sección de recomendaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Libros recomendados */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    Recomendados para ti
                  </h2>
                  <div className="text-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-lg mb-2">¡Descubre tu próxima lectura!</p>
                    <p className="text-sm mb-4">Explora nuestro catálogo para encontrar recomendaciones personalizadas</p>
                    <Link
                      href="/catalog"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Explorar Catálogo
                    </Link>
                  </div>
                </div>
              </div>

              {/* Panel lateral */}
              <div className="space-y-6">
                {/* Resumen de actividad */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Cuenta</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Libros favoritos</span>
                      <span className="font-semibold text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">En carrito</span>
                      <span className="font-semibold text-gray-900">0</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Mensajes de chat</span>
                      <span className="font-semibold text-gray-900">0</span>
                    </div>
                  </div>
                </div>

                {/* Ofertas especiales */}
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow-sm p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">🎉 Oferta Especial</h3>
                  <p className="text-primary-100 text-sm mb-4">
                    Descubre nuevos mundos con un 20% de descuento en tu primera compra
                  </p>
                  <Link
                    href="/catalog"
                    className="inline-flex items-center px-4 py-2 bg-white text-primary-600 rounded-md hover:bg-primary-50 transition-colors text-sm font-medium"
                  >
                    Ver Ofertas
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
