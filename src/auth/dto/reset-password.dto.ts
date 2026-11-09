import {
  IsEmail,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'Mã xác nhận phải gồm 6 chữ số',
  })
  code: string;

  @IsString()
  @Length(6, 50, {
    message: 'Mật khẩu mới phải từ 6 đến 50 ký tự',
  })
  newPassword: string;
}