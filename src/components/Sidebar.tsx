import React from 'react';
import { Layout, Menu } from 'antd';
import { FolderOpenOutlined, SettingOutlined, StarOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <FolderOpenOutlined />,
      label: '我的文件',
    },
    {
      key: 'favorites',
      icon: <StarOutlined />,
      label: '收藏夹',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  return (
    <Sider width={240} className="bg-white border-r">
      <div className="p-4">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            if (key.startsWith('/')) {
              navigate(key);
            }
          }}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;