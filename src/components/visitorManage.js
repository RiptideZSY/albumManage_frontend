import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, 
  Button, 
  Table, 
  List,
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  message, 
  Space, 
  Tag,
  Popconfirm,
  Alert
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserAddOutlined ,
  UserOutlined
} from '@ant-design/icons';
import {visitorAPI} from '../services/api';

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const tableRef = useRef(null);

  useEffect(() => {
    fetchVisitors();
    return () => {
      // 清理可能的未完成操作
    };
  }, []);

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      // 使用 setTimeout 避免立即更新
      setTimeout(async () => {
        try {
          const response = await visitorAPI.getVisitors();
          if (response?.success) {
            setVisitors(response.visitors || []);
          }
        } catch (error) {
          console.error('获取访客列表失败:', error);
          message.error('获取访客列表失败');
        } finally {
          setLoading(false);
        }
      }, 100);
    } catch (error) {
      console.error('获取访客列表失败:', error);
      setLoading(false);
    }
  };

  const handleCreateVisitor = async (values) => {
    try {
      const response = await visitorAPI.createVisitor( {
        username: values.username,
        password: values.password,
        // 先不让设置有效期，默认一个远的时间 todo
        validUntil: '2027-05-15'// values.validUntil.format('YYYY-MM-DD')
      });
      
      if (response?.success) {
        message.success('访客创建成功');
        setModalVisible(false);
        form.resetFields();
        // 延迟刷新表格
        setTimeout(() => {
          fetchVisitors();
        }, 200);
      }
    } catch (error) {
      console.error('创建访客失败:', error);
      message.error(error.response?.data?.message || '创建失败');
    }
  };

  const handleUpdateValidity = async (id, validUntil) => {
    try {
      const response = await visitorAPI.updateValidity(id, {
        validUntil: validUntil.format('YYYY-MM-DD')
      });
      
      if (response?.success) {
        message.success('有效期更新成功');
        // 延迟刷新表格
        setTimeout(() => {
          fetchVisitors();
        }, 200);
      }
    } catch (error) {
      console.error('更新失败:', error);
      message.error('更新失败');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await visitorAPI.deleteVisitor(id);
      if (response?.success) {
        message.success('删除成功');
        // 延迟刷新表格
        setTimeout(() => {
          fetchVisitors();
        }, 200);
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败');
    }
  };

  // 简单的日期格式化函数
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const isExpired = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDate(text),
      width: 120,
    },
    {
      title: '有效期至',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (text, record) => {
        const expired = isExpired(text);
        return (
          <Space>
            <span style={{ color: expired ? '#ff4d4f' : '#52c41a' }}>
              {formatDate(text)}
            </span>
            {expired && <Tag color="red">已过期</Tag>}
          </Space>
        );
      },
      width: 120,
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const expired = isExpired(record.validUntil);
        const isActive = record.isActive;
        
        if (!isActive) {
          return <Tag color="default">已禁用</Tag>;
        }
        
        if (expired) {
          return <Tag color="error">已过期</Tag>;
        }
        
        return <Tag color="success">有效</Tag>;
      },
      width: 80,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Popconfirm
            title="修改有效期"
            description={
              <div style={{ marginTop: 16 }}>
                <DatePicker
                  onChange={(date) => {
                    if (date) {
                      handleUpdateValidity(record._id, date);
                    }
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            }
            onConfirm={() => {}}
            okText="确定"
            cancelText="取消"
            placement="leftTop"
          >
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
            >
              修改有效期
            </Button>
          </Popconfirm>
          <Popconfirm
            title="确定要删除这个访客吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 禁用今天之前的日期
  const disabledDate = (current) => {
    // 不能选择今天之前的日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current && current.toDate() < today;
  };

  return (
    <div>
      <Card 
        title="访客管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新增访客
          </Button>
        }
      >
        <List
          loading={loading}
          dataSource={visitors}
          renderItem={(visitor) => (
            <List.Item
              actions={[
                // <Button 
                //   type="link" 
                //   onClick={() => {
                //     Modal.confirm({
                //       title: '修改有效期',
                //       content: (
                //         <DatePicker
                //           style={{ width: '100%', marginTop: 16 }}
                //           onChange={async (date) => {
                //             if (date) {
                //                 handleUpdateValidity(visitor._id,date)
                //             //   try {
                //             //       const response = await visitorAPI.updateValidity(visitor._id, {
                //             //       validUntil: date.format('YYYY-MM-DD')
                //             //     });
                //             //     message.success('有效期更新成功');
                //             //     fetchVisitors();
                //             //   } catch (error) {
                //             //     message.error('更新失败');
                //             //   }
                //             }
                //           }}
                //         />
                //       ),
                //       onOk: () => {},
                //     });
                //   }}
                // >
                //   修改有效期
                // </Button>,
                <Button 
                  type="link" 
                  danger 
                  onClick={() => {
                    Modal.confirm({
                      title: '确定要删除这个访客吗？',
                      onOk: () => handleDelete(visitor._id),
                    });
                  }}
                >
                  删除
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<UserOutlined />}
                title={
                  <Space>
                    <span>{visitor.username}</span>
                    {isExpired(visitor.validUntil) ? 
                      <Tag color="red">已过期</Tag> : 
                      <Tag color="green">有效</Tag>
                    }
                  </Space>
                }
                description={
                  <div>
                    <div>创建时间: {formatDate(visitor.createdAt)}</div>
                    {/* <div>有效期至: {formatDate(visitor.validUntil)}</div> */}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
      {/* <Card 
        title="访客管理"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalVisible(true)}
          >
            新增访客
          </Button>
        }
      >
        <div ref={tableRef}>
          <Table
            columns={columns}
            dataSource={visitors}
            rowKey="_id"
            loading={loading}
            pagination={false}
            scroll={{ x: 600 }}
            size="middle"
            bordered={false} // 去掉边框可能减少布局计算
            virtual={false}
          />
        </div>
      </Card> */}

      {/* 新增访客弹窗 */}
      <Modal
        title="新增访客"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        afterClose={() => {
          // 弹窗完全关闭后再清理
          form.resetFields();
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateVisitor}
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 3, message: '用户名至少3个字符' },
              { max: 20, message: '用户名最多20个字符' },
            ]}
          >
            <Input 
              placeholder="设置访客登录名" 
              prefix={<UserAddOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码至少6个字符' },
            ]}
          >
            <Input.Password placeholder="设置访客密码" />
          </Form.Item>

          {/* <Form.Item
            name="validUntil"
            label="有效期至"
            rules={[{ required: true, message: '请选择有效期' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              placeholder="选择有效期"
              disabledDate={disabledDate}
            />
          </Form.Item> */}

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                创建
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VisitorManagement;