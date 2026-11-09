import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại' })
  currentPassword: string;

  @IsString()
  @MinLength(6, {
    message: 'Mật khẩu mới phải có ít nhất 6 ký tự',
  })
  @MaxLength(50)
  newPassword: string;
}