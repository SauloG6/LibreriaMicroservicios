import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto, AuthResponseDto } from './dto/auth.dto';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (user && await user.validatePassword(password)) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return this.generateTokenResponse(user);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.CLIENT, // Los nuevos usuarios siempre son clientes
    });

    const { password: _, ...userWithoutPassword } = user;
    return this.generateTokenResponse(userWithoutPassword);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      return { message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await this.usersService.updateResetPasswordToken(user.id, resetToken, resetExpires);

    // Aquí deberías enviar el email con el token
    // Para este ejemplo, devolvemos el token (en producción NO hacer esto)
    console.log(`Reset token for ${user.email}: ${resetToken}`);

    return { message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(resetPasswordDto.token);
    
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    await this.usersService.updatePassword(user.id, resetPasswordDto.newPassword);

    return { message: 'Contraseña actualizada exitosamente' };
  }

  async getProfile(userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  private generateTokenResponse(user: any): AuthResponseDto {
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    const access_token = this.jwtService.sign(payload);
    const expires_in = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

    return {
      access_token,
      token_type: 'Bearer',
      expires_in,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName || `${user.firstName} ${user.lastName}`,
        role: user.role,
      },
    };
  }
}
