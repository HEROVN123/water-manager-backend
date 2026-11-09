
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // CORS: cho phép Frontend gọi Backend
  app.enableCors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
  });

  // Validate dữ liệu
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('WATER MANAGER API')
    .setDescription(
      'API quản lý hệ thống nước - sản phẩm, khách hàng, nhân viên, đơn hàng và kho hàng.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  // Render tự cấp PORT
  const port = process.env.PORT || 3000;

  await app.listen(port, '0.0.0.0');

  console.log('========================================');
  console.log('WATER MANAGER API');
  console.log(`Port: ${port}`);
  console.log(`Swagger: http://localhost:${port}/api`);
  console.log('========================================');
}

bootstrap();
