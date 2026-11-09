
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty({ message: 'Mã nhân viên không được để trống' })
  @MaxLength(30)
  code: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên nhân viên không được để trống' })
  @MaxLength(150)
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @MaxLength(20)
  phone: string;

  @IsEmail({}, { message: 'Email không hợp lệ' })
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Phòng ban không được để trống' })
  @MaxLength(100)
  department: string;

  @IsString()
  @IsNotEmpty({ message: 'Chức vụ không được để trống' })
  @MaxLength(100)
  position: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
