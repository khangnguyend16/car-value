// src/data-source.ts
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

const env = process.env.NODE_ENV || 'development';

console.log('========================================');
console.log('DataSource loading for environment:', env);
console.log('Current __dirname:', __dirname);
console.log('========================================');

let config: DataSourceOptions;

switch (env) {
  case 'development':
    config = {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      logging: true, // Bật logging để debug
    };
    break;

  case 'test':
    config = {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      synchronize: false,
      dropSchema: true,
      migrationsRun: true, // Chạy migrations tự động
      logging: false,
    };
    break;

  case 'production':
    config = {
      type: 'postgres', // hoặc 'mysql'
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity.js'],
      migrations: [__dirname + '/migrations/*.js'],
      synchronize: false,
      logging: false,
      ssl:
        process.env.DATABASE_SSL === 'true'
          ? { rejectUnauthorized: false }
          : false,
    };
    break;

  default:
    throw new Error('Unknown environment: ' + env);
}

console.log('DataSource config created with entities path:', config.entities);

export const AppDataSource = new DataSource(config);
