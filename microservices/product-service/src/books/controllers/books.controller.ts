import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { BooksService, PaginatedBooks } from '../services/books.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { FilterBooksDto } from '../dto/filter-books.dto';
import { Book } from '../entities/book.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Libros')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Crear nuevo libro' })
  @ApiResponse({ status: 201, description: 'Libro creado exitosamente', type: Book })
  @ApiResponse({ status: 409, description: 'Ya existe un libro con ese ISBN' })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return await this.booksService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener libros con filtros y paginación' })
  @ApiResponse({ status: 200, description: 'Lista paginada de libros' })
  async findAll(@Query() filterDto: FilterBooksDto): Promise<PaginatedBooks> {
    return await this.booksService.findAll(filterDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar libros por texto' })
  @ApiQuery({ name: 'q', description: 'Texto de búsqueda' })
  @ApiQuery({ name: 'limit', description: 'Límite de resultados', required: false })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: [Book] })
  async search(
    @Query('q') query: string,
    @Query('limit') limitStr: string = '20',
  ): Promise<Book[]> {
    const limit = parseInt(limitStr, 10) || 20;
    return await this.booksService.searchBooks(query, limit);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Obtener libros destacados' })
  @ApiQuery({ name: 'limit', description: 'Límite de resultados', required: false })
  @ApiResponse({ status: 200, description: 'Libros destacados', type: [Book] })
  async getFeatured(@Query('limit') limitStr: string = '8'): Promise<Book[]> {
    const limit = parseInt(limitStr, 10) || 8;
    return await this.booksService.getFeaturedBooks(limit);
  }

  @Get('isbn/:isbn')
  @ApiOperation({ summary: 'Obtener libro por ISBN' })
  @ApiParam({ name: 'isbn', description: 'ISBN del libro' })
  @ApiResponse({ status: 200, description: 'Libro encontrado', type: Book })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async findByIsbn(@Param('isbn') isbn: string): Promise<Book> {
    return await this.booksService.findByIsbn(isbn);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener libro por ID' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'Libro encontrado', type: Book })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Book> {
    return await this.booksService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar libro' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'Libro actualizado', type: Book })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return await this.booksService.update(id, updateBookDto);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar stock del libro' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'Stock actualizado', type: Book })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity') quantity: number,
  ): Promise<Book> {
    return await this.booksService.updateStock(id, quantity);
  }

  @Patch(':id/rating')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Actualizar rating del libro' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'Rating actualizado', type: Book })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async updateRating(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('rating') rating: number,
  ): Promise<Book> {
    return await this.booksService.updateRating(id, rating);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMINISTRADOR')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Eliminar libro' })
  @ApiParam({ name: 'id', description: 'ID del libro' })
  @ApiResponse({ status: 200, description: 'Libro eliminado' })
  @ApiResponse({ status: 404, description: 'Libro no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.booksService.remove(id);
  }
}
