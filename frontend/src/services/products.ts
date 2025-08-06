import axios from 'axios';
import { Book, BooksResponse, BookFilters, CreateBookDto, UpdateBookDto } from '../types/products';
import { getToken } from '@/utils/auth';

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL: `${PRODUCT_SERVICE_URL}/api`,
  timeout: 10000,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = getToken(); // Usar la función de auth.ts que maneja cookies
  console.log('🔐 Token found:', !!token);
  if (token) {
    console.log('🎫 Token preview:', token.substring(0, 50) + '...');
  }
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('🔑 Authorization header set');
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.method?.toUpperCase(), response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data, error.config?.method?.toUpperCase(), error.config?.url);
    return Promise.reject(error);
  }
);

export const productsService = {
  // Books
  async getBooks(filters?: BookFilters): Promise<BooksResponse> {
    const response = await api.get('/books', { params: filters });
    // El backend devuelve un objeto con books array
    return response.data;
  },

  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async createBook(bookData: CreateBookDto): Promise<Book> {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  async updateBook(id: string, bookData: UpdateBookDto): Promise<Book> {
    const response = await api.patch(`/books/${id}`, bookData);
    return response.data;
  },

  async deleteBook(id: string): Promise<void> {
    await api.delete(`/books/${id}`);
  },
};

export default productsService;
