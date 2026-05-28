import React, { useRef } from 'react';
import { List, Button, Card, Typography, Space, Tag, Empty, message } from 'antd';
import { UploadOutlined, FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { setCurrentFile, addFile, removeFile } from '../store/slices/files';
import { CadFile } from '../types';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { files } = useAppSelector(state => state.files);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const newFile: CadFile = {
        id: Date.now().toString() + Math.random(),
        userId: '1',
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: file.size,
        url: URL.createObjectURL(file),
        createdAt: new Date().toISOString(),
      };
      dispatch(addFile(newFile));
      message.success(`文件 "${file.name}" 上传成功！`);
    });

    // 清空input以便可以重复选择同一文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileClick = (file: CadFile) => {
    dispatch(setCurrentFile(file));
    navigate('/viewer');
  };

  const handleDeleteFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    dispatch(removeFile(id));
    message.success('文件已删除');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="mb-6">
            <Title level={2}>我的文件</Title>
            <div className="flex items-center justify-between">
              <Text type="secondary">管理您的CAD图纸文件</Text>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".dwg,.dxf,.dgn"
                  style={{ display: 'none' }}
                  multiple
                />
                <Button 
                  type="primary" 
                  icon={<UploadOutlined />} 
                  size="large"
                  onClick={() => fileInputRef.current?.click()}
                >
                  上传文件
                </Button>
              </div>
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
                        key="delete"
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
                description="暂无文件，请上传CAD图纸"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;