import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsNumber,
  Min,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  customer: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  product: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  total: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsIn([
    'Đang xử lý',
    'Đang giao',
    'Hoàn thành',
    'Đã hủy',
  ])
  status: string;
}