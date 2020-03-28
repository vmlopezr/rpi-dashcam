import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  errorName: string;

  @Column()
  errorMessage: string;

  @Column()
  errorCode: number;

  @Column()
  timeStamp: string;

  @Column()
  errorStack: string;
}
