import React from 'react';
import { Card, Typography } from 'antd';
import { useAppSelector } from '../../store';

const { Title, Text } = Typography;

const DistanceTool: React.FC = () => {
  const { measurements } = useAppSelector(state => state.viewer);

  return (
    <Card title="测量结果">
      {measurements.length > 0 ? (
        measurements.map((m, index) => (
          <div key={index} className="mb-2">
            <Text strong>距离: </Text>
            <Text>{m.value.toFixed(2)} {m.unit}</Text>
          </div>
        ))
      ) : (
        <Text type="secondary">点击画布测量距离</Text>
      )}
    </Card>
  );
};

export default DistanceTool;