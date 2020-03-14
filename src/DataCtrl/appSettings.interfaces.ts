export interface AppSettings {
  camera: string;
  Device: string;
  NodePort: number;
  IPAddress: string;
  TCPStreamPort: number;
  LiveStreamPort: number;
}

export interface MSHD3000Data {
  videoLength: number;
  brightness: number;
  contrast: number;
  saturation: number;
  whiteBalanceAuto: boolean;
  powerFreq: number;
  whiteBalanceTemp: number;
  sharpness: number;
  backlightComp: number;
  exposureAuto: boolean;
  exposureAbsolute: number;
  panAbsolute: number;
  tiltAbsolute: number;
  zoomAbsolute: number;
}
export interface CamData {
  videoLength: number;
  brightness: number;
  contrast: number;
  saturation: number;
  gain: number;
  whiteBalanceTemp: number;
  sharpness: number;
  exposureAbsolute: number;
  panAbsolute: number;
  tiltAbsolute: number;
  focusAbsolute: number;
  zoomAbsolute: number;
  powerFreq: number;
  exposureAuto: boolean;
  whiteBalanceAuto: boolean;
  exposureAutoPriority: boolean;
  focusAuto: boolean;
  backlightComp: boolean;
}
export interface DirInfo {
  data: string[];
}
