import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const PublicHeader = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo y navegación principal */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-primary-600">
              📚 Librería
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className={`text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium ${
                  router.pathname === '/' ? 'text-primary-600 bg-primary-50' : ''
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

          {/* Botones de autenticación */}
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Crear Cuenta
            </Link>

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
              href="/"
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
            <Link
              href="/auth/login"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="block px-4 py-2 text-primary-600 hover:bg-gray-100 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Crear Cuenta
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
