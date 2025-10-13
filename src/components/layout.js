import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { BookOutlined, HomeOutlined, IdcardOutlined } from "@ant-design/icons";
import logo from "../assets/logo.jpg";

const { Sider, Content } = Layout;

function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  // 根据当前路径设置选中的菜单项
  const selectedKeys = () => {
    if (location.pathname === "/") return ["1"];
    if (location.pathname === "/albums") return ["2"];
    if (location.pathname === "/cards") return ["3"];
    return ["1"];
  };

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
            //   transition: 'all s',
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
            <img src={logo} alt="err" width={40} height={40} />
            {!collapsed && (
              <span style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
                泡泡摩奇
              </span>
            )}
          </div>
        </div>
        {/* 菜单 */}
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={selectedKeys()}
          theme="dark"
          style={{ borderRight: 0, marginTop: 0 }}
          items={[
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
          ]}
        />
      </Sider>

      {/* 内容区域 */}
      <Layout>
        <Content
          style={{
            margin: "24px 16px",
            // padding: 24,
            minHeight: 280,
            // background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
