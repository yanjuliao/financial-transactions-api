import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/requests/create-user.dto';
import { UpdateUserDto } from '../dto/requests/update-user.dto';
import { UsersService } from '../service/users.service';
import { UserResponseDto } from '../dto/responses/user.response.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from '../enum';

@ApiTags('Users')
@ApiBearerAuth('jwt-auth')
@Roles(RoleType.ADMIN)
@Controller('users')
export class UsersController {
  private FORBIDDEN_MESSAGE = 'you_can_only_view_your_own_data.';
  private CANNOT_CREATE_ADMIN_MESSAGE = 'you_are_not_authorized_to_create_an_admin_user.';


  constructor(private readonly service: UsersService) {}

  @Post()
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() dto: CreateUserDto, @Req() req): Promise<UserResponseDto> {
    const userRole = req.user.role;
    if (userRole !== RoleType.ADMIN && dto.role === RoleType.ADMIN) {
      throw new ForbiddenException(this.CANNOT_CREATE_ADMIN_MESSAGE);
    }
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  findById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<UserResponseDto> {
    const userId = req.user.userId;
    const userRole = req.user.role;
    if (userRole !== RoleType.ADMIN && userId !== id) {
      throw new ForbiddenException(this.FORBIDDEN_MESSAGE);
    }
    return this.service.findById(id);
  }

  @Put(':id')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(
    @Body() dto: UpdateUserDto,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    const userId = req.user.userId;
    const userRole = req.user.role;
    if (userRole !== 'ADMIN' && userId !== id) {
      throw new ForbiddenException(this.FORBIDDEN_MESSAGE);
    }
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
