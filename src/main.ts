import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule, ObserveInstrument } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // Cho phép React frontend gọi API
  app.enableCors();

  // Validate dữ liệu gửi lên API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // =========================
  // SWAGGER
  // =========================

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

  // =========================

  await app.listen(3000);

  console.log('========================================');
  console.log('WATER MANAGER API');
  console.log('API: http://localhost:3000');
  console.log('Swagger: http://localhost:3000/api');
  console.log('========================================');
}

bootstrap();