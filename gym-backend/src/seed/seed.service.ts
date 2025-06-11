import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private generateRandomUser() {
    const nombres = [
      'Juan',
      'Maria',
      'Pedro',
      'Ana',
      'Lucas',
      'Carla',
      'Jose',
      'Paula',
      'Miguel',
      'Laura',
      'Mateo',
      'Valentina',
      'Santiago',
      'Sofia',
      'Benjamin',
      'Martina',
      'Diego',
      'Emma',
      'Joaquin',
      'Camila',
      'Tomas',
      'Victoria',
      'Agustin',
      'Lucia',
      'Franco',
      'Florencia',
    ];
    const apellidos = [
      'Garcia',
      'Rodriguez',
      'Lopez',
      'Martinez',
      'Gonzalez',
      'Perez',
      'Sanchez',
      'Romero',
      'Fernandez',
      'Acosta',
      'Blanco',
      'Quiroga',
      'Rojas',
      'Diaz',
      'Sosa',
      'Herrera',
      'Aguirre',
      'Gimenez',
      'Suarez',
      'Ortiz',
      'Ramirez',
      'Pereyra',
      'Morales',
      'Castro',
    ];

    const randomName = nombres[Math.floor(Math.random() * nombres.length)];
    const randomLastName =
      apellidos[Math.floor(Math.random() * apellidos.length)];

    // Generar DNI aleatorio (formato: 8 números y 1 letra)
    const dniNumber = Math.floor(10000000 + Math.random() * 90000000);
    const dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';
    const dniLetter = dniLetters[dniNumber % 23];
    const dni = `${dniNumber}${dniLetter}`;

    // Generar fecha de nacimiento aleatoria (entre 18 y 70 años)
    const today = new Date();
    const minAge = 18;
    const maxAge = 70;
    const birthYear =
      today.getFullYear() -
      minAge -
      Math.floor(Math.random() * (maxAge - minAge));
    const birthMonth = Math.floor(Math.random() * 12);
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthDate = new Date(birthYear, birthMonth, birthDay);

    // Generar número de teléfono aleatorio
    const phone = `6${Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, '0')}`;

    return {
      email: `${randomName.toLowerCase()}.${randomLastName.toLowerCase()}${Math.floor(Math.random() * 1000)}@example.com`,
      name: randomName,
      lastName: randomLastName,
      dni,
      birthDate,
      phone,
      role: 'USER' as Role,
    };
  }

  async createAdmin() {
    // Primero verificamos si ya existe un admin
    const existingAdmin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (existingAdmin) {
      return { message: 'El administrador ya existe' };
    }

    const hashedPassword = await this.hashPassword('admin123');

    return this.prisma.$transaction(async (tx) => {
      const admin = await tx.user.create({
        data: {
          email: 'admin@admin.com',
          password: hashedPassword,
          name: 'Admin',
          lastName: 'System',
          dni: '00000000A',
          birthDate: new Date('1990-01-01'),
          phone: '600000000',
          role: 'ADMIN',
          enrollment: {
            create: {},
          },
        },
      });

      return admin
        ? { message: 'Administrador creado exitosamente' }
        : { message: 'Error al crear administrador' };
    });
  }

  async createRandomUsers(count: number = 200) {
    try {
      // Generamos todos los usuarios primero
      const usersToCreate = Array.from({ length: count }, () => {
        const userData = this.generateRandomUser();
        return {
          ...userData,
          enrollment: {
            create: {},
          },
        };
      });

      // Creamos todos los usuarios en una sola operación usando transacciones
      const createdUsers = await Promise.all(
        usersToCreate.map((userData) =>
          this.prisma.user.create({
            data: userData,
          }),
        ),
      );

      return {
        message: `${createdUsers.length} usuarios creados exitosamente`,
        count: createdUsers.length,
      };
    } catch (error) {
      console.error('Error en la creación de usuarios:', error);
      throw new Error(`Error creando usuarios: ${error.message}`);
    }
  }
}
