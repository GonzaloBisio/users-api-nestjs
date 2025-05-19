import { 
  ConflictException, 
  Inject, 
  Injectable, 
  NotFoundException,
  Logger
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { IUserRepository, UserFilterOptions } from '../interfaces/user-repository.interface';
import { UserRole } from '@/auth/enum/roles.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  private readonly logger = new Logger(UsersService.name);
  private readonly SALT_ROUNDS = 10;

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!createUserDto.email) {
      throw new ConflictException('El correo electrónico es requerido');
    }
    
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está en uso');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, this.SALT_ROUNDS);
    this.logger.log('Contraseña hasheada correctamente');

    // Crear el perfil con el rol
    const profile = new Profile({
      role: createUserDto.profile.role, // El rol viene del DTO del perfil
      firstName: createUserDto.profile.firstName || '',
      lastName: createUserDto.profile.lastName || '',
      phone: createUserDto.profile.phone || null,
      address: createUserDto.profile.address || null,
    });

    // Crear el usuario sin el rol en el nivel superior
    const userToCreate = {
      username: createUserDto.username || '',
      email: createUserDto.email,
      password: hashedPassword,
      isActive: createUserDto.isActive !== undefined ? createUserDto.isActive : true,
      profile: profile,
    } as Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
    
    return this.userRepository.create(userToCreate);
  }

  async findAll(filters?: UserFilterOptions | string): Promise<User[]> {
    const filterOptions: UserFilterOptions = typeof filters === 'string' 
      ? { searchTerm: filters }
      : filters || {};
      
    return this.userRepository.findAll(filterOptions);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }
    return user;
  }

  /**
   * Obtiene el perfil completo del usuario autenticado
   * @param userId ID del usuario autenticado
   * @returns Perfil completo del usuario
   */
  async getProfile(userId: string): Promise<{
    id: string;
    email: string;
    username: string;
    isActive: boolean;
    profile: {
      firstName: string;
      lastName: string;
      phone: string | null;
      address: string | null;
      role: UserRole;
    };
  }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username || '',
      isActive: user.isActive,
      profile: {
        firstName: user.profile?.firstName || '',
        lastName: user.profile?.lastName || '',
        phone: user.profile?.phone || null,
        address: user.profile?.address || null,
        role: user.profile?.role || UserRole.USER
      }
    };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`Usuario con email "${email}" no encontrado`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const userExists = await this.userRepository.findById(id);
    if (!userExists) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (updateUserDto.email && updateUserDto.email !== userExists.email) {
      const emailExists = await this.userRepository.existsWithEmail(updateUserDto.email, id);
      if (emailExists) {
        throw new ConflictException('El correo electrónico ya está en uso');
      }
    }

    let updateData = { ...updateUserDto };
    if (updateUserDto.profile) {
      updateData = {
        ...updateUserDto,
        profile: {
          ...updateUserDto.profile
        }
      };
    }

    const updatedUser = await this.userRepository.update(id, updateData as Partial<User>);
    if (!updatedUser) {
      throw new NotFoundException(`No se pudo actualizar el usuario con ID ${id}`);
    }

    return updatedUser;
  }




  async remove(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`No se pudo eliminar el usuario con ID "${id}"`);
    }
  }

  async deactivateUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (user.isActive === false) {
      throw new ConflictException('El usuario ya se encuentra deshabilitado');
    }
    const updatedUser = await this.userRepository.update(id, { isActive: false });
    if (!updatedUser) {
      throw new NotFoundException(`No se pudo desactivar el usuario con ID "${id}"`);
    }

    return updatedUser;
  }

  async activateUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`Usuario con ID "${id}" no encontrado`);
    }

    if (user.isActive === true) {
      throw new ConflictException('El usuario ya se encuentra habilitado');
    }
    const updatedUser = await this.userRepository.update(id, { isActive: true });
    if (!updatedUser) {
      throw new NotFoundException(`No se pudo desactivar el usuario con ID "${id}"`);
    }

    return updatedUser;
  }
}
