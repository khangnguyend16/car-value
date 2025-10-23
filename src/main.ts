import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //NestJS sẽ tự động loại bỏ mọi trường không được định nghĩa trong DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
