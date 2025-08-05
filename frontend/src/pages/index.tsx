import { useAuth } from '@/hooks/useAuth';
import { LoadingPage } from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { UserRole } from '@/types/auth';

const HomePage = () => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingPage text="Cargando aplicación..." />;
  }

  return (
    <div className="page-content">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center py-16">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-3xl">L</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-primary-600">Librería</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tu plataforma digital para gestionar productos, facturas y mantener 
            comunicación en tiempo real con tus clientes.
          </p>

          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
                Comenzar ahora
              </Link>
              <Link href="/auth/login" className="btn-outline text-lg px-8 py-3">
                Iniciar sesión
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                ¡Hola, {user?.firstName}!
              </h2>
              <p className="text-gray-600 mb-6">
                Rol: <span className="font-medium">{user?.role}</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user?.role === UserRole.ADMIN ? (
                  <Link href="/admin/dashboard" className="btn-primary text-lg px-8 py-3">
                    Panel de Administración
                  </Link>
                ) : (
                  <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                    Mi Dashboard
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="py-16 border-t border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Funcionalidades principales
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Gestión de Productos</h3>
              <p className="text-gray-600">
                Administra tu catálogo de libros y productos de manera eficiente.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Facturación</h3>
              <p className="text-gray-600">
                Genera facturas automáticamente y lleva control de tus ventas.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat en Tiempo Real</h3>
              <p className="text-gray-600">
                Comunícate instantáneamente con tus clientes y equipo.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguridad Avanzada</h3>
              <p className="text-gray-600">
                Autenticación JWT y roles de usuario para máxima seguridad.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!isAuthenticated && (
          <div className="bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white my-16">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a nuestra plataforma y transforma la gestión de tu librería.
            </p>
            <Link href="/auth/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Crear cuenta gratis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
