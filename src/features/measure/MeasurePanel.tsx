import React from 'react';
import { Card, Typography, Button, Space } from 'antd';
import { useAppSelector, useAppDispatch } from '../../store';
import { clearMeasurements } from '../../store/slices/viewer';

const { Text } = Typography;

const MeasurePanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { measurements } = useAppSelector(state => state.viewer);

  const getMeasurementInfo = (m: any) => {
    switch (m.type) {
      case 'DISTANCE':
        return `距离: ${m.value.toFixed(2)} ${m.unit}`;
      case 'AREA':
        return `面积: ${m.value.toFixed(2)} 平方${m.unit}`;
      case 'ANGLE':
        return `角度: ${m.value.toFixed(2)}°`;
      default:
        return '';
    }
  };

  return (
    <Card title="测量工具">
      <Space direction="vertical" style={{ width: '100%' }}>
        <div>
          <Text type="secondary">测量结果:</Text>
        </div>
        
        {measurements.length > 0 ? (
          measurements.map((m, index) => (
            <Card key={index} size="small" style={{ marginTop: 8 }}>
              <Text strong>{getMeasurementInfo(m)}</Text>
              {m.type === 'DISTANCE' && m.points && m.points.length === 2 && (
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  起点: (${m.points[0].x.toFixed(1)}, ${m.points[0].y.toFixed(1)})
                  <br />
                  终点: (${m.points[1].x.toFixed(1)}, ${m.points[1].y.toFixed(1)})
                </div>
              )}
              {m.type === 'AREA' && m.points && (
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  顶点: {m.points.length} 个
                </div>
              )}
              {m.type === 'ANGLE' && m.points && m.points.length === 3 && (
                <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
                  顶点: (${m.points[1].x.toFixed(1)}, ${m.points[1].y.toFixed(1)})
                </div>
              )}
            </Card>
          ))
        ) : (
          <Text type="secondary">暂无测量结果</Text>
        )}

        {measurements.length > 0 && (
          <Button 
            type="text" 
            danger 
            onClick={() => dispatch(clearMeasurements())}
            style={{ marginTop: 8 }}
          >
            清除测量
          </Button>
        )}

        <div style={{ marginTop: 16, borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            使用说明:
            <br />1. 选择测量工具
            <br />2. 在画布上点击测量
            <br />3. 距离: 点击两点
            <br />4. 面积: 点击多个点形成多边形
            <br />5. 角度: 点击三点测量角度
          </Text>
        </div>
      </Space>
    </Card>
  );
};

export default MeasurePanel;