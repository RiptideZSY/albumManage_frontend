import React, { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar } from "antd";
import { 
  BookOutlined, 
  HomeOutlined, 
  IdcardOutlined, 
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import logo from "../assets/logo.jpg";

const { Sider, Content } = Layout;

function MainLayout({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 根据当前路径设置选中的菜单项
  const selectedKeys = () => {
    const path = location.pathname;
    if (path === "/") return ["1"];
    if (path === "/albums") return ["2"];
    if (path === "/cards") return ["3"];
    if (path.includes("/visitors")) return ["4"];
    return ["1"];
  };

  // 根据用户角色生成菜单项
  const getMenuItems = () => {
    const baseItems = [
      {
        key: "1",
        icon: <HomeOutlined />,
        label: <Link to="/">首页</Link>,
      },
      {
        key: "2",
        icon: <BookOutlined />,
        label: <Link to="/albums">专辑管理</Link>,
      },
      {
        key: "3",
        icon: <IdcardOutlined />,
        label: <Link to="/cards">小卡管理</Link>,
      },
    ];

    // 如果是管理员，添加访客管理菜单
    if (user?.role === 'admin') {
      baseItems.push({
        key: "4",
        icon: <TeamOutlined />,
        label: <Link to="/visitors">访客管理</Link>,
      });
    }

    return baseItems;
  };

  // 用户下拉菜单项
  // const userMenuItems = [
  //   {
  //     key: 'userInfo',
  //     label: (
  //       <div style={{ padding: '8px 12px', minWidth: 160 }}>
  //         <div style={{ fontWeight: 'bold' }}>{user?.username}</div>
  //         <div style={{ color: '#666', fontSize: 12 }}>
  //           {user?.role === 'admin' ? '管理员' : '访客'}
  //         </div>
  //         {user?.validUntil && (
  //           <div style={{ color: '#999', fontSize: 11, marginTop: 4 }}>
  //             有效期至: {new Date(user.validUntil).toLocaleDateString()}
  //           </div>
  //         )}
  //       </div>
  //     ),
  //     disabled: true,
  //   },
  //   {
  //     type: 'divider'
  //   },
  //   {
  //     key: 'profile',
  //     icon: <SettingOutlined />,
  //     label: '个人设置',
  //     onClick: () => {
  //       // 可以跳转到个人设置页面
  //       console.log('个人设置');
  //     }
  //   },
  //   {
  //     type: 'divider'
  //   },
  //   {
  //     key: 'logout',
  //     icon: <LogoutOutlined />,
  //     label: '退出登录',
  //     onClick: onLogout
  //   }
  // ];

  // // 处理访客管理菜单点击
  // const handleVisitorMenuClick = () => {
  //   if (user?.role === 'admin') {
  //     navigate('/visitors');
  //   }
  // };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          background: "linear-gradient(180deg, #001529 0%, #002140 100%)",
          boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
        }}
        width={200}
        collapsedWidth={80}
      >
        {/* Logo 区域 */}
        <div
          style={{
            padding: collapsed ? "16px 8px" : "16px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: 8,
            transition: 'all 0.2s',
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 12,
              whiteSpace: "nowrap",
            }}
          >
            <img 
              src={logo} 
              alt="泡泡摩奇" 
              width={40} 
              height={40}
              style={{ 
                borderRadius: 4,
                objectFit: 'cover'
              }}
            />
            {!collapsed && (
              <span style={{ 
                color: "#fff", 
                fontSize: 18, 
                fontWeight: "bold",
                letterSpacing: 1
              }}>
                泡泡摩奇
              </span>
            )}
          </div>
        </div>
        
        {/* 用户信息区域（侧边栏展开时显示） */}
        {!collapsed && user && (
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <Avatar 
                size={32}
                style={{ 
                  backgroundColor: user?.role === 'admin' ? '#1890ff' : '#52c41a'
                }}
                icon={<UserOutlined />}
              />
              <div style={{ flex: 1 }}>
                <div style={{ 
                  color: "#fff", 
                  fontSize: 14, 
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {user.username}
                </div>
                <div style={{ 
                  color: "rgba(255,255,255,0.65)", 
                  fontSize: 12 
                }}>
                  {user.role === 'admin' ? '管理员' : '访客'}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 菜单 */}
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={selectedKeys()}
          theme="dark"
          style={{ 
            borderRight: 0, 
            marginTop: 8,
            flex: 1
          }}
          items={getMenuItems()}
        />
      </Sider>
        {/* 内容区域 */}
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            // padding: 24,
            minHeight: 280,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;