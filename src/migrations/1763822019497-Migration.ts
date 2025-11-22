import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitialSchema1625847615203 implements MigrationInterface {
  name = 'InitialSchema1625847615203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tạo bảng user trước
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true, // ← Thêm unique constraint
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'admin',
            type: 'boolean',
            default: false, // ← Sửa thành boolean
          },
        ],
      }),
    );

    // Tạo bảng report sau
    await queryRunner.createTable(
      new Table({
        name: 'report',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'approved',
            type: 'boolean',
            default: false, // ← Sửa thành boolean
          },
          {
            name: 'price',
            type: 'float',
          },
          {
            name: 'make',
            type: 'varchar',
          },
          {
            name: 'model',
            type: 'varchar',
          },
          {
            name: 'year',
            type: 'integer',
          },
          {
            name: 'lng',
            type: 'float',
          },
          {
            name: 'lat',
            type: 'float',
          },
          {
            name: 'mileage',
            type: 'integer',
          },
          {
            name: 'userId',
            type: 'integer',
          },
        ],
      }),
    );

    // Thêm foreign key constraint
    await queryRunner.createForeignKey(
      'report',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE', // ← Xóa user thì xóa luôn reports
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa foreign key trước
    const table = await queryRunner.getTable('report');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('report', foreignKey);
    }

    // Xóa bảng report trước (vì có FK)
    await queryRunner.dropTable('report');

    // Xóa bảng user sau
    await queryRunner.dropTable('user');
  }
}
