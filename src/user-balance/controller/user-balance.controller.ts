import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserBalanceService } from '../service/user-balance.service';
import { UserBalanceResponseDto } from '../dto/response/user-balance.response.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleType } from 'src/users/enum';

@ApiTags('User Balances')
@ApiBearerAuth('jwt-auth')
@Roles(RoleType.USER, RoleType.ADMIN)
@Controller('user-balances')
export class UserBalanceController {
  constructor(private readonly service: UserBalanceService) {}

  @Get()
  @ApiOperation({ summary: 'Get user balance snapshots by logged-in user' })
  @ApiResponse({ status: 200, type: [UserBalanceResponseDto] })
  async findBalancesByUserId(@Req() req): Promise<UserBalanceResponseDto[]> {
    const userId = req.user.userId;
    return this.service.findBalancesByUserId(userId);
  }
}
