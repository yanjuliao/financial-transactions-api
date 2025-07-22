import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtRedisAuthGuard } from './auth/jwt-redis-auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { UsersService } from './users/service/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalGuards(app.get(JwtRedisAuthGuard), app.get(RolesGuard));

  app.enableCors({
    origin: '*',
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Financial API')
    .setDescription('API documentation with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'jwt-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const usersService = app.get(UsersService);
  await usersService.createAdmin();

  await app.listen(3000);
}
bootstrap();
