import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto) {
    const item = this.inventoryRepository.create(createInventoryDto);
    return this.inventoryRepository.save(item);
  }

  async findAll() {
    return this.inventoryRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const item = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException('Không tìm thấy sản phẩm trong kho');
    }

    return item;
  }

  async update(id: number, updateInventoryDto: UpdateInventoryDto) {
    const item = await this.findOne(id);

    Object.assign(item, updateInventoryDto);

    return this.inventoryRepository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);

    await this.inventoryRepository.remove(item);

    return {
      message: 'Xóa sản phẩm khỏi kho thành công',
    };
  }
}