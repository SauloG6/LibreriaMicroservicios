import React, { useState, useEffect } from 'react';
import { productsService } from '../services/products';

const TestAPI: React.FC = () => {
  const [books, setBooks] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔍 Testing API connection...');
        
        // Test books endpoint
        console.log('📚 Fetching books...');
        const booksResponse = await productsService.getBooks();
        console.log('📚 Books response:', booksResponse);
        setBooks(booksResponse);

        setLoading(false);
      } catch (err: any) {
        console.error('❌ API Error:', err);
        console.error('❌ Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          statusText: err.response?.statusText
        });
        setError(err.message);
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return <div className="p-4">🔄 Testing API connection...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧪 API Test Results</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {/* Books */}
        <div className="bg-gray-50 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">📚 Books Response</h2>
          <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-96">
            {JSON.stringify(books, null, 2)}
          </pre>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">📊 Summary</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Books loaded: {books ? '✅ Yes' : '❌ No'}</li>
          <li>Books count: {Array.isArray(books?.books) ? books.books.length : 'N/A'}</li>
        </ul>
      </div>
    </div>
  );
};

export default TestAPI;
