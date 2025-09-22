import React, { useState, useEffect } from 'react';
import * as _ from 'lodash'
import { Table, Form, Input, Button, Select, message, Card, Divider, Modal, Tag } from 'antd';
import { PlusOutlined, ImportOutlined, ExportOutlined } from '@ant-design/icons';
import { useAlbums } from './hooks/useAlbums';
import { useTransactions } from './hooks/useTransactions';

import './App.css';

const { Option } = Select;

function App() {
  // const [albums, setAlbums] = useState([]);
  // const [transactions, setTransactions] = useState([]);
  const [albumForm] = Form.useForm();
  const [transactionForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { albums, loading,addAlbum,updateAlbum,fetchAlbums } = useAlbums();
  const { transactions,createTransaction } = useTransactions();


  console.log(transactions,albums)


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    albumForm.resetFields();
  };

  // 添加新专辑
  const onAddAlbum = async (values) => {
    try {
      await addAlbum({
        id:  `${values.title}-${values.artist}`,
        ...values,
        stock: 0,
        lastUpdated: new Date().toISOString()
    });
      albumForm.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error('添加专辑失败');
    }
  };

  // 处理库存变动
  const onTransaction = async (values) => {
    try {
      // 在实际应用中，这里应该调用API Todo
      // albumId用_id吧
      const { albumId, type, quantity, notes } = values;
      
      const quantityNumber = parseInt(quantity)
      
      // 添加交易记录
      const newTransaction = {
        albumId: albumId,
        type,
        quantity:quantityNumber,
        date: new Date().toISOString(),
        notes
      };

      await createTransaction(newTransaction);

      await fetchAlbums()
      // await updateAlbum(updatedAlbum._id, {
      //   stock: newStock
      // })

      transactionForm.resetFields();
    } catch (error) {
      message.error('库存更新失败');
    }
  };

  // 表格列定义
  const albumColumns = [
    {
      title: '专辑名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '歌手',
      dataIndex: 'artist',
      key: 'artist',
    },
    {
      title: '发行年份',
      dataIndex: 'releaseYear',
      key: 'releaseYear',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <span style={{ color: stock > 0 ? 'green' : 'red', fontWeight: 'bold' }}>
          {stock}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => {
          transactionForm.setFieldsValue({ albumId: record._id.toString() });
        }}>
          库存操作
        </Button>
      ),
    },
  ];

  const transactionColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: '专辑',
      key: 'album',
      filters: _.uniqBy(albums, (each)=> `${each.title} - ${each.artist}`).map((each) => {
        return {
          text: `${each.title} - ${each.artist}`,
         value: `${each.title} - ${each.artist}`
        }
      }),
      onFilter: (value, record) =>{
        const album = albums.find(a => a._id === record.albumId?._id);
       return `${album?.title} - ${album?.artist}` === value
      },
      render: (record) => {
        const album = albums.find(a => a._id === record.albumId?._id);
        return album ? `${album.title} - ${album.artist}` : 'Unknown Album';
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={type === 'in' ? 'green' : 'red'}>
          {type === 'in' ? '入库' : '出库'}
        </Tag>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
    },
  ];

  return (
    <div className="app">
      <header className="app-header">
        <h1>专辑库存管理</h1>
        <p>跟踪入库和出库记录</p>
      </header>
      
      <div className="main-content">
        <div className="control-panel">
          <Card className="control-card" title="库存操作">
            <Form
              form={transactionForm}
              layout="vertical"
              onFinish={onTransaction}
            >
              <Form.Item name="albumId" label="选择专辑" rules={[{ required: true, message: '请选择专辑' }]}>
                <Select placeholder="选择专辑">
                  {albums.map(album => (
                    <Option key={album._id} value={album._id.toString()}>
                      {album.title} - {album.artist}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              
              <div className="form-row">
                <Form.Item name="type" label="操作类型" rules={[{ required: true, message: '请选择操作类型' }]}>
                  <Select placeholder="选择类型">
                    <Option value="in">入库</Option>
                    <Option value="out">出库</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item name="quantity" label="数量" rules={[{ required: true, message: '请输入数量' }]}>
                  <Input type="number" min={1} placeholder="数量" />
                </Form.Item>
              </div>
              
              <Form.Item name="notes" label="备注">
                <Input.TextArea placeholder="备注信息" />
              </Form.Item>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" icon={<ImportOutlined />}>
                  提交库存操作
                </Button>
              </Form.Item>
            </Form>
          </Card>

          <Card className="control-card" title="快速操作">
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showModal}
              style={{ marginBottom: '16px' }}
            >
              添加新专辑
            </Button>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">专辑类别总数</span>
                <span className="stat-value">{albums.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">总库存量</span>
                <span className="stat-value">{albums.reduce((sum, album) => sum + album.stock, 0)}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">出入库记录条数</span>
                <span className="stat-value">{transactions.length}</span>
              </div>
            </div>
          </Card>
        </div>

        <Divider />

        <h2>专辑库存列表</h2>
        <Table 
          dataSource={albums} 
          columns={albumColumns} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
        />

        <Divider />

        <h2>出入库历史</h2>
        <Table 
          dataSource={transactions} 
          columns={transactionColumns} 
          rowKey="id" 
          pagination={{ pageSize: 5 }}
        />
      </div>

      <Modal 
        title="添加新专辑" 
        open={isModalVisible} 
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={albumForm}
          layout="vertical"
          onFinish={onAddAlbum}
        >
          <Form.Item name="title" label="专辑名称" rules={[{ required: true, message: '请输入专辑名称' }]}>
            <Input placeholder="专辑名称" />
          </Form.Item>
          
          <Form.Item name="artist" label="歌手" rules={[{ required: true, message: '请输入歌手名称' }]}>
            <Input placeholder="歌手" />
          </Form.Item>
          
          <Form.Item name="releaseYear" label="发行年份">
            <Input placeholder="发行年份" type="number" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              添加专辑
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default App;