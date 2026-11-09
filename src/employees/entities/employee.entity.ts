
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', length: 30, unique: true })
  code: string;

  @Column({ type: 'nvarchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ type: 'nvarchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'nvarchar', length: 100 })
  department: string;

  @Column({ type: 'nvarchar', length: 100 })
  position: string;

  @Column({ type: 'bit', default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2' })
  updatedAt: Date;
}
