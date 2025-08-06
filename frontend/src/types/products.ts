// Types for the Product Service

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number | string;
  stock: number;
  publisher?: string;
  publishedDate?: string;
  language?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BookFilters {
  page?: number;
  limit?: number;
  author?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'OUT_OF_STOCK';
  sortBy?: 'title' | 'price' | 'rating' | 'publishedDate' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface CreateBookDto {
  title: string;
  author: string;
  isbn: string;
  description?: string;
  price: number;
  stock: number;
  publisher?: string;
  publishedDate?: string;
  language?: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
