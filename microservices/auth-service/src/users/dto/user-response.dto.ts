import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid-string', description: 'ID único del usuario' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'usuario@ejemplo.com', description: 'Email del usuario' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'Juan', description: 'Nombre del usuario' })
  @Expose()
  firstName: string;

  @ApiProperty({ example: 'Pérez', description: 'Apellido del usuario' })
  @Expose()
  lastName: string;

  @ApiProperty({ example: UserRole.CLIENT, description: 'Rol del usuario' })
  @Expose()
  role: UserRole;

  @ApiProperty({ example: true, description: 'Si el usuario está activo' })
  @Expose()
  isActive: boolean;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de creación' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2023-01-01T00:00:00.000Z', description: 'Fecha de actualización' })
  @Expose()
  updatedAt: Date;
}
