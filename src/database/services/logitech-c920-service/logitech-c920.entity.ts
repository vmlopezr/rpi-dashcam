import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LogitechC920Data {
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
  gain: number;

  @Column()
  whiteBalanceTemp: number;

  @Column()
  sharpness: number;

  @Column()
  exposureAbsolute: number;

  @Column()
  panAbsolute: number;

  @Column()
  tiltAbsolute: number;

  @Column()
  focusAbsolute: number;

  @Column()
  zoomAbsolute: number;

  @Column()
  powerFreq: number;

  @Column()
  exposureAuto: number;

  @Column()
  whiteBalanceAuto: number;

  @Column()
  exposureAutoPriority: number;

  @Column()
  focusAuto: number;

  @Column()
  backlightComp: number;
}
