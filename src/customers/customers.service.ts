import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Thêm khách hàng
  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);

    return await this.customerRepository.save(customer);
  }

  // Lấy danh sách khách hàng
  async findAll() {
    return await this.customerRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Tìm khách hàng theo ID
  async findOne(id: number) {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException('Không tìm thấy khách hàng');
    }

    return customer;
  }

  // Cập nhật khách hàng
  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    Object.assign(customer, updateCustomerDto);

    return await this.customerRepository.save(customer);
  }

  // Xóa khách hàng
  async remove(id: number) {
    const customer = await this.findOne(id);

    await this.customerRepository.remove(customer);

    return {
      message: 'Xóa khách hàng thành công',
    };
  }
}