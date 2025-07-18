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
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UpdateUserAdminDto } from '../dto/requests/update-user-admin.dto';
import { CreateUserAdminDto } from '../dto/requests/create-user-admin.dto';

@ApiTags('Users')
@ApiBearerAuth('jwt-auth')
@Roles('ADMIN')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  @Roles('USER', 'ADMIN')
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.service.create(dto);
  }

  @Post('admin')
  @ApiOperation({ summary: 'Create new user by admin' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  createByAdmin(@Body() dto: CreateUserAdminDto): Promise<UserResponseDto> {
    return this.service.createByAdmin(dto);
  }

  @Get('admin')
  @ApiOperation({ summary: 'List all users' })
  @ApiResponse({ status: 200, type: [UserResponseDto] })
  findAll(): Promise<UserResponseDto[]> {
    return this.service.findAll();
  }

  @Get('admin/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    return this.service.findById(id);
  }

  @Put('admin/:id')
  @ApiOperation({ summary: 'Update user admin by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserAdminDto,
  ): Promise<UserResponseDto> {
    return this.service.updateByAdmin(id, dto);
  }

  @Put()
  @Roles('USER', 'ADMIN')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200, type: UserResponseDto })
  update(
    @Body() dto: UpdateUserDto,
    @Req() req,
  ): Promise<UserResponseDto> {
    const userId = req.user.userId;
    return this.service.update(userId, dto);
  }

  @Delete('admin/:id')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User successfully deleted' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.delete(id);
  }
}
