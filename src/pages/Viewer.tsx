import React from 'react';
import { Layout, Typography, Tabs } from 'antd';
import { useAppSelector } from '../store';
import Header from '../components/Header';
import Toolbar from '../components/Toolbar';
import Canvas from '../features/viewer/Canvas';
import LayerPanel from '../features/layers/LayerPanel';
import MeasurePanel from '../features/measure/MeasurePanel';
import TextAnnotation from '../features/annotation/TextAnnotation';

const { Content, Sider } = Layout;
const { Title } = Typography;

const Viewer: React.FC = () => {
  const { currentFile } = useAppSelector(state => state.files);

  if (!currentFile) {
    return (
      <Layout className="min-h-screen">
        <Header />
        <Content className="flex items-center justify-center">
          <div className="text-center">
            <Title level={3} type="secondary">请先选择文件</Title>
          </div>
        </Content>
      </Layout>
    );
  }

  const tabItems = [
    {
      key: 'layers',
      label: '图层管理',
      children: <LayerPanel />,
    },
    {
      key: 'measure',
      label: '测量工具',
      children: <MeasurePanel />,
    },
    {
      key: 'annotation',
      label: '标注工具',
      children: <TextAnnotation />,
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout>
        <Content className="flex flex-col bg-gray-100">
          <Toolbar />
          <div className="flex-1 overflow-hidden">
            <Canvas />
          </div>
        </Content>
        <Sider width={320} className="bg-white border-l">
          <Tabs defaultActiveKey="layers" items={tabItems} className="p-4" />
        </Sider>
      </Layout>
    </Layout>
  );
};

export default Viewer;