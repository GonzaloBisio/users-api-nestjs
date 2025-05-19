import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from '@/users/services/users.service';
import { mockUser, mockCreateUserDto, mockUpdateUserDto } from '../../../utils/mocks/users.mock';

describe('UsersService (simplified)', () => {
  let service: UsersService;
  
  // Mock del repositorio
  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    existsWithEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: 'IUserRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    

    jest.clearAllMocks();
    
    // Configurar valores por defecto
    mockRepository.findByEmail.mockResolvedValue(null);
    mockRepository.findById.mockResolvedValue(mockUser);
    mockRepository.create.mockResolvedValue(mockUser);
    mockRepository.update.mockResolvedValue({ ...mockUser, ...mockUpdateUserDto });
    mockRepository.delete.mockResolvedValue(true);
    mockRepository.findAll.mockResolvedValue([mockUser]);
    mockRepository.existsWithEmail.mockResolvedValue(false);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  // CREATE
  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      const result = await service.create(mockCreateUserDto);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar error si el correo ya existe', async () => {
      mockRepository.findByEmail.mockResolvedValueOnce(mockUser);
      await expect(service.create(mockCreateUserDto)).rejects.toThrow(ConflictException);
    });
  });

  // FIND ALL
  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      const result = await service.findAll();
      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  // FIND BY ID
  describe('findById', () => {
    it('debería retornar un usuario por ID', async () => {
      const result = await service.findById('1');
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('debería lanzar error si el usuario no existe', async () => {
      mockRepository.findById.mockResolvedValueOnce(null);
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  // UPDATE
  describe('update', () => {
    it('debería actualizar un usuario', async () => {
      const result = await service.update('1', mockUpdateUserDto);
      expect(mockRepository.update).toHaveBeenCalledWith('1', mockUpdateUserDto);
      expect(result).toEqual({ ...mockUser, ...mockUpdateUserDto });
    });
  });

  // REMOVE
  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      await service.remove('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});
