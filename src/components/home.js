import React from "react";
import { Card, Row, Col, Space, Typography, Divider, Alert } from "antd";
import {
  BookOutlined,
  IdcardOutlined,
  RocketOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./home.css";

const { Title, Paragraph, Text } = Typography;

function Home() {
  // 模拟统计数据
  const statsData = {
    albums: {
      total: 128,
      increase: 12,
      status: "normal",
    },
    cards: {
      total: 543,
      increase: 28,
      status: "good",
    },
  };

  // 快速操作列表
  const quickActions = [
    {
      title: "添加新专辑",
      description: "录入新的专辑库存信息",
      icon: <BookOutlined />,
      path: "/albums",
      color: "#1890ff",
    },
    {
      title: "添加新小卡",
      description: "录入新的小卡库存信息",
      icon: <IdcardOutlined />,
      path: "/cards",
      color: "#52c41a",
    },
  ];

  return (
    <div style={{ padding: "0 8px" }}>
      {/* 欢迎标题区域 */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Title
          level={1}
          style={{
            marginBottom: 8,
            background: "linear-gradient(135deg, #1890ff 0%, #722ed1 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.5rem",
            fontWeight: 700,
          }}
        >
          欢迎使用库存管理系统
        </Title>
        <Paragraph
          style={{
            fontSize: "1.1rem",
            color: "#666",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          跟踪管理专辑和小卡出入库记录
        </Paragraph>
      </div>

      {/* 统计数据卡片 */}
      {/* <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={12}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #36D1DC 0%, #5B86E5 100%)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px 20px' }}
          >
            <Statistic
              title={
                <span style={{ color: 'white', fontSize: '1rem' }}>
                  专辑库存总量
                </span>
              }
              value={statsData.albums.total}
            //   prefix={<BookOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />}
              suffix={
                <Tag 
                  color="cyan" 
                  style={{ 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.2)',
                    marginLeft: 8
                  }}
                >
                  <ArrowUpOutlined /> {statsData.albums.increase}%
                </Tag>
              }
              valueStyle={{ color: 'white', fontSize: '2.5rem' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card 
            bordered={false}
            style={{ 
              background: 'linear-gradient(135deg, #FF5E62 0%, #FF9966 100%)',
              borderRadius: 12,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            bodyStyle={{ padding: '24px 20px' }}
          >
            <Statistic
              title={
                <span style={{ color: 'white', fontSize: '1rem' }}>
                  小卡库存总量
                </span>
              }
              value={statsData.cards.total}
              prefix={<IdcardOutlined style={{ color: 'rgba(255,255,255,0.8)' }} />}
              suffix={
                <Tag 
                  color="orange" 
                  style={{ 
                    border: 'none', 
                    background: 'rgba(255,255,255,0.2)',
                    marginLeft: 8
                  }}
                >
                  <ArrowUpOutlined /> {statsData.cards.increase}%
                </Tag>
              }
              valueStyle={{ color: 'white', fontSize: '2.5rem' }}
            />
          </Card>
        </Col>
      </Row> */}

      {/* 功能引导区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space>
                <RocketOutlined style={{ color: "#1890ff" }} />
                <span>快速开始</span>
              </Space>
            }
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <Paragraph
              style={{ fontSize: "1rem", color: "#666", marginBottom: 24 }}
            >
              请使用左侧导航菜单切换到相应的管理页面，或通过以下快速操作开始使用：
            </Paragraph>

            <Row gutter={[16, 16]}>
              {quickActions.map((action, index) => (
                <Col xs={24} md={12} key={index}>
                  <Card
                    size="small"
                    style={{
                      border: `1px solid ${action.color}20`,
                      background: `${action.color}05`,
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.3s",
                    }}
                    bodyStyle={{ padding: "16px" }}
                    hoverable
                    onClick={() => (window.location.href = action.path)}
                  >
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 6,
                            background: action.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                          }}
                        >
                          {action.icon}
                        </div>
                        <Text
                          strong
                          style={{ color: action.color, fontSize: "1rem" }}
                        >
                          {action.title}
                        </Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: "0.9rem" }}>
                        {action.description}
                      </Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider style={{ margin: "24px 0" }} />

            <Title level={4}>系统功能概览</Title>
            <Row gutter={[16, 8]} style={{ marginTop: 16 }}>
              <Col xs={24} sm={12}>
                <Space>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <Text>专辑库存管理</Text>
                </Space>
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  <Text type="secondary">
                    管理专辑库存信息，包括添加、编辑、删除和查看专辑详情
                  </Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <Space>
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <Text>小卡库存管理</Text>
                </Space>
                <div style={{ marginLeft: 24, marginTop: 4 }}>
                  <Text type="secondary">
                    管理小卡库存信息，支持按类型筛选和批量操作
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <TeamOutlined style={{ color: '#faad14' }} />
                <span>系统状态</span>
              </Space>
            }
            bordered={false}
            style={{ 
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Alert
                message="系统运行正常"
                description="所有功能模块均可正常使用"
                type="success"
                showIcon
              />
              
              <div style={{ padding: '12px 0' }}>
                <Text strong>今日活动</Text>
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text type="secondary">新增专辑</Text>
                    <Text>3</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text type="secondary">新增小卡</Text>
                    <Text>12</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">库存更新</Text>
                    <Text>8</Text>
                  </div>
                </div>
              </div>
              
              <Button 
                type="primary" 
                block 
                size="large"
                style={{
                  background: 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)',
                  border: 'none',
                  borderRadius: 8,
                  height: 40,
                  fontWeight: 600
                }}
                onClick={() => window.location.href = "/albums"}
              >
                开始使用系统
              </Button>
            </Space>
          </Card>
        </Col> */}
      </Row>
    </div>
  );
}

export default Home;
