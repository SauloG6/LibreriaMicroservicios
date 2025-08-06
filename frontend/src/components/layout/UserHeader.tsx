import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

const UserHeader = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            <Link href="/user/dashboard" className="text-xl font-bold text-primary-600">
              📚 Librería
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/user/dashboard"
                className={`text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/user/dashboard' ? 'text-primary-600 bg-primary-50' : ''
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/catalog"
                className={`text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/catalog' ? 'text-primary-600 bg-primary-50' : ''
                }`}
              >
                Catálogo
              </Link>
            </nav>
          </div>

          {/* Información del usuario */}
          <div className="flex items-center space-x-4">
            {/* Carrito de compras */}
            <Link
              href="/user/cart"
              className="relative p-2 text-gray-600 hover:text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13l-1.5-1.5m11.5 1.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 0a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
              </svg>
              {/* Badge del carrito */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 p-2 rounded-md"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-semibold text-sm">
                    {user?.firstName.charAt(0)}{user?.lastName.charAt(0)}
                  </span>
                </div>
                <span className="hidden md:block text-sm font-medium">
                  {user?.firstName}
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown del usuario */}
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {user?.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menú móvil toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navegación móvil */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <Link
              href="/user/dashboard"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/catalog"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default UserHeader;
