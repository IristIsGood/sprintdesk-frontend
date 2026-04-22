import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProjectsPage from './pages/ProjectsPage';
import BoardPage from './pages/BoardPage';

// 保护路由 — 没有 token 就跳回登录页
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/projects" element={
          <PrivateRoute><ProjectsPage /></PrivateRoute>
        } />
        <Route path="/projects/:id" element={
          <PrivateRoute><BoardPage /></PrivateRoute>
        } />
        {/* 默认跳到项目列表 */}
        <Route path="*" element={<Navigate to="/projects" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;