import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 30, unique: true })
  code: string;

  @Column({ type: 'nvarchar', length: 150 })
  customer: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'nvarchar', length: 150 })
  product: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total: number;

  @Column({ type: 'nvarchar', length: 20 })
  date: string;

  @Column({ type: 'nvarchar', length: 30 })
  status: string;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt: Date;
}