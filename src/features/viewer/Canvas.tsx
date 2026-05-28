import React, { useRef, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../store';
import { setPan, setZoom, addMeasurement } from '../../store/slices/viewer';

const Canvas: React.FC = () => {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { zoom, pan, currentTool, showGrid, rotation } = useAppSelector(state => state.viewer);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [measurePoints, setMeasurePoints] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 设置画布尺寸
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      draw();
    };
    resize();
    window.addEventListener('resize', resize);

    return () => window.removeEventListener('resize', resize);
  }, [zoom, pan, showGrid, rotation]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 平移和缩放
    ctx.translate(canvas.width / 2 + pan.x, canvas.height / 2 + pan.y);
    ctx.scale(zoom, zoom);
    ctx.rotate((rotation * Math.PI) / 180);

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1 / zoom;
      const gridSize = 50;
      const startX = -canvas.width / 2 - pan.x;
      const startY = -canvas.height / 2 - pan.y;
      
      for (let x = startX - (startX % gridSize); x < canvas.width / 2 - pan.x; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -canvas.height);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = startY - (startY % gridSize); y < canvas.height / 2 - pan.y; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-canvas.width, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // 绘制示例CAD图纸
    drawSampleCAD(ctx);

    // 绘制测量点
    if (measurePoints.length > 0) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2 / zoom;
      ctx.fillStyle = '#ef4444';
      
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
    }

    ctx.restore();
  };

  const drawSampleCAD = (ctx: CanvasRenderingContext2D) => {
    // 绘制简单的CAD图纸示例
    ctx.strokeStyle = '#1f2937';
    ctx.lineWidth = 2 / zoom;
    
    // 矩形
    ctx.beginPath();
    ctx.rect(-200, -150, 400, 300);
    ctx.stroke();
    
    // 圆形
    ctx.beginPath();
    ctx.arc(0, 0, 100, 0, 2 * Math.PI);
    ctx.stroke();
    
    // 对角线
    ctx.beginPath();
    ctx.moveTo(-200, -150);
    ctx.lineTo(200, 150);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(200, -150);
    ctx.lineTo(-200, 150);
    ctx.stroke();
  };

  const getCanvasCoords = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2 - pan.x) / zoom;
    const y = (e.clientY - rect.top - canvas.height / 2 - pan.y) / zoom;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTool === 'PAN') {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else if (currentTool === 'DISTANCE' || currentTool === 'AREA') {
      const coords = getCanvasCoords(e);
      const newPoints = [...measurePoints, coords];
      setMeasurePoints(newPoints);
      
      if (newPoints.length >= 2) {
        const dx = newPoints[1].x - newPoints[0].x;
        const dy = newPoints[1].y - newPoints[0].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        dispatch(addMeasurement({
          type: 'DISTANCE',
          value: distance,
          unit: 'px',
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