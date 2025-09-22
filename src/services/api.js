import axios from 'axios';

// 创建axios实例
const api = axios.create({
    baseURL:
      process.env.NODE_ENV === "development"
        ? "http://localhost:3001"
        : "https://album-manage-backend.popmerchhelper.top",
    timeout: 600000,
    headers: {
      "Content-Type": "application/json",
    },
  });

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 处理未认证错误
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// 专辑相关API
export const albumAPI = {
  // 获取所有专辑
  getAll: (params) => api.get('/api/albums', { params }),
  
  // 获取单个专辑
  getById: (id) => api.get(`/api/albums/${id}`),
  
  // 创建新专辑
  create: (albumData) => api.post('/api/albums', albumData),
  
  // 更新专辑
  update: (id, albumData) => api.put(`/api/albums/${id}`, albumData),
  
  // 删除专辑
  delete: (id) => api.delete(`/api/albums/${id}`),
};

// 交易相关API
export const transactionAPI = {
  // 获取所有交易记录
  getAll: (params) => api.get('/api/transactions', { params }),
  
  // 创建交易记录
  create: (transactionData) => api.post('/api/transactions', transactionData),
  
  // 获取特定专辑的交易记录
  getByAlbumId: (albumId, params) => api.get(`/api/transactions/album/${albumId}`, { params }),
};

export default api;