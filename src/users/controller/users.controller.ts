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
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleType } from '../enum';
import { AllowOwnerOrAdmin } from 'src/common/decorators/allow-owner-or-admin.decorator';

@ApiTags('Users')
@ApiBearerAuth('jwt-auth')
@Roles(RoleType.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Roles(RoleType.USER, RoleType.ADMIN)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() dto: CreateUserDto, @Req() req): Promise<UserResponseDto> {
    const userRole = req.user.role;
    this.service.validateCreate(dto, userRole);
    return this.service.createUserRegular(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.service.findUsers();
  }

  @Get(':id')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @AllowOwnerOrAdmin()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  findById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.service.findUserById(id);
  }

  @Put(':id')
  @Roles(RoleType.USER, RoleType.ADMIN)
  @AllowOwnerOrAdmin()
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserResponseDto> {
    return this.service.updateUser(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.deleteUser(id);
  }
}
