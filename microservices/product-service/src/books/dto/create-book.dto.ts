import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsInt,
  Min,
  Max,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
  IsDecimal,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookStatus } from '../entities/book.entity';

export class CreateBookDto {
  @ApiProperty({
    description: 'Título del libro',
    example: 'Cien años de soledad'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Autor del libro',
    example: 'Gabriel García Márquez'
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @ApiProperty({
    description: 'Código ISBN del libro',
    example: '978-84-376-0494-7'
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(20)
  isbn: string;

  @ApiPropertyOptional({
    description: 'Descripción del libro',
    example: 'Una obra maestra de la literatura latinoamericana que narra la historia de la familia Buendía.'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Precio del libro',
    example: 25.99
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Stock disponible',
    example: 50,
    default: 0
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiPropertyOptional({
    description: 'Editorial del libro',
    example: 'Editorial Sudamericana'
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  publisher?: string;

  @ApiPropertyOptional({
    description: 'Fecha de publicación',
    example: '1967-05-30'
  })
  @IsOptional()
  @IsDateString()
  publishedDate?: Date;

  @ApiPropertyOptional({
    description: 'Idioma del libro',
    example: 'Español',
    default: 'Español'
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;

  @ApiPropertyOptional({
    description: 'Estado del libro',
    enum: BookStatus,
    example: BookStatus.ACTIVE,
    default: BookStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(BookStatus)
  status?: BookStatus;
}
