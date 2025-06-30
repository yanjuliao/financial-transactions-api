import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UsersRepository } from "./users.repository";
import { PrismaService } from "prisma/prisma.service";
import { JwtRedisAuthGuard } from "src/auth/jwt-redis-auth.guard";

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository,PrismaService],
  exports: [UsersService,UsersRepository],
})
export class UsersModule {}