import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 255 })
  password: string;

  @Column({ default: 'MANAGER', length: 20 })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'nvarchar',
    length: 255,
    nullable: true,
  })
  resetCodeHash: string | null;

  @Column({
    type: 'datetime2',
    nullable: true,
  })
  resetCodeExpiresAt: Date | null;

  @CreateDateColumn({ type: 'datetime2' })
  createdAt: Date;
}