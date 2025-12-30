import React from "react";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
import { ConfigProvider,Spin } from "antd";
import MainLayout from "./components/layout";
import Home from "./components/home";
import AlbumComponent from "./components/album";
import CardComponent from "./components/card";
import Login from './components/login'
import VisitorManagement from "./components/visitorManage"; 
import { authAPI } from "./services/api";


import "./App.css";

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    checkAuth();
  }, []);

  // 检查认证状态
  const checkAuth = async () => {
    const token = localStorage.getItem('ppmq_albums_token');
    
    if (token) {
      try {
        // 验证token是否有效
        const response = await authAPI.verifyToken();
        if (response?.success) {
          // 获取用户信息
          const userResponse = await authAPI.getMe()
          setUser(userResponse.user);
        }
      } catch (error) {
        // token无效，清除
        localStorage.removeItem('ppmq_albums_token');
        localStorage.removeItem('adminUser');
      }
    }
    
    setLoading(false);
  };

  // 处理登录
  const handleLogin = async (username, password) => {
    try {
      const response = await authAPI.login( username, password );
      
      if (response?.success) {
        const { token, user } = response;
        
        // 保存到localStorage（只对管理员）
        if (user.role === 'admin') {
          localStorage.setItem('ppmq_albums_token', token);
          localStorage.setItem('adminUser', JSON.stringify(user));
        }
        
        setUser(user);
        return { success: true, user};
      } else {
        return { success: false, message: response?.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.message || '登录失败' 
      };
    }
  };

  // 处理登出
  const handleLogout = () => {
    localStorage.removeItem('ppmq_albums_token');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  // 保护路由组件
  const ProtectedRoute = ({ children}) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }

    return children;
  };

  // 公共路由组件（已登录用户访问会重定向）
  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  return (
    <ConfigProvider>
      <BrowserRouter>
        <Routes>
          {/* 登录页面（公共路由） */}
          <Route path="/login" element={
            <PublicRoute>
              <Login onLogin={handleLogin} />
            </PublicRoute>
          } />
          
          {/* 主应用路由（需要登录） */}
          <Route path="/" element={
            <ProtectedRoute>
              <MainLayout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }>
            <Route index element={<Home user={user}/>} />
            <Route path="albums" element={<AlbumComponent />} />
            <Route path="cards" element={<CardComponent />} />
            <Route path="visitors" element={
              // <ProtectedRoute adminOnly>
                <VisitorManagement />
              // </ProtectedRoute>
            } />
          </Route>
          
          {/* 未匹配的路由重定向 */}
          <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
          {/* <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="albums" element={<AlbumComponent />} />
            <Route path="cards" element={<CardComponent />} />
          </Route> */}
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
