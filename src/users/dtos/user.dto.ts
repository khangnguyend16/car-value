import { Expose } from 'class-transformer';

export class UserDto {
  // Giới hạn dữ liệu trả về: chỉ expose những field cần thiết
  @Expose()
  id: number;

  @Expose()
  email: string;
}
