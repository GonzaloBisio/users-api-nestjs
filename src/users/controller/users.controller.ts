import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserFilterDto } from '../dto/user-filter.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../../auth/enum/roles.enum';
import { Roles } from '@/auth/decorators/roles.decorator';
import { JwtAuthGuard, RolesGuard } from '@/auth';
import { userProfileApiSchema } from '../dto/responses/user-profile.response.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Put,
  UseGuards,
  Req,
  UnauthorizedException
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard) // Protege todos los metodos del controlador con JWT
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

  // La autorizacion a los metodos se realiza en el decorador @UseGuards(RolesGuard) 
  // De esta forma separamos la autorizacion de ejecucion en distintos servicios en base al rol del usuario

  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiCreatedResponse({
    description: 'El usuario ha sido creado exitosamente.',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos.' })
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiResponse({
    status: 409,
    description: 'El correo electrónico ya está en uso.'
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Puedes filtrar los resultados usando los parámetros de consulta. Todos los filtros son opcionales y realizan búsquicas parciales (LIKE) case insensitive.'
  })
  @ApiOkResponse({
    description: 'Lista de usuarios obtenida exitosamente.',
    type: [User]
  })
  async findAll(
    @Query() filterDto: UserFilterDto
  ): Promise<User[]> {
    const filters = Object.fromEntries(
      Object.entries(filterDto).filter(([_, v]) => v !== undefined)
    );

    return this.usersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiOkResponse({ 
    description: 'Usuario encontrado.',
    type: User
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    return this.usersService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiOkResponse({
    description: 'Usuario actualizado exitosamente.',
    type: User
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  @ApiResponse({
    status: 409,
    description: 'El correo electrónico ya está en uso.'
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Put('/activate/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar un usuario' })
  @ApiOkResponse({
    description: 'Usuario activado exitosamente.',
    type: User
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  async activateUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.activateUser(id);
  }

  @Put('/deactivate/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar un usuario' })
  @ApiOkResponse({
    description: 'Usuario desactivado exitosamente.',
    type: User
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  async deactivateUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<User> {
    return this.usersService.deactivateUser(id);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: 'Usuario eliminado exitosamente.' })
  @ApiBadRequestResponse({ description: 'ID inválido.' })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado.' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.usersService.remove(id);
  }

  @Get('profile')
  @ApiOperation({ 
    summary: 'Obtener el perfil del usuario autenticado',
    description: 'Devuelve los detalles del perfil del usuario autenticado basado en el token JWT.'
  })
  @ApiOkResponse({
    ...userProfileApiSchema
  })
  @ApiUnauthorizedResponse({ description: 'No autorizado' })
  @ApiForbiddenResponse({ description: 'No tiene permisos para acceder a este recurso' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario autenticado',
    schema: userProfileApiSchema.content['application/json'].schema
  })
  async getProfile(@Req() req: any) {
    console.log('User from request:', req.user); // Debug
    console.log('User ID from token:', req.user?.sub); // Debug
    if (!req.user?.sub) {
      throw new UnauthorizedException('Usuario no autenticado');
    }
    return this.usersService.getProfile(req.user.sub);
  }
}
