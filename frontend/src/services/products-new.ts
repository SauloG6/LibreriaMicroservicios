import axios from 'axios';
import { Book, Category, BooksResponse, BookFilters, CreateBookDto, UpdateBookDto, CreateCategoryDto, UpdateCategoryDto } from '../types/products';

const PRODUCT_SERVICE_URL = process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL: `${PRODUCT_SERVICE_URL}/api`,
  timeout: 10000,
});

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const productsService = {
  // Books
  async getBooks(filters?: BookFilters): Promise<BooksResponse> {
    const response = await api.get('/books', { params: filters });
    // El backend devuelve un objeto con books array
    if (response.data && response.data.books) {
      return response.data;
    }
    // Si el backend devuelve un array directamente, lo envolvemos
    return {
      books: Array.isArray(response.data) ? response.data : [],
      total: Array.isArray(response.data) ? response.data.length : 0,
      page: 1,
      limit: 50,
      totalPages: 1
    };
  },

  async getBookById(id: string): Promise<Book> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async getBooksByCategory(categoryId: string, filters?: Omit<BookFilters, 'categoryId'>): Promise<BooksResponse> {
    const response = await api.get('/books', { 
      params: { ...filters, categoryId } 
    });
    // El backend devuelve un objeto con books array
    if (response.data && response.data.books) {
      return response.data;
    }
    // Si el backend devuelve un array directamente, lo envolvemos
    return {
      books: Array.isArray(response.data) ? response.data : [],
      total: Array.isArray(response.data) ? response.data.length : 0,
      page: 1,
      limit: 50,
      totalPages: 1
    };
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await api.get('/categories');
    return Array.isArray(response.data) ? response.data : [];
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
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

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category> {
    const response = await api.patch(`/categories/${id}`, categoryData);
    return response.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

export default productsService;
