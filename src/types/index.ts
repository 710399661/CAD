// 用户类型
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 文件类型
export interface CadFile {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// 标注类型
export interface Annotation {
  id: string;
  fileId: string;
  type: 'TEXT' | 'DIMENSION' | 'SHAPE';
  content?: string;
  position: {
    x: number;
    y: number;
    [key: string]: any;
  };
  style?: Record<string, any>;
  createdAt: string;
}

// 图层类型
export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
  opacity: number;
}

// 测量结果类型
export interface Measurement {
  type: 'DISTANCE' | 'AREA' | 'ANGLE';
  value: number;
  unit: string;
  points: Array<{ x: number; y: number }>;
}

// 工具类型
export type ToolType = 'SELECT' | 'PAN' | 'ZOOM' | 'DISTANCE' | 'AREA' | 'ANGLE' | 'TEXT' | 'DIMENSION' | 'SHAPE';

// 查看器状态类型
export interface ViewerState {
  currentTool: ToolType;
  zoom: number;
  pan: { x: number; y: number };
  rotation: number;
  showGrid: boolean;
  layers: Layer[];
  annotations: Annotation[];
  measurements: Measurement[];
}