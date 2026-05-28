import { CADDocument, CADEntity } from '../types';

export class CADParser {
  async parseFile(file: any): Promise<CADDocument> {
    const extension = file.name?.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'dxf':
        return this.parseDXF(file);
      case 'dwg':
        return this.parseDWG(file);
      case 'svg':
        return this.parseSVG(file);
      default:
        return this.generateSampleCAD();
    }
  }

  private async parseDXF(file: any): Promise<CADDocument> {
    return this.generateSampleCAD();
  }

  private async parseDWG(file: any): Promise<CADDocument> {
    return this.generateSampleCAD();
  }

  private async parseSVG(file: any): Promise<CADDocument> {
    return this.generateSampleCAD();
  }

  async generateSampleCAD(): Promise<CADDocument> {
    return {
      entities: [
        { type: 'LINE', points: [{ x: 0, y: 0 }, { x: 400, y: 300 }], layer: '0' },
        { type: 'LINE', points: [{ x: 400, y: 0 }, { x: 0, y: 300 }], layer: '0' },
        { type: 'CIRCLE', center: { x: 200, y: 150 }, radius: 100, layer: '0' },
        { type: 'POLYLINE', points: [
          { x: 50, y: 50 },
          { x: 150, y: 50 },
          { x: 150, y: 100 },
          { x: 50, y: 100 },
          { x: 50, y: 50 }
        ], layer: '0' }
      ],
      layers: ['0', 'DIMENSIONS'],
      bounds: { minX: 0, minY: 0, maxX: 400, maxY: 300 },
    };
  }
}

export const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const calculateArea = (points: { x: number; y: number }[]): number => {
  if (points.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const j = (i + 1) % points.length;
    area += points[i].x * points[j].y;
    area -= points[j].x * points[i].y;
  }
  return Math.abs(area / 2);
};

export const calculateAngle = (p1: { x: number; y: number }, vertex: { x: number; y: number }, p2: { x: number; y: number }): number => {
  const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
  const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  const cosAngle = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
};
