import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Nguyễn Văn Quản Lý',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    example: 'manager3@watermanager.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '0901234567',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'Mật khẩu tối thiểu 6 ký tự',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 255)
  password: string;
}