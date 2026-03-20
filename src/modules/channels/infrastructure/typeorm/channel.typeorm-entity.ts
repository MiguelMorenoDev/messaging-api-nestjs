import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('channels')
export class ChannelOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string | null;
}