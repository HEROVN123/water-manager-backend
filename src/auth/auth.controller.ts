import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  // ĐĂNG KÝ
  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản quản lý' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ĐĂNG NHẬP
  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // QUÊN MẬT KHẨU
  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi mã OTP đặt lại mật khẩu qua email' })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  // ĐẶT LẠI MẬT KHẨU
  @Post('reset-password')
  @ApiOperation({ summary: 'Xác minh OTP và đặt lại mật khẩu' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(
      dto.email,
      dto.code,
      dto.newPassword,
    );
  }

  // LẤY THÔNG TIN PROFILE
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
  getProfile(@Req() req: any) {
    const userId = Number(
      req.user?.userId ??
      req.user?.sub ??
      req.user?.id,
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new UnauthorizedException(
        'Token không hợp lệ.',
      );
    }

    return this.authService.getProfile(userId);
  }

  // CẬP NHẬT PROFILE
  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  updateProfile(
    @Req() req: any,
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = Number(
      req.user?.userId ??
      req.user?.sub ??
      req.user?.id,
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new UnauthorizedException(
        'Token không hợp lệ.',
      );
    }

    return this.authService.updateProfile(userId, dto);
  }

  // ĐỔI MẬT KHẨU
  @Patch('change-password')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản' })
  changePassword(
    @Req() req: any,
    @Body() dto: ChangePasswordDto,
  ) {
    const userId = Number(
      req.user?.userId ??
      req.user?.sub ??
      req.user?.id,
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new UnauthorizedException(
        'Token không hợp lệ.',
      );
    }

    return this.authService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}