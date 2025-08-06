import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/user-role.enum';

@Injectable()
export class DatabaseSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
  }

  private async seedUsers() {
    // Verificar si ya existen usuarios seed
    const existingUsers = await this.userRepository.count();
    
    if (existingUsers === 0) {
      console.log('🌱 Seeding users...');
      
      const usersToSeed = [
        {
          email: 'admin@libreria.com',
          firstName: 'Admin',
          lastName: 'Sistema',
          password: 'admin123',
          role: UserRole.ADMIN,
        },
        {
          email: 'user@libreria.com',
          firstName: 'Usuario',
          lastName: 'Demo',
          password: 'user123',
          role: UserRole.CLIENT,
        },
        {
          email: 'test@test.com',
          firstName: 'Test',
          lastName: 'User',
          password: '123456',
          role: UserRole.CLIENT,
        }
      ];

      for (const userData of usersToSeed) {
        const existingUser = await this.userRepository.findOne({
          where: { email: userData.email },
        });

        if (!existingUser) {
          const hashedPassword = await bcrypt.hash(userData.password, 12);
          
          const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
          });

          await this.userRepository.save(user);
          console.log(`✅ Created user: ${userData.email} (password: ${userData.password})`);
        }
      }
    }
  }
}
