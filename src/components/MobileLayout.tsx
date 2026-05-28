import React, { useState, useEffect } from 'react';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

interface MobileLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  header?: React.ReactNode;
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ children, sidebar, header }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {header && (
          <div className="sticky top-0 z-10 bg-white shadow-sm">
            <div className="flex items-center justify-between p-4">
              {header}
              <Button
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
              />
            </div>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
        <Drawer
          title="菜单"
          placement="right"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={280}
        >
          {sidebar}
        </Drawer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {header && (
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          {header}
        </div>
      )}
      <div className="flex">
        <div className="w-60 hidden md:block">
          {sidebar}
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;