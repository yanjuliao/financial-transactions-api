import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login.request.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiResponse({ status: 201, description: 'Login realizado com sucesso e JWT retornado' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() dto: LoginRequestDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    return this.authService.login(user);
  }
}
