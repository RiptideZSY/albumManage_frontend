import { useState, useEffect, useCallback } from "react";
import { cardTransactionAPI } from "../services/api";
import { message } from "antd";

export const useCardTransactions = () => {
  const [cardTransactions, setCardTransactions] = useState([]); // 展示用的，最近x条
  const [allCardTransactionsTotal, setAllCardTransactionsTotal] = useState(0);
  const [allCardTransactions, setAllCardTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取所有交易记录
  const fetchCardTransactions = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        setError(null);

        const isAll = !params.limit;
        // 合并分页参数
        // 先默认取十条 点击查看所有交易记录再出弹窗
        const queryParams = {
          // page: params.current || pagination.current,
          // limit: params.pageSize || pagination.pageSize,
          ...params,
        };

        const response = await cardTransactionAPI.getAll(queryParams);

        if (isAll) {
          setAllCardTransactions(response.transactions || response);
        } else {
          setCardTransactions(response.transactions || response);
        }

        setAllCardTransactionsTotal(response.total || 0);

        // 暂时不分页 请求全量数据
        // 更新分页信息
        // if (response.total !== undefined) {
        //   setPagination(prev => ({
        //     ...prev,
        //     current: queryParams.page,
        //     pageSize: queryParams.limit,
        //     total: response.total
        //   }));
        // }
      } catch (err) {
        const errorMsg = err.message || "获取交易记录失败";
        setError(errorMsg);
        message.error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize]
  );

  // 获取特定专辑的交易记录
  const fetchTransactionsByCard = useCallback(async (cardId, params = {}) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = {
        page: params.current || 1,
        limit: params.pageSize || 10,
        ...params,
      };

      const response = await cardTransactionAPI.getByCardId(
        cardId,
        queryParams
      );

      setCardTransactions(response.transactions || response);

      // 更新分页信息
      if (response.total !== undefined) {
        setPagination((prev) => ({
          ...prev,
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: response.total,
        }));
      }
    } catch (err) {
      const errorMsg = err.message || "获取交易记录失败";
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建交易记录（入库/出库）
  const createCardTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);

      const { transaction: newTransaction, newStock } =
        await cardTransactionAPI.create(transactionData);

      // 将新交易记录添加到列表开头
      setCardTransactions((prev) => [newTransaction, ...prev]);
      setAllCardTransactions((prev) => [newTransaction, ...prev]);
      setAllCardTransactionsTotal((prev) => prev + 1);
      // 更新分页总数
      setPagination((prev) => ({
        ...prev,
        total: prev.total + 1,
      }));

      message.success("库存操作成功");
      return newTransaction;
    } catch (err) {
      const errorMsg = err.message || "库存操作失败";
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更改分页
  // const handleTableChange = (pagination, filters, sorter) => {
  //   const params = {
  //     current: pagination.current,
  //     pageSize: pagination.pageSize,
  //   };

  //   // 添加排序参数
  //   if (sorter.field) {
  //     params.sort = sorter.field;
  //     params.order = sorter.order === 'ascend' ? 'asc' : 'desc';
  //   }

  //   // 添加筛选参数
  //   Object.entries(filters).forEach(([key, value]) => {
  //     if (value && value.length > 0) {
  //       params[key] = value.join(',');
  //     }
  //   });

  //   fetchCardTransactions(params);
  // };

  // 清空交易记录
  const clearCardTransactions = () => {
    setCardTransactions([]);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
    });
  };

  useEffect(() => {
    // 为性能考虑，默认加载10条交易记录
    fetchCardTransactions({
      page: 1,
      limit: 5,
    });
  }, [fetchCardTransactions]);

  return {
    cardTransactions,
    allCardTransactionsTotal,
    allCardTransactions,
    loading,
    error,
    pagination,
    fetchCardTransactions,
    fetchTransactionsByCard,
    createCardTransaction,
    // handleTableChange,
    clearCardTransactions,
  };
};
