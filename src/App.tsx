import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { store } from './store';
import { useAppSelector } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Viewer from './pages/Viewer';
import TestPage from './pages/TestPage';
import './index.css';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.user);

  return (
    <Routes>
      <Route
        path="/"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/viewer"
        element={isAuthenticated ? <Viewer /> : <Navigate to="/" replace />}
      />
      <Route
        path="/test"
        element={<TestPage />}
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <Router>
          <AppContent />
        </Router>
      </ConfigProvider>
    </Provider>
  );
};

export default App;