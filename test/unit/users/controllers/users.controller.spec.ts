import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/controller/users.controller';
import { UsersService } from '@/users/services/users.service';
import { mockUser, mockCreateUserDto, mockUpdateUserDto } from '../../../utils/mocks/users.mock';

describe('UsersController (simplified)', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock del servicio
  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
    
    // Resetear mocks antes de cada test
    jest.clearAllMocks();
    
    // Configurar valores por defecto
    mockService.create.mockResolvedValue(mockUser);
    mockService.findAll.mockResolvedValue([mockUser]);
    mockService.findById.mockResolvedValue(mockUser);
    mockService.update.mockResolvedValue({ ...mockUser, ...mockUpdateUserDto });
    mockService.remove.mockResolvedValue(undefined);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  // CREATE
  describe('create', () => {
    it('debería crear un usuario exitosamente', async () => {
      const result = await controller.create(mockCreateUserDto);
      expect(mockService.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });
  });

  // FIND ALL
  describe('findAll', () => {
    it('debería retornar todos los usuarios', async () => {
      const result = await controller.findAll({});
      expect(mockService.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual([mockUser]);
    });
  });

  // FIND ONE
  describe('findOne', () => {
    it('debería retornar un usuario por ID', async () => {
      const result = await controller.findOne('1');
      expect(mockService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });
  });

  // UPDATE
  describe('update', () => {
    it('debería actualizar un usuario', async () => {
      const result = await controller.update('1', mockUpdateUserDto);
      expect(mockService.update).toHaveBeenCalledWith('1', mockUpdateUserDto);
      expect(result).toEqual({ ...mockUser, ...mockUpdateUserDto });
    });
  });

  // REMOVE
  describe('remove', () => {
    it('debería eliminar un usuario', async () => {
      await controller.remove('1');
      expect(mockService.remove).toHaveBeenCalledWith('1');
    });
  });
});
