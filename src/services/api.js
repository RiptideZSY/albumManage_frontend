import axios from "axios";

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
    const token = localStorage.getItem("ppmq_albums_token");
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
      localStorage.removeItem("ppmq_albums_token");
      // message.error('密码错误！')
      // window.location.href = "/login";
    }
    return Promise.reject(error.response?.data || error);
  }
);

// 专辑相关API
export const albumAPI = {
  // 获取所有专辑
  getAll: (params) => api.get("/api/albums", { params }),

  // 获取单个专辑
  getById: (id) => api.get(`/api/albums/${id}`),

  // 创建新专辑
  create: (albumData) => api.post("/api/albums", albumData),

  // 更新专辑
  update: (id, albumData) => api.put(`/api/albums/${id}`, albumData),

  // 删除专辑
  delete: (id) => api.delete(`/api/albums/${id}`),
};

// 专辑交易相关API
export const transactionAPI = {
  // 获取所有交易记录
  getAll: (params) => api.get("/api/transactions", { params }),

  // 创建交易记录
  create: (transactionData) => api.post("/api/transactions", transactionData),

  // 获取特定专辑的交易记录
  getByAlbumId: (albumId, params) =>
    api.get(`/api/transactions/album/${albumId}`, { params }),
};

// 小卡相关API
export const cardAPI = {
  // 获取所有
  getAll: (params) => api.get("/api/cards", { params }),

  // 获取单个
  getById: (id) => api.get(`/api/cards/${id}`),

  // 创建新小卡
  create: (cardData) => api.post("/api/cards", cardData),

  // 更新专辑
  update: (id, cardData) => api.put(`/api/cards/${id}`, cardData),

  // 删除专辑
  delete: (id) => api.delete(`/api/cards/${id}`),
};

// 小卡交易相关API
export const cardTransactionAPI = {
  // 获取所有交易记录
  getAll: (params) => api.get("/api/cardtransactions", { params }),

  // 创建交易记录
  create: (transactionData) =>
    api.post("/api/cardtransactions", transactionData),

  // 获取特定专辑的交易记录
  getByCardId: (cardId, params) =>
    api.get(`/api/cardtransactions/${cardId}`, { params }),
};

export const authAPI = {
  // 登录
  login: (username, password) => 
    api.post('/api/auth/login', { username, password }),
  
  // 初始化管理员（仅第一次使用）
  initAdmin: (username, password) =>
    api.post('/api/auth/init-admin', { username, password }),
  
  // 验证token
  verifyToken: () =>
    api.get('/api/auth/verify'),
  
  // 获取当前用户信息
  getMe: () =>
    api.get('/api/auth/me')
};

export const visitorAPI = {
  // 创建访客
  createVisitor: (visitorData) =>
    api.post('/api/visitors', visitorData),
  
  // 获取所有访客
  getVisitors: () =>
    api.get('/api/visitors'),
  
  // 更新访客有效期 
  // updateValidity: (id, validUntil) =>
  //   api.put(`/api/visitors/${id}/validity`, { validUntil }),
  
  // 删除访客
  deleteVisitor: (id) =>
    api.delete(`/api/visitors/${id}`)
};
export default api;
