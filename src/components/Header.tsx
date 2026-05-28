import React from 'react';
import { Layout, Typography, Button, Avatar, Dropdown, MenuProps } from 'antd';
import { HomeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store';
import { logout } from '../store/slices/user';
import { resetViewer } from '../store/slices/viewer';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.user);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetViewer());
    navigate('/');
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <UserOutlined /> 个人中心
        </span>
      ),
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2" onClick={handleLogout}>
          <LogoutOutlined /> 退出登录
        </span>
      ),
      danger: true,
    },
  ];

  return (
    <AntHeader className="flex items-center justify-between px-6 bg-white border-b shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CAD</span>
          </div>
          <Title level={4} style={{ margin: 0 }}>CAD看图王</Title>
        </div>
        {user && (
          <Button
            type="text"
            icon={<HomeOutlined />}
            onClick={() => navigate('/dashboard')}
          >
            首页
          </Button>
        )}
      </div>
      {user && (
        <Dropdown menu={{ items }} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg">
            <Avatar icon={<UserOutlined />} />
            <span className="text-gray-700">{user.name}</span>
          </div>
        </Dropdown>
      )}
    </AntHeader>
  );
};

export default Header;