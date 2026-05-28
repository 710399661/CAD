import React, { useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setPan, setZoom, addMeasurement } from '../../store/slices/viewer';
import { CADDocument, cadParser } from '../../utils/cadParser';

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, pan, currentTool, showGrid, rotation } = useAppSelector(state => state.viewer);
  const { currentFile } = useAppSelector(state => state.files);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [measurePoints, setMeasurePoints] = useState<Array<{ x: number; y: number }>>([]);
  const [cadDocument, setCadDocument] = useState<CADDocument | null>(null);

  useEffect(() => {
    if (currentFile) {
      loadCADFile();
    }
  }, [currentFile]);

  const loadCADFile = async () => {
    if (!currentFile || !currentFile.url) return;
    
    try {
      const response = await fetch(currentFile.url);
      const blob = await response.blob();
      const file = new File([blob], currentFile.name, { type: blob.type });
      const doc = await cadParser.parseFile(file);
      setCadDocument(doc);
    } catch (error) {
      console.error('Failed to load CAD file:', error);
      const sampleDoc = await cadParser.generateSampleCAD();
      setCadDocument(sampleDoc);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      draw();
    };
    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [zoom, pan, showGrid, rotation, cadDocument]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.rotate((rotation * Math.PI) / 180);

    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1 / zoom;
      const gridSize = 50;
      const range = 1000;
      
      for (let x = -range; x <= range; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -range);
        ctx.lineTo(x, range);
        ctx.stroke();
      }
      for (let y = -range; y <= range; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-range, y);
        ctx.lineTo(range, y);
        ctx.stroke();
      }
    }

    if (cadDocument) {
      drawCADDocument(ctx);
    } else {
      drawSampleCAD(ctx);
    }

    drawMeasurements(ctx);

    ctx.restore();
  };

  const drawCADDocument = (ctx: CanvasRenderingContext2D) => {
    if (!cadDocument) return;

    const colors: Record<string, string> = {
      '0': '#1f2937',
      'DIMENSIONS': '#3b82f6',
      'CENTER': '#f59e0b',
    };

    cadDocument.entities.forEach(entity => {
      ctx.strokeStyle = colors[entity.layer] || '#1f2937';
      ctx.lineWidth = 2 / zoom;
      ctx.fillStyle = colors[entity.layer] || '#1f2937';

      switch (entity.type) {
        case 'LINE':
          if (entity.points && entity.points.length >= 2) {
            ctx.beginPath();
            ctx.moveTo(entity.points[0].x, entity.points[0].y);
            ctx.lineTo(entity.points[1].x, entity.points[1].y);
            ctx.stroke();
          }
          break;
        case 'CIRCLE':
          if (entity.center && entity.radius) {
            ctx.beginPath();
            ctx.arc(entity.center.x, entity.center.y, entity.radius, 0, 2 * Math.PI);
            ctx.stroke();
          }
          break;
        case 'ARC':
          if (entity.center && entity.radius && entity.startAngle !== undefined && entity.endAngle !== undefined) {
            ctx.beginPath();
            ctx.arc(entity.center.x, entity.center.y, entity.radius, entity.startAngle, entity.endAngle);
            ctx.stroke();
          }
          break;
      }
    });
  };

  const drawSampleCAD = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2 / zoom;
    
    ctx.beginPath();
    ctx.rect(-200, -150, 400, 300);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-200, -150);
    ctx.lineTo(200, 150);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(200, -150);
    ctx.lineTo(-200, 150);
    ctx.stroke();
  };

  const drawMeasurements = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#ef4444';
    ctx.fillStyle = '#ef4444';
    ctx.lineWidth = 2 / zoom;

    if (measurePoints.length > 0) {
      measurePoints.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5 / zoom, 0, 2 * Math.PI);
        ctx.fill();
        
        if (index > 0) {
          ctx.beginPath();
          ctx.moveTo(measurePoints[index - 1].x, measurePoints[index - 1].y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      });

      if (measurePoints.length > 1 && currentTool === 'AREA') {
        ctx.beginPath();
        ctx.moveTo(measurePoints[0].x, measurePoints[0].y);
        measurePoints.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.closePath();
        ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.stroke();
      }
    }
  };

  const getCanvasCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2 - pan.x) / zoom;
    const y = (e.clientY - rect.top - canvas.height / 2 - pan.y) / zoom;
    return { x, y };
  };

  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const calculateArea = (points: { x: number; y: number }[]) => {
    if (points.length < 3) return 0;
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area / 2);
  };

  const calculateAngle = (p1: { x: number; y: number }, vertex: { x: number; y: number }, p2: { x: number; y: number }) => {
    const v1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
    const v2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
    const dot = v1.x * v2.x + v1.y * v2.y;
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    const cosAngle = dot / (mag1 * mag2);
    return Math.acos(Math.max(-1, Math.min(1, cosAngle))) * (180 / Math.PI);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTool === 'PAN') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (['DISTANCE', 'AREA', 'ANGLE'].includes(currentTool)) {
      const coords = getCanvasCoords(e);
      const newPoints = [...measurePoints, coords];
      setMeasurePoints(newPoints);
      
      if (currentTool === 'DISTANCE' && newPoints.length >= 2) {
        const distance = calculateDistance(newPoints[0], newPoints[1]);
        dispatch(addMeasurement({
          type: 'DISTANCE',
          value: distance,
          unit: 'px',
          points: newPoints,
        }));
        setMeasurePoints([]);
      } else if (currentTool === 'AREA' && newPoints.length >= 3) {
        const area = calculateArea(newPoints);
        dispatch(addMeasurement({
          type: 'AREA',
          value: area,
          unit: 'px',
          points: newPoints,
        }));
        setMeasurePoints([]);
      } else if (currentTool === 'ANGLE' && newPoints.length >= 3) {
        const angle = calculateAngle(newPoints[0], newPoints[1], newPoints[2]);
        dispatch(addMeasurement({
          type: 'ANGLE',
          value: angle,
          unit: '°',
          points: newPoints,
        }));
        setMeasurePoints([]);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && currentTool === 'PAN') {
      dispatch(setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    dispatch(setZoom(zoom * delta));
  };

  return (
    <div ref={containerRef} className="w-full h-full overflow-hidden bg-gray-100">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="cursor-crosshair"
      />
    </div>
  );
};

export default Canvas;