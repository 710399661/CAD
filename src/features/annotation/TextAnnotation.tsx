import React, { useState } from 'react';
import { Card, Input, Button, Typography } from 'antd';

const { Title } = Typography;

const TextAnnotation: React.FC = () => {
  const [text, setText] = useState('');

  const handleAddAnnotation = () => {
    if (text) {
      // 这里可以触发添加标注的逻辑
      setText('');
    }
  };

  return (
    <Card title="文字标注">
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="输入标注文字"
        rows={4}
        className="mb-3"
      />
      <Button type="primary" block onClick={handleAddAnnotation} disabled={!text}>
        添加标注
      </Button>
    </Card>
  );
};

export default TextAnnotation;