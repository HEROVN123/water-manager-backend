
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  // Thêm nhân viên
  async create(createEmployeeDto: CreateEmployeeDto) {
    const employee = this.employeeRepository.create(createEmployeeDto);

    return await this.employeeRepository.save(employee);
  }

  // Lấy danh sách nhân viên
  async findAll() {
    return await this.employeeRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Tìm nhân viên theo ID
  async findOne(id: number) {
    const employee = await this.employeeRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new NotFoundException('Không tìm thấy nhân viên');
    }

    return employee;
  }

  // Cập nhật nhân viên
  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.findOne(id);

    Object.assign(employee, updateEmployeeDto);

    return await this.employeeRepository.save(employee);
  }

  // Xóa nhân viên
  async remove(id: number) {
    const employee = await this.findOne(id);

    await this.employeeRepository.remove(employee);

    return {
      message: 'Xóa nhân viên thành công',
    };
  }
}
