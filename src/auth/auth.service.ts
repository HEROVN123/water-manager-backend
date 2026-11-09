
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

import { UserService } from '../user/user.service';
import { MailService } from '../mail/mail.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // ĐĂNG KÝ
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(
      registerDto.email,
    );

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    const user = await this.userService.create({
      ...registerDto,
      role: 'MANAGER',
      isActive: true,
    });

    const accessToken = await this.generateToken(user);

    return {
      message: 'Đăng ký tài khoản thành công',
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  // ĐĂNG NHẬP
  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(
      loginDto.email,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Email hoặc mật khẩu không chính xác',
      );
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Email hoặc mật khẩu không chính xác',
      );
    }

    if (!user.isActive) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
    }

    const accessToken = await this.generateToken(user);

    return {
      message: 'Đăng nhập thành công',
      accessToken,
      tokenType: 'Bearer',
      expiresIn: '1d',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
      },
    };
  }

  // QUÊN MẬT KHẨU - GỬI MÃ OTP QUA EMAIL
  async forgotPassword(email: string) {
    const message =
      'Nếu email đã đăng ký, mã xác nhận sẽ được gửi đến hộp thư của bạn.';

    const user = await this.userService.findByEmail(email);

    // Không tiết lộ email có tồn tại hay không
    if (!user || !user.isActive) {
      return { message };
    }

    // Tạo mã OTP ngẫu nhiên gồm 6 chữ số
    const code = randomInt(100000, 1000000).toString();

    // Mã hóa OTP trước khi lưu vào database
    const codeHash = await bcrypt.hash(code, 10);

    // Mã có hiệu lực trong 5 phút
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.userService.saveResetCode(
      email,
      codeHash,
      expiresAt,
    );

    try {
      await this.mailService.sendResetCode(email, code);
    } catch (error) {
      await this.userService.clearResetCode(email);
      throw error;
    }

    return { message };
  }

  // ĐẶT LẠI MẬT KHẨU BẰNG OTP
  async resetPassword(
    email: string,
    code: string,
    newPassword: string,
  ) {
    await this.userService.resetPasswordWithCode(
      email,
      code,
      newPassword,
    );

    return {
      message: 'Đặt lại mật khẩu thành công.',
    };
  }

  // TẠO JWT TOKEN
  private async generateToken(user: {
    id: number;
    email: string;
    role: string;
  }): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload);
  }
// LẤY THÔNG TIN PROFILE
async getProfile(userId: number) {
  return this.userService.findOne(userId);
}

// CẬP NHẬT PROFILE
async updateProfile(
  userId: number,
  data: {
    name: string;
    email: string;
    phone: string;
  },
) {
  const user = await this.userService.updateProfile(
    userId,
    data,
  );

  return {
    message: 'Cập nhật thông tin thành công.',
    user,
  };
}

// ĐỔI MẬT KHẨU
async changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string,
) {
  await this.userService.changePassword(
    userId,
    currentPassword,
    newPassword,
  );

  return {
    message: 'Đổi mật khẩu thành công.',
  };
 }
}
