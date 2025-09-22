import { useState, useEffect, useCallback } from 'react';
import { transactionAPI } from '../services/api';
import { message } from 'antd';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取所有交易记录
  const fetchTransactions = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // 合并分页参数
      const queryParams = {
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        ...params
      };
      
      const response = await transactionAPI.getAll(queryParams);
      
      setTransactions(response.transactions || response);
      
      // 更新分页信息
      if (response.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: response.total
        }));
      }
    } catch (err) {
      const errorMsg = err.message || '获取交易记录失败';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize]);

  // 获取特定专辑的交易记录
  const fetchTransactionsByAlbum = useCallback(async (albumId, params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: params.current || 1,
        limit: params.pageSize || 10,
        ...params
      };
      
      const response = await transactionAPI.getByAlbumId(albumId, queryParams);
      
      setTransactions(response.transactions || response);
      
      // 更新分页信息
      if (response.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: response.total
        }));
      }
    } catch (err) {
      const errorMsg = err.message || '获取交易记录失败';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建交易记录（入库/出库）
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      const {transaction: newTransaction, newStock} = await transactionAPI.create(transactionData);
      
      // 将新交易记录添加到列表开头
      setTransactions(prev => [newTransaction, ...prev]);
      
      // 更新分页总数
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      
      message.success('库存操作成功');
      return newTransaction;
    } catch (err) {
      const errorMsg = err.message || '库存操作失败';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更改分页
  const handleTableChange = (pagination, filters, sorter) => {
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    
    // 添加排序参数
    if (sorter.field) {
      params.sort = sorter.field;
      params.order = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    // 添加筛选参数
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        params[key] = value.join(',');
      }
    });
    
    fetchTransactions(params);
  };

  // 清空交易记录
  const clearTransactions = () => {
    setTransactions([]);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0
    });
  };

  useEffect(() => {
    // 默认加载第一页交易记录
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchTransactions,
    fetchTransactionsByAlbum,
    createTransaction,
    handleTableChange,
    clearTransactions
  };
};

// 创建一个专门用于特定专辑交易记录的Hook
export const useAlbumTransactions = (albumId) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  // 获取特定专辑的交易记录
  const fetchAlbumTransactions = useCallback(async (params = {}) => {
    if (!albumId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = {
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        ...params
      };
      
      const response = await transactionAPI.getByAlbumId(albumId, queryParams);
      
      setTransactions(response.transactions || response);
      
      // 更新分页信息
      if (response.total !== undefined) {
        setPagination(prev => ({
          ...prev,
          current: queryParams.page,
          pageSize: queryParams.limit,
          total: response.total
        }));
      }
    } catch (err) {
      const errorMsg = err.message || '获取交易记录失败';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [albumId, pagination.current, pagination.pageSize]);

  // 创建交易记录（入库/出库）
  const createTransaction = async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      
      // 确保交易记录关联到当前专辑
      const dataWithAlbum = {
        ...transactionData,
        albumId: albumId
      };
      
      const newTransaction = await transactionAPI.create(dataWithAlbum);
      
      // 将新交易记录添加到列表开头
      setTransactions(prev => [newTransaction, ...prev]);
      
      // 更新分页总数
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      
      message.success('库存操作成功');
      return newTransaction;
    } catch (err) {
      const errorMsg = err.message || '库存操作失败';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更改分页
  const handleTableChange = (pagination, filters, sorter) => {
    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
    };
    
    // 添加排序参数
    if (sorter.field) {
      params.sort = sorter.field;
      params.order = sorter.order === 'ascend' ? 'asc' : 'desc';
    }
    
    // 添加筛选参数
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.length > 0) {
        params[key] = value.join(',');
      }
    });
    
    fetchAlbumTransactions(params);
  };

  useEffect(() => {
    if (albumId) {
      fetchAlbumTransactions();
    } else {
      setTransactions([]);
    }
  }, [albumId, fetchAlbumTransactions]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchAlbumTransactions,
    createTransaction,
    handleTableChange
  };
};