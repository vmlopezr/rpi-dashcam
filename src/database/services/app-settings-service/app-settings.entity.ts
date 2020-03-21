import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  camera: string;

  @Column()
  Device: string;

  @Column()
  NodePort: number;

  @Column()
  IPAddress: string;

  @Column()
  TCPStreamPort: number;

  @Column()
  LiveStreamPort: number;
  @Column()
  videoLength: number;
}
