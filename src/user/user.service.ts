
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Tạo tài khoản và mã hóa mật khẩu
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const {
      password,
      resetCodeHash,
      resetCodeExpiresAt,
      ...safeUser
    } = savedUser;

    return safeUser as User;
  }

  // Lấy danh sách tài khoản
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();

    return users.map(
      ({ password, resetCodeHash, resetCodeExpiresAt, ...user }) =>
        user as User,
    );
  }

  // Tìm tài khoản theo ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy User có id ${id}`,
      );
    }

    const {
      password,
      resetCodeHash,
      resetCodeExpiresAt,
      ...safeUser
    } = user;

    return safeUser as User;
  }

  // Tìm tài khoản theo Email (dùng cho đăng nhập và quên mật khẩu)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // Lưu mã OTP đã được mã hóa và thời hạn sử dụng
  async saveResetCode(
    email: string,
    codeHash: string,
    expiresAt: Date,
  ): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) return;

    user.resetCodeHash = codeHash;
    user.resetCodeExpiresAt = expiresAt;

    await this.userRepository.save(user);
  }

  // Xóa mã OTP
  async clearResetCode(email: string): Promise<void> {
    const user = await this.findByEmail(email);

    if (!user) return;

    user.resetCodeHash = null;
    user.resetCodeExpiresAt = null;

    await this.userRepository.save(user);
  }

  // Xác minh OTP và đặt lại mật khẩu
  async resetPasswordWithCode(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.findByEmail(email);

    if (
      !user ||
      !user.resetCodeHash ||
      !user.resetCodeExpiresAt ||
      user.resetCodeExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException(
        'Mã xác nhận không hợp lệ hoặc đã hết hạn.',
      );
    }

    const isCodeValid = await bcrypt.compare(
      code,
      user.resetCodeHash,
    );

    if (!isCodeValid) {
      throw new BadRequestException(
        'Mã xác nhận không chính xác.',
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCodeHash = null;
    user.resetCodeExpiresAt = null;

    await this.userRepository.save(user);
  }

  // Cập nhật tài khoản
  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy User có id ${id}`,
      );
    }

    const updatedData = { ...updateUserDto };

    // Nếu có cập nhật mật khẩu thì mã hóa trước khi lưu
    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(
        updatedData.password,
        10,
      );
    }

    Object.assign(user, updatedData);

    const updatedUser = await this.userRepository.save(user);

    const {
      password,
      resetCodeHash,
      resetCodeExpiresAt,
      ...safeUser
    } = updatedUser;

    return safeUser as User;
  }
// CẬP NHẬT THÔNG TIN PROFILE
async updateProfile(
  id: number,
  data: {
    name: string;
    email: string;
    phone: string;
  },
): Promise<User> {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('Không tìm thấy tài khoản.');
  }

  // Kiểm tra email đã thuộc tài khoản khác chưa
  const existingUser = await this.findByEmail(data.email);

  if (existingUser && existingUser.id !== id) {
    throw new ConflictException('Email đã được sử dụng.');
  }

  user.name = data.name;
  user.email = data.email;
  user.phone = data.phone;

  const updatedUser = await this.userRepository.save(user);

  const {
    password,
    resetCodeHash,
    resetCodeExpiresAt,
    ...safeUser
  } = updatedUser;

  return safeUser as User;
}

// ĐỔI MẬT KHẨU
async changePassword(
  id: number,
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('Không tìm thấy tài khoản.');
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordValid) {
    throw new BadRequestException(
      'Mật khẩu hiện tại không chính xác.',
    );
  }

  if (currentPassword === newPassword) {
    throw new BadRequestException(
      'Mật khẩu mới phải khác mật khẩu hiện tại.',
    );
  }

  user.password = await bcrypt.hash(newPassword, 10);

  await this.userRepository.save(user);
}
  // Xóa tài khoản
  async remove(id: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy User có id ${id}`,
      );
    }

    await this.userRepository.remove(user);
  }
}
