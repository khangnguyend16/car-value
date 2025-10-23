import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite', // Tên file chứa dữ liệu SQLite. Nếu file chưa tồn tại → TypeORM sẽ tự tạo
      entities: [User, Report], // Mỗi entity tương ứng với một bảng trong database
      synchronize: true, // Khi chạy app, TypeORM sẽ tự động tạo bảng trong database dựa theo định nghĩa trong các entity. (Rất tiện khi dev, nhưng không nên bật ở môi trường production!)
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
