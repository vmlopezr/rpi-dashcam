import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DefaultCamData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoLength: number;

  @Column()
  verticalFlip: number;
}
