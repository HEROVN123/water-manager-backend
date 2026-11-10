
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createObserveModule } from '@nestjs/observe';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { EmployeesModule } from './employees/employees.module';
import { OrdersModule } from './orders/orders.module';
import { InventoryModule } from './inventory/inventory.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

// Chế độ demo chỉ bật khi Render có DEMO_MODE=true
const isDemoMode = process.env.DEMO_MODE === 'true';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Chỉ kết nối SQL Server khi không chạy chế độ demo
    ...(!isDemoMode
      ? [
          TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
              type: 'mssql' as const,
              host: configService.get<string>('DB_HOST'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_DATABASE'),
              options: {
                instanceName: configService.get<string>('DB_INSTANCE'),
                encrypt: false,
                trustServerCertificate: true,
              },
              autoLoadEntities: true,
              synchronize: true,
            }),
          }),
        ]
      : []),

    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'nuoc-loc',
    }),

    // Các module nghiệp vụ chỉ được nạp khi có Database
    ...(!isDemoMode
      ? [
          UserModule,
          AuthModule,
          MailModule,
          ProductsModule,
          CustomersModule,
          EmployeesModule,
          OrdersModule,
          InventoryModule,
        ]
      : []),
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
