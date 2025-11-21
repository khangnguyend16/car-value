import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    // ConfigModule là module giúp load các biến môi trường từ file .env vào ứng dụng.
    ConfigModule.forRoot({
      isGlobal: true, // Không cần import ConfigModule ở các module khác
      envFilePath: `.env.${process.env.NODE_ENV}`, // Chỉ định file .env nào sẽ được đọc
    }),
    TypeOrmModule.forRootAsync({
      // tạo kết nối DB một cách bất đồng bộ (async) => lấy thông tin từ ConfigService trước khi tạo kết nối.
      inject: [ConfigService],
      // ConfigService dùng để đọc giá trị từ các biến môi trường.
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite', // Tên file chứa dữ liệu SQLite. Nếu file chưa tồn tại → TypeORM sẽ tự tạo
    //   entities: [User, Report], // Mỗi entity tương ứng với một bảng trong database
    //   synchronize: true, // Khi chạy app, TypeORM sẽ tự động tạo bảng trong database dựa theo định nghĩa trong các entity. (Rất tiện khi dev, nhưng không nên bật ở môi trường production!)
    // }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true, //NestJS sẽ tự động loại bỏ mọi trường không được định nghĩa trong DTO
      }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['fsdfsfs'],
        }),
      )
      .forRoutes('*');
  }
}
