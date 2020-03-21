import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MSHD3000Data {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  videoLength: number;

  @Column()
  brightness: number;

  @Column()
  contrast: number;

  @Column()
  saturation: number;

  @Column()
  whiteBalanceAuto: number;

  @Column()
  powerFreq: number;

  @Column()
  whiteBalanceTemp: number;

  @Column()
  sharpness: number;

  @Column()
  backlightComp: number;

  @Column()
  exposureAuto: number;

  @Column()
  exposureAbsolute: number;

  @Column()
  panAbsolute: number;

  @Column()
  tiltAbsolute: number;

  @Column()
  zoomAbsolute: number;

  @Column()
  verticalFlip: number;
}
