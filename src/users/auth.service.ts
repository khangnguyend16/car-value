import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
//scrypt: thuật toán băm mật khẩu an toàn (kháng brute-force tốt hơn SHA-256, MD5)
//randomBytes: tạo một chuỗi ngẫu nhiên, dùng để làm salt (giúp tăng bảo mật hash)
import { randomBytes, scrypt as _scrypt } from 'crypto';
//promisify: biến hàm dạng callback (như scrypt) thành Promise, để có thể dùng await
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.userService.find(email);
    if (users.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the users password
    // 1. Generate a salt
    // salt: chuỗi ngẫu nhiên 8 bytes (16 ký tự hex)
    const salt = randomBytes(8).toString('hex');

    // 2. Hash the salt and the password together
    // Kết quả trả về là một Buffer (dạng dữ liệu nhị phân)
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // 3. Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const user = await this.userService.create(email, result);

    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.userService.find(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('wrong password');
    }

    return user;
  }
}
