import React, { useState, useEffect } from 'react';
import { Book } from '../types/products';
import { productsService } from '../services/products';
import { useAuth } from '../hooks/useAuth';
import UserHeader from '../components/layout/UserHeader';
import PublicHeader from '../components/layout/PublicHeader';

// Helper function to format price
const formatPrice = (price: number | string): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
};

const CatalogPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksResponse = await productsService.getBooks();
      setBooks(booksResponse.books || []);
    } catch (err) {
      setError('Error al cargar los libros');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={loadBooks}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? <UserHeader /> : <PublicHeader />}
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Catálogo de Libros</h1>
            <p className="text-gray-600">Explora nuestra colección de libros</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 gap-4">
              {/* Search */}
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar libros
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por título o autor..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-6">
            <p className="text-gray-600">
              Mostrando {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron libros</p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-700 underline"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 mb-2">por {book.author}</p>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-3">{book.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${formatPrice(book.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Stock: {book.stock}
                        </p>
                      </div>
                      {isAuthenticated ? (
                        <button
                          disabled={book.stock === 0}
                          className={`px-4 py-2 rounded-md font-medium transition-colors ${
                            book.stock === 0
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600 text-white'
                          }`}
                        >
                          {book.stock === 0 ? 'Sin stock' : 'Añadir al carrito'}
                        </button>
                      ) : (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 mb-2">
                            Para comprar
                          </p>
                          <div className="flex flex-col gap-2">
                            <a
                              href="/auth/login"
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                            >
                              Iniciar Sesión
                            </a>
                            <a
                              href="/auth/register"
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded-md transition-colors"
                            >
                              Crear Cuenta
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogPage;
