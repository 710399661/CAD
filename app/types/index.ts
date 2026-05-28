export interface CadFile {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface CADDocument {
  entities: CADEntity[];
  layers: string[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
}

export interface CADEntity {
  type: 'LINE' | 'CIRCLE' | 'ARC' | 'TEXT' | 'POLYLINE';
  points?: { x: number; y: number }[];
  center?: { x: number; y: number };
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  text?: string;
  layer: string;
  color?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export type ToolType = 'SELECT' | 'PAN' | 'ZOOM' | 'DISTANCE' | 'AREA' | 'ANGLE' | 'TEXT' | 'DIMENSION' | 'SHAPE';

export interface RootState {
  auth: {
    isAuthenticated: boolean;
    user: User | null;
  };
  files: {
    files: CadFile[];
  };
  viewer: {
    currentFile: CadFile | null;
    tool: ToolType;
    scale: number;
    rotation: number;
    panX: number;
    panY: number;
  };
}
