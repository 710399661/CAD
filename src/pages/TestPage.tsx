import React from 'react';
import { Typography, Button, Card, message } from 'antd';

const { Title, Text } = Typography;

const TestPage: React.FC = () => {
  const handleClick = () => {
    console.log('测试按钮被点击了！');
    message.success('按钮可以点击！');
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <Title level={2}>测试页面</Title>
      <Card>
        <Text>这是一个简单的测试页面</Text>
        <div style={{ marginTop: '20px' }}>
          <Button type="primary" size="large" onClick={handleClick}>
            点击测试
          </Button>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Button size="large" onClick={() => console.log('第二个按钮')}>
            第二个按钮
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestPage;