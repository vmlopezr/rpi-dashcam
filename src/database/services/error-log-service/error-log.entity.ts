import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  errorSource: string;

  @Column()
  errorMessage: string;

  @Column()
  timeStamp: string;
}
