import React, { useEffect } from 'react';
import { List, Switch, Button, Typography, Divider, Space } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, PlusOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../store';
import { setLayers, updateLayer, addLayer } from '../../store/slices/viewer';
import { Layer } from '../../types';

const { Title, Text } = Typography;

const LayerPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { layers } = useAppSelector(state => state.viewer);

  useEffect(() => {
    // 初始化示例图层
    const sampleLayers: Layer[] = [
      { id: '1', name: '轮廓线', visible: true, locked: false, color: '#1f2937', opacity: 1 },
      { id: '2', name: '标注', visible: true, locked: false, color: '#3b82f6', opacity: 1 },
      { id: '3', name: '填充', visible: true, locked: false, color: '#10b981', opacity: 0.5 },
      { id: '4', name: '中心线', visible: true, locked: true, color: '#f59e0b', opacity: 1 },
    ];
    dispatch(setLayers(sampleLayers));
  }, [dispatch]);

  const handleToggleVisibility = (layer: Layer) => {
    dispatch(updateLayer({ id: layer.id, updates: { visible: !layer.visible } }));
  };

  const handleToggleLock = (layer: Layer) => {
    dispatch(updateLayer({ id: layer.id, updates: { locked: !layer.locked } }));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <Title level={5} style={{ margin: 0 }}>图层</Title>
          <Button type="text" icon={<PlusOutlined />} onClick={() => {
            const newLayer: Layer = {
              id: Date.now().toString(),
              name: `图层 ${layers.length + 1}`,
              visible: true,
              locked: false,
              color: '#000000',
              opacity: 1,
            };
            dispatch(addLayer(newLayer));
          }} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        <List
          dataSource={layers}
          renderItem={(layer) => (
            <List.Item className="hover:bg-gray-50 rounded-lg">
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: layer.color, opacity: layer.visible ? layer.opacity : 0.2 }}
                  />
                  <Text delete={!layer.visible}>{layer.name}</Text>
                </div>
                <Space>
                  <Button
                    type="text"
                    size="small"
                    icon={layer.visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    onClick={() => handleToggleVisibility(layer)}
                  />
                  <Button
                    type="text"
                    size="small"
                    icon={layer.locked ? <LockOutlined /> : <UnlockOutlined />}
                    onClick={() => handleToggleLock(layer)}
                  />
                </Space>
              </div>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default LayerPanel;