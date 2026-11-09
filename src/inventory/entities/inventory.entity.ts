import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 30, unique: true })
  code: string;

  @Column({ type: 'nvarchar', length: 150 })
  product: string;

  @Column({ type: 'nvarchar', length: 100 })
  category: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', default: 0 })
  minStock: number;

  @Column({ type: 'nvarchar', length: 30 })
  unit: string;

  @Column({ type: 'nvarchar', length: 20 })
  updatedAt: string;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  modifiedAt: Date;
}