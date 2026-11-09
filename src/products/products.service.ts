
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Thêm sản phẩm
  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  // Lấy danh sách sản phẩm
  async findAll() {
    return await this.productRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  // Tìm sản phẩm theo ID
  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        `Không tìm thấy sản phẩm có ID ${id}`,
      );
    }

    return product;
  }

  // Cập nhật sản phẩm
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);

    const updatedProduct = this.productRepository.merge(
      product,
      updateProductDto,
    );

    return await this.productRepository.save(updatedProduct);
  }

  // Xóa sản phẩm
  async remove(id: number) {
    const product = await this.findOne(id);

    await this.productRepository.remove(product);

    return {
      message: 'Xóa sản phẩm thành công',
    };
  }
}
