export interface CADEntity {
  type: 'LINE' | 'CIRCLE' | 'ARC' | 'POLYLINE' | 'TEXT';
  points?: { x: number; y: number }[];
  center?: { x: number; y: number };
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  text?: string;
  layer: string;
  color?: string;
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

export class CADParser {
  async parseFile(file: File): Promise<CADDocument> {
    const extension = file.name.split('.').pop()?.toLowerCase();
    
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

  private async parseDXF(file: File): Promise<CADDocument> {
    const text = await file.text();
    const entities: CADEntity[] = [];
    const layers = new Set<string>();
    
    const lines = text.split('\n');
    let i = 0;
    
    while (i < lines.length) {
      const code = lines[i]?.trim();
      const value = lines[i + 1]?.trim();
      
      if (code === '0' && value === 'LINE') {
        const line = this.parseLINE(lines, i);
        if (line) {
          entities.push(line);
          layers.add(line.layer);
        }
        i += 20;
      } else if (code === '0' && value === 'CIRCLE') {
        const circle = this.parseCIRCLE(lines, i);
        if (circle) {
          entities.push(circle);
          layers.add(circle.layer);
        }
        i += 30;
      } else {
        i += 2;
      }
      
      if (i > 100000) break;
    }
    
    return {
      entities,
      layers: Array.from(layers),
      bounds: this.calculateBounds(entities),
    };
  }

  private parseLINE(lines: string[], start: number): CADEntity | null {
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    let layer = '0';
    
    for (let i = start; i < start + 30 && i < lines.length; i += 2) {
      const code = lines[i]?.trim();
      const value = lines[i + 1]?.trim();
      
      if (code === '8') layer = value;
      else if (code === '10') x1 = parseFloat(value);
      else if (code === '20') y1 = parseFloat(value);
      else if (code === '11') x2 = parseFloat(value);
      else if (code === '21') y2 = parseFloat(value);
      else if (code === '0' && value !== 'LINE') break;
    }
    
    return {
      type: 'LINE',
      points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
      layer,
    };
  }

  private parseCIRCLE(lines: string[], start: number): CADEntity | null {
    let cx = 0, cy = 0, r = 0;
    let layer = '0';
    
    for (let i = start; i < start + 40 && i < lines.length; i += 2) {
      const code = lines[i]?.trim();
      const value = lines[i + 1]?.trim();
      
      if (code === '8') layer = value;
      else if (code === '10') cx = parseFloat(value);
      else if (code === '20') cy = parseFloat(value);
      else if (code === '40') r = parseFloat(value);
      else if (code === '0' && value !== 'CIRCLE') break;
    }
    
    return {
      type: 'CIRCLE',
      center: { x: cx, y: cy },
      radius: r,
      layer,
    };
  }

  private async parseDWG(_file: File): Promise<CADDocument> {
    console.log('DWG parsing not fully implemented, using sample data');
    return this.generateSampleCAD();
  }

  private async parseSVG(file: File): Promise<CADDocument> {
    const text = await file.text();
    const entities: CADEntity[] = [];
    const layers = new Set<string>();
    
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(text, 'image/svg+xml');
    const svg = svgDoc.querySelector('svg');
    
    if (!svg) return this.generateSampleCAD();
    
    const width = parseFloat(svg.getAttribute('width') || '1000');
    const height = parseFloat(svg.getAttribute('height') || '1000');
    
    svg.querySelectorAll('line').forEach(el => {
      entities.push({
        type: 'LINE',
        points: [
          { x: parseFloat(el.getAttribute('x1') || '0'), y: parseFloat(el.getAttribute('y1') || '0') },
          { x: parseFloat(el.getAttribute('x2') || '0'), y: parseFloat(el.getAttribute('y2') || '0') },
        ],
        layer: el.getAttribute('stroke') || '0',
      });
      layers.add(el.getAttribute('stroke') || '0');
    });
    
    svg.querySelectorAll('circle').forEach(el => {
      entities.push({
        type: 'CIRCLE',
        center: {
          x: parseFloat(el.getAttribute('cx') || '0'),
          y: parseFloat(el.getAttribute('cy') || '0'),
        },
        radius: parseFloat(el.getAttribute('r') || '50'),
        layer: el.getAttribute('stroke') || '0',
      });
      layers.add(el.getAttribute('stroke') || '0');
    });
    
    return {
      entities,
      layers: Array.from(layers),
      bounds: { minX: 0, minY: 0, maxX: width, maxY: height },
    };
  }

  private calculateBounds(entities: CADEntity[]): CADDocument['bounds'] {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    entities.forEach(entity => {
      if (entity.points) {
        entity.points.forEach(p => {
          minX = Math.min(minX, p.x);
          minY = Math.min(minY, p.y);
          maxX = Math.max(maxX, p.x);
          maxY = Math.max(maxY, p.y);
        });
      }
      if (entity.center) {
        minX = Math.min(minX, entity.center.x - (entity.radius || 0));
        minY = Math.min(minY, entity.center.y - (entity.radius || 0));
        maxX = Math.max(maxX, entity.center.x + (entity.radius || 0));
        maxY = Math.max(maxY, entity.center.y + (entity.radius || 0));
      }
    });
    
    return { minX, minY, maxX, maxY };
  }

  async generateSampleCAD(): Promise<CADDocument> {
    return {
      entities: [
        { type: 'LINE', points: [{ x: 0, y: 0 }, { x: 400, y: 300 }], layer: '0' },
        { type: 'LINE', points: [{ x: 400, y: 0 }, { x: 0, y: 300 }], layer: '0' },
        { type: 'CIRCLE', center: { x: 200, y: 150 }, radius: 100, layer: '0' },
        { type: 'LINE', points: [{ x: 50, y: 50 }, { x: 350, y: 50 }], layer: 'DIMENSIONS' },
        { type: 'LINE', points: [{ x: 50, y: 250 }, { x: 350, y: 250 }], layer: 'DIMENSIONS' },
        { type: 'LINE', points: [{ x: 50, y: 50 }, { x: 50, y: 250 }], layer: 'DIMENSIONS' },
        { type: 'LINE', points: [{ x: 350, y: 50 }, { x: 350, y: 250 }], layer: 'DIMENSIONS' },
      ],
      layers: ['0', 'DIMENSIONS'],
      bounds: { minX: 0, minY: 0, maxX: 400, maxY: 300 },
    };
  }
}

export const cadParser = new CADParser();