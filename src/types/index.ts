export interface User {
  id: stringexport interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: stringexport interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface File {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Annotation {
  id: string;
  fileId: string;
  type: 'TEXT' | 'DIMENSION' | 'SHAPE';
  content?: string;
  position: { x: number; y: number }[];
  style?: Record<string, unknown>;
  createdAt: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
}

export interface ViewerState {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface File {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Annotation {
  id: string;
  fileId: string;
  type: 'TEXT' | 'DIMENSION' | 'SHAPE';
  content?: string;
  position: { x: number; y: number }[];
  style?: Record<string, unknown>;
  createdAt: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
}

export interface ViewerState {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  activeTool: 'select' | 'pan' | 'zoom' | 'measure' |export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface File {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Annotation {
  id: string;
  fileId: string;
  type: 'TEXT' | 'DIMENSION' | 'SHAPE';
  content?: string;
  position: { x: number; y: number }[];
  style?: Record<string, unknown>;
  createdAt: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
}

export interface ViewerState {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  activeTool: 'select' | 'pan' | 'zoom' | 'measure' | 'annotate';
  selectedLayer?: string;
}

export interface MeasurePoint {
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface File {
  id: string;
  userId: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Annotation {
  id: string;
  fileId: string;
  type: 'TEXT' | 'DIMENSION' | 'SHAPE';
  content?: string;
  position: { x: number; y: number }[];
  style?: Record<string, unknown>;
  createdAt: string;
}

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  color: string;
}

export interface ViewerState {
  scale: number;
  rotation: number;
  position: { x: number; y: number };
  activeTool: 'select' | 'pan' | 'zoom' | 'measure' | 'annotate';
  selectedLayer?: string;
}

export interface MeasurePoint {
  x: number;
  y: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {