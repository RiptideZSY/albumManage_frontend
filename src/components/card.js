import React, { useState, useEffect } from "react";
import * as _ from "lodash";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  message,
  Card,
  Divider,
  Modal,
  Tag,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import { useCards } from "../hooks/useCards";
import { useCardTransactions } from "../hooks/useCardTransactions";

import "./album.css";

const { Option } = Select;
const { Search } = Input;

function CardComponent() {
  const [cardForm] = Form.useForm();
  const [transactionForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [displayCards, setDisplayCards] = useState([]);

  const [isAllTransactionModalVisible, setIsAllTransactionModalVisible] =
    useState(false);

  const {
    cards,
    loading: cardLoading,
    addCard,
    updateCard,
    fetchCards,
    deleteCard,
  } = useCards();
  const {
    cardTransactions,
    allCardTransactionsTotal,
    allCardTransactions,
    loading: transactionsLoading,
    createCardTransaction,
    fetchCardTransactions,
  } = useCardTransactions();

  React.useEffect(() => {
    setDisplayCards(cards);
  }, [cards]);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    cardForm.resetFields();
  };

  // 添加新小卡
  const onAddCard = async (values) => {
    try {
      await addCard({
        id: `${values.title}-${values.artist}`,
        ...values,
        stock: 0,
        lastUpdated: new Date().toISOString(),
      });
      cardForm.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("添加小卡失败");
    }
  };

  // 处理库存变动
  const onTransaction = async (values) => {
    try {
      const { cardId, type, quantity, notes } = values;

      const quantityNumber = parseInt(quantity);

      const targetCard = cards.find((each) => each._id === cardId);
      // 添加交易记录
      const newTransaction = {
        cardId: cardId,
        type,
        quantity: quantityNumber,
        date: new Date().toISOString(),
        notes,
        artist: targetCard.artist,
        title: targetCard.title,
      };

      await createCardTransaction(newTransaction);

      await fetchCards();

      transactionForm.resetFields();
    } catch (error) {
      message.error("库存更新失败");
    }
  };

  // 处理删除小卡
  const handleDelete = async (id) => {
    try {
      await deleteCard(id);
      await fetchCards();
    } catch (error) {
      // 错误已经在hook中处理
    }
  };

  const onSearch = (text) => {
    if (!text) {
      setDisplayCards(cards);
    } else {
      const filterData = cards.filter((each) => {
        if (
          each.title.includes(text) ||
          each.title.toUpperCase().includes(text.toUpperCase())
        ) {
          return true;
        }

        return false;
      });
      setDisplayCards(filterData);
    }
  };

  // 表格列定义
  const cardColumns = [
    {
      title: "小卡名称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "歌手",
      dataIndex: "artist",
      key: "artist",
    },
    {
      title: "库存",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <span
          style={{ color: stock > 0 ? "green" : "red", fontWeight: "bold" }}
        >
          {stock}
        </span>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            transactionForm.setFieldsValue({ cardId: record._id.toString() });
          }}
        >
          库存操作
        </Button>
      ),
    },
    {
      title: "",
      key: "delete",
      render: (_, record) => {
        return (
          <Popconfirm
            title="删除小卡"
            description="确定要删除这张小卡吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
            okType="danger"
          >
            <Button type="link" danger size="small" icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const transactionColumns = [
    {
      title: "日期",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "小卡",
      key: "card",
      filters: _.uniqBy(cards, (each) => `${each.title} - ${each.artist}`).map(
        (each) => {
          return {
            text: `${each.title} - ${each.artist}`,
            value: `${each.title} - ${each.artist}`,
          };
        }
      ),
      onFilter: (value, record) => {
        const card = cards.find((a) => a._id === record.cardId?._id);
        return `${card?.title} - ${card?.artist}` === value;
      },
      render: (record) => {
        const card = cards.find((a) => a._id === record.cardId?._id);
        if (card) {
          return `${card.title}`;
        }

        return record?.title ? `${record.title}` : "Unknown Card";
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag color={type === "in" ? "green" : "red"}>
          {type === "in" ? "入库" : "出库"}
        </Tag>
      ),
    },
    {
      title: "数量",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "备注",
      dataIndex: "notes",
      key: "notes",
    },
  ];

  return (
    <div className="app">
      <div className="main-content">
        <div className="control-panel">
          <Card className="control-card" title="库存操作">
            <Form
              form={transactionForm}
              layout="vertical"
              onFinish={onTransaction}
            >
              <Form.Item
                name="cardId"
                label="选择小卡"
                rules={[{ required: true, message: "请选择小卡" }]}
              >
                <Select
                  showSearch
                  placeholder="选择小卡，现在可以输入关键词搜索啦"
                  optionFilterProp="children"
                  filterSort={(optionA, optionB) => {
                    return (optionA?.children ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.children ?? "").toLowerCase());
                  }}
                >
                  {cards.map((card) => (
                    <Option key={card._id} value={card._id.toString()}>
                      {card.title}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <div className="form-row">
                <Form.Item
                  name="type"
                  label="操作类型"
                  rules={[{ required: true, message: "请选择操作类型" }]}
                >
                  <Select placeholder="选择类型">
                    <Option value="in">入库</Option>
                    <Option value="out">出库</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="quantity"
                  label="数量"
                  rules={[{ required: true, message: "请输入数量" }]}
                >
                  <Input type="number" min={1} placeholder="数量" />
                </Form.Item>
              </div>

              <Form.Item name="notes" label="备注">
                <Input.TextArea placeholder="备注信息" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<ImportOutlined />}
                >
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
              style={{ marginBottom: "16px" }}
            >
              添加新小卡
            </Button>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">小卡类别总数</span>
                <span className="stat-value">{cards.length}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">总库存量</span>
                <span className="stat-value">
                  {cards.reduce((sum, card) => sum + card.stock, 0)}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">出入库记录条数</span>
                <span className="stat-value">
                  {allCardTransactionsTotal || cardTransactions.length}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <Divider />
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>小卡库存列表</h2>
          <Search
            placeholder="可以搜索小卡名称"
            allowClear
            onSearch={onSearch}
            style={{
              width: 300,
              marginLeft: 25,
              marginTop: 20,
              marginBottom: 20,
            }}
          />
        </div>

        <Table
          dataSource={displayCards}
          columns={cardColumns}
          rowKey="id"
          loading={cardLoading}
          pagination={{ pageSize: 5 }}
        />

        <Divider />

        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>小卡出入库历史（最近五条）</h2>
          <Button
            type="link"
            onClick={() => {
              if (!allCardTransactions.length) {
                fetchCardTransactions();
              }
              setIsAllTransactionModalVisible(true);
            }}
          >
            查看全部
          </Button>
        </div>
        <Table
          dataSource={cardTransactions}
          columns={transactionColumns}
          rowKey="id"
          pagination={false}
          loading={transactionsLoading}
        />
      </div>

      <Modal
        title="全部出入库历史"
        open={isAllTransactionModalVisible}
        onCancel={() => {
          setIsAllTransactionModalVisible(false);
        }}
        footer={null}
        width={1000}
      >
        <Table
          rootClassName={"all-transaction"}
          dataSource={allCardTransactions}
          columns={transactionColumns}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          loading={transactionsLoading}
        />
      </Modal>

      <Modal
        title="添加新小卡"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={cardForm} layout="vertical" onFinish={onAddCard}>
          <Form.Item
            name="title"
            label="小卡名称"
            rules={[{ required: true, message: "请输入小卡名称" }]}
          >
            <Input placeholder="小卡名称" />
          </Form.Item>

          <Form.Item
            name="artist"
            label="歌手"
            rules={[{ required: true, message: "请输入歌手名称" }]}
          >
            <Input placeholder="歌手" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              添加小卡
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default CardComponent;
