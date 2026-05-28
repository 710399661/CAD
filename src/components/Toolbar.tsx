import React from 'react';
import { Button, Space, Tooltip, Divider } from 'antd';
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
  const { currentTool, zoom, showGrid } = useAppSelector(state => state.viewer);

  const tools: Array<{ type: ToolType; icon: React.ReactNode; label: string }> = [
    { type: 'SELECT', icon: <SelectOutlined />, label: '选择' },
    { type: 'PAN', icon: <BorderLeftOutlined rotate={45} />, label: '平移' },
    { type: 'DISTANCE', icon: <LineChartOutlined />, label: '距离测量' },
    { type: 'AREA', icon: <AreaChartOutlined />, label: '面积测量' },
    { type: 'TEXT', icon: <FontSizeOutlined />, label: '文字标注' },
    { type: 'DIMENSION', icon: <BorderOutlined />, label: '尺寸标注' },
  ];

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
        <Tooltip title="旋转">
          <Button
            icon={<RotateRightOutlined />}
            onClick={() => dispatch(setRotation(90))}
          />
        </Tooltip>
        <Tooltip title="全屏">
          <Button icon={<FullscreenOutlined />} />
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
        <Tooltip title="导出">
          <Button icon={<DownloadOutlined />} />
        </Tooltip>
        <Tooltip title="打印">
          <Button icon={<PrinterOutlined />} />
        </Tooltip>
      </Space>
    </div>
  );
};

export default Toolbar;