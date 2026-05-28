import { jsPDF } from 'jspdf';

export class ExportService {
  async exportToPDF(canvasId: string, filename: string = 'cad-drawing.pdf'): Promise<void> {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    const canvasData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(canvasData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(filename);
  }

  async exportToImage(canvasId: string, format: 'png' | 'jpeg' = 'png', filename?: string): Promise<void> {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
      throw new Error('Canvas not found');
    }

    const link = document.createElement('a');
    link.download = filename || `cad-drawing.${format}`;
    link.href = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.95 : undefined);
    link.click();
  }

  async exportToSVG(entities: any[], bounds: any): Promise<string> {
    const { minX, minY, maxX, maxY } = bounds;
    const width = maxX - minX;
    const height = maxY - minY;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${minX} ${minY} ${width} ${height}">`;
    
    entities.forEach(entity => {
      if (entity.type === 'LINE' && entity.points) {
        const [p1, p2] = entity.points;
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="${entity.color || '#000'}" stroke-width="1"/>`;
      } else if (entity.type === 'CIRCLE' && entity.center && entity.radius) {
        svg += `<circle cx="${entity.center.x}" cy="${entity.center.y}" r="${entity.radius}" fill="none" stroke="${entity.color || '#000'}" stroke-width="1"/>`;
      }
    });
    
    svg += '</svg>';
    return svg;
  }

  downloadSVG(svgContent: string, filename: string = 'cad-drawing.svg'): void {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();