import React, { useState } from 'react';
import { Layout, List, Button, Upload, Card, Typography, Space, Tag, Empty } from 'antd';
import { UploadOutlined, FileTextOutlined, FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentFile, addFile, removeFile } from '../store/slices/files';
import { CadFile } from '../types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { files } = useAppSelector(state => state.files);

  const handleFileUpload = (file: File) => {
    const newFile: CadFile = {
      id: Date.now().toString(),
      userId: '1',
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      size: file.size,
      url: URL.createObjectURL(file),
      createdAt: new Date().toISOString(),
    };
    dispatch(addFile(newFile));
    return false;
  };

  const handleFileClick = (file: CadFile) => {
    dispatch(setCurrentFile(file));
    navigate('/viewer');
  };

  const handleDeleteFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeFile(id));
  };

  return (
    <Layout className="min-h-screen">
      <Header />
      <Layout>
        <Sidebar />
        <Content className="p-6 bg-gray-50">
          <div className="mb-6">
            <Title level={2}>我的文件</Title>
            <div className="flex items-center justify-between">
              <Text type="secondary">管理您的CAD图纸文件</Text>
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept=".dwg,.dxf,.dgn"
              >
                <Button type="primary" icon={<UploadOutlined />} size="large">
                  上传文件
                </Button>
              </Upload>
            </div>
          </div>

          <Card>
            {files.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={files}
                renderItem={(file) => (
                  <List.Item
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleFileClick(file)}
                    actions={[
                      <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={(e) => handleDeleteFile(e, file.id)}
                      >
                        删除
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<FileTextOutlined className="text-4xl text-blue-500" />}
                      title={<span className="font-medium">{file.name}</span>}
                      description={
                        <Space>
                          <Tag color="blue">{file.type}</Tag>
                          <Text type="secondary">{(file.size / 1024).toFixed(2)} KB</Text>
                          <Text type="secondary">{new Date(file.createdAt).toLocaleDateString()}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                image={<FolderOpenOutlined className="text-6xl text-gray-300" />}
                description="暂无文件，请上传CAD图纸"
                imageStyle={{ height: 60 }}
              />
            )}
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;