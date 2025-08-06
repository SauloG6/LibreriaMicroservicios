import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, MoreThan } from 'typeorm';
import { Book, BookStatus } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { FilterBooksDto } from '../dto/filter-books.dto';

export interface PaginatedBooks {
  books: Book[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const { isbn, ...rest } = createBookDto;

    // Verificar que el ISBN no existe
    const existingBook = await this.booksRepository.findOne({
      where: { isbn },
    });

    if (existingBook) {
      throw new ConflictException(`Ya existe un libro con ISBN ${isbn}`);
    }

    const book = this.booksRepository.create({
      ...rest,
      isbn,
    });

    return await this.booksRepository.save(book);
  }

  async findAll(filterDto: FilterBooksDto): Promise<PaginatedBooks> {
    const queryBuilder = this.booksRepository
      .createQueryBuilder('book');

    // Aplicar filtros
    this.applyFilters(queryBuilder, filterDto);
    
    // Aplicar ordenamiento
    this.applySorting(queryBuilder, filterDto);

    // Aplicar paginación
    const { page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;
    
    queryBuilder.skip(skip).take(limit);

    const [books, total] = await queryBuilder.getManyAndCount();

    return {
      books,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }

    return book;
  }

  async findByIsbn(isbn: string): Promise<Book> {
    const book = await this.booksRepository.findOne({
      where: { isbn },
    });

    if (!book) {
      throw new NotFoundException(`Libro con ISBN ${isbn} no encontrado`);
    }

    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.findOne(id);

    // Si se está actualizando el ISBN, verificar que no existe
    if (updateBookDto.isbn && updateBookDto.isbn !== book.isbn) {
      const existingBook = await this.booksRepository.findOne({
        where: { isbn: updateBookDto.isbn },
      });

      if (existingBook) {
        throw new ConflictException(`Ya existe un libro con ISBN ${updateBookDto.isbn}`);
      }
    }

    Object.assign(book, updateBookDto);
    return await this.booksRepository.save(book);
  }

  async remove(id: string): Promise<void> {
    const book = await this.findOne(id);
    await this.booksRepository.remove(book);
  }

  async updateStock(id: string, quantity: number): Promise<Book> {
    const book = await this.findOne(id);
    
    if (book.stock + quantity < 0) {
      throw new ConflictException('No hay suficiente stock disponible');
    }

    book.stock += quantity;
    
    // Actualizar estado según el stock
    if (book.stock === 0) {
      book.status = BookStatus.OUT_OF_STOCK;
    } else if (book.status === BookStatus.OUT_OF_STOCK) {
      book.status = BookStatus.ACTIVE;
    }

    return await this.booksRepository.save(book);
  }

  async updateRating(id: string, rating: number, increment: boolean = true): Promise<Book> {
    const book = await this.findOne(id);
    
    if (increment) {
      const totalRating = book.rating * book.reviewCount + rating;
      book.reviewCount += 1;
      book.rating = Math.round((totalRating / book.reviewCount) * 100) / 100;
    } else {
      book.rating = rating;
    }

    return await this.booksRepository.save(book);
  }

  async getFeaturedBooks(limit: number = 8): Promise<Book[]> {
    const numericLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    return await this.booksRepository.find({
      where: { 
        status: BookStatus.ACTIVE,
        stock: MoreThan(0),
      },
      take: numericLimit,
      order: { rating: 'DESC', reviewCount: 'DESC' },
    });
  }

  async searchBooks(query: string, limit: number = 20): Promise<Book[]> {
    const numericLimit = typeof limit === 'string' ? parseInt(limit, 10) : limit;
    return await this.booksRepository
      .createQueryBuilder('book')
      .where('book.title ILIKE :query OR book.author ILIKE :query OR book.description ILIKE :query', 
        { query: `%${query}%` })
      .andWhere('book.status = :status', { status: BookStatus.ACTIVE })
      .take(numericLimit)
      .orderBy('book.rating', 'DESC')
      .getMany();
  }

  private applyFilters(queryBuilder: SelectQueryBuilder<Book>, filters: FilterBooksDto): void {
    const { 
      search, 
      minPrice, 
      maxPrice, 
      author, 
      publisher, 
      language, 
      status, 
      minRating,
      inStock 
    } = filters;

    if (search) {
      queryBuilder.andWhere(
        '(book.title ILIKE :search OR book.author ILIKE :search OR book.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere('book.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere('book.price <= :maxPrice', { maxPrice });
    }

    if (author) {
      queryBuilder.andWhere('book.author ILIKE :author', { author: `%${author}%` });
    }

    if (publisher) {
      queryBuilder.andWhere('book.publisher ILIKE :publisher', { publisher: `%${publisher}%` });
    }

    if (language) {
      queryBuilder.andWhere('book.language ILIKE :language', { language: `%${language}%` });
    }

    if (status) {
      queryBuilder.andWhere('book.status = :status', { status });
    } else {
      // Por defecto, solo mostrar libros activos
      queryBuilder.andWhere('book.status = :defaultStatus', { defaultStatus: BookStatus.ACTIVE });
    }

    if (minRating !== undefined) {
      queryBuilder.andWhere('book.rating >= :minRating', { minRating });
    }

    if (inStock) {
      queryBuilder.andWhere('book.stock > 0');
    }
  }

  private applySorting(queryBuilder: SelectQueryBuilder<Book>, filters: FilterBooksDto): void {
    const { sortBy = 'createdAt', sortOrder = 'DESC' } = filters;

    const validSortFields = ['title', 'author', 'price', 'rating', 'createdAt', 'stock'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    
    queryBuilder.orderBy(`book.${field}`, sortOrder);
  }
}
