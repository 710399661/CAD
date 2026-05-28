import React from 'react';
import { Button, Space, Tooltip, Divider, Dropdown } from 'antd';
import {
  SelectOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  FullscreenOutlined,
  RotateRightOutlined,
  BorderOutlined,
  BorderLeftOutlined,
  LineChartOutlined,
  AreaChartOutlined,
  FontSizeOutlined,
  PicCenterOutlined,
  DownloadOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../store';
import {
  setTool,
  setZoom,
  setRotation,
  toggleGrid,
} from '../store/slices/viewer';
import { ToolType } from '../types';

const Toolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentTool, zoom, showGrid, rotation } = useAppSelector(state => state.viewer);

  const tools: Array<{ type: ToolType; icon: React.ReactNode; label: string }> = [
    { type: 'SELECT', icon: <SelectOutlined />, label: '选择' },
    { type: 'PAN', icon: <BorderLeftOutlined rotate={45} />, label: '平移' },
    { type: 'DISTANCE', icon: <LineChartOutlined />, label: '距离测量' },
    { type: 'AREA', icon: <AreaChartOutlined />, label: '面积测量' },
    { type: 'ANGLE', icon: <BorderOutlined />, label: '角度测量' },
    { type: 'TEXT', icon: <FontSizeOutlined />, label: '文字标注' },
  ];

  const exportItems = [
    {
      key: 'pdf',
      label: '导出为 PDF',
    },
    {
      key: 'png',
      label: '导出为 PNG',
    },
    {
      key: 'jpg',
      label: '导出为 JPG',
    },
    {
      key: 'svg',
      label: '导出为 SVG',
    },
  ];

  const handleExport = ({ key }: { key: string }) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.error('Canvas not found');
      return;
    }

    const link = document.createElement('a');
    const timestamp = new Date().getTime();
    
    switch (key) {
      case 'png':
        link.download = `cad-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        break;
      case 'jpg':
      case 'jpeg':
        link.download = `cad-${timestamp}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
        break;
      case 'pdf':
        import('jspdf').then(({ jsPDF }) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`cad-${timestamp}.pdf`);
        });
        break;
    }
  };

  return (
    <div className="bg-white border-b px-4 py-2 flex items-center gap-1">
      <Space size="small">
        {tools.map(tool => (
          <Tooltip key={tool.type} title={tool.label}>
            <Button
              type={currentTool === tool.type ? 'primary' : 'default'}
              icon={tool.icon}
              onClick={() => dispatch(setTool(tool.type))}
            />
          </Tooltip>
        ))}
      </Space>

      <Divider type="vertical" className="mx-2" />

      <Space size="small">
        <Tooltip title="缩小">
          <Button
            icon={<ZoomOutOutlined />}
            onClick={() => dispatch(setZoom(zoom * 0.8))}
          />
        </Tooltip>
        <Tooltip title="放大">
          <Button
            icon={<ZoomInOutlined />}
            onClick={() => dispatch(setZoom(zoom * 1.25))}
          />
        </Tooltip>
        <Tooltip title="顺时针旋转90°">
          <Button
            icon={<RotateRightOutlined />}
            onClick={() => dispatch(setRotation(rotation + 90))}
          />
        </Tooltip>
        <Tooltip title="全屏">
          <Button icon={<FullscreenOutlined />} onClick={() => {
            document.documentElement.requestFullscreen?.();
          }} />
        </Tooltip>
        <Tooltip title="网格">
          <Button
            type={showGrid ? 'primary' : 'default'}
            icon={<PicCenterOutlined />}
            onClick={() => dispatch(toggleGrid())}
          />
        </Tooltip>
      </Space>

      <div className="flex-1" />

      <Space size="small">
        <Dropdown menu={{ items: exportItems, onClick: handleExport }} placement="bottomRight">
          <Button icon={<DownloadOutlined />}>
            导出
          </Button>
        </Dropdown>
        <Tooltip title="打印">
          <Button icon={<PrinterOutlined />} onClick={() => window.print()} />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Toolbar;