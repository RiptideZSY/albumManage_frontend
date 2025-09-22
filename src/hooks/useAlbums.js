import { useState, useEffect } from 'react';
import { message } from 'antd';
import { albumAPI } from '../services/api';

export const useAlbums = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取所有专辑
  const fetchAlbums = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await albumAPI.getAll(params);
      setAlbums(response.albums || response);
    } catch (err) {
      setError(err.message || '获取专辑列表失败');
      message.error(err.message || '获取专辑列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加新专辑
  const addAlbum = async (albumData) => {
    try {
      setLoading(true);
      setError(null);
      const newAlbum = await albumAPI.create(albumData);
      setAlbums(prev => [...prev, newAlbum]);
      message.success('专辑添加成功');
      return newAlbum;
    } catch (err) {
      const errorMsg = err.message || '添加专辑失败';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新专辑
  const updateAlbum = async (id, albumData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAlbum = await albumAPI.update(id, albumData);
      setAlbums(prev => prev.map(album => 
        album.id === id ? updatedAlbum : album
      ));
      message.success('专辑库存更新成功');
      return updatedAlbum;
    } catch (err) {
      const errorMsg = err.message || '更新专辑失败';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 暂时没用到
  // 删除专辑
  const deleteAlbum = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await albumAPI.delete(id);
      setAlbums(prev => prev.filter(album => album.id !== id));
      message.success('专辑删除成功');
    } catch (err) {
      const errorMsg = err.message || '删除专辑失败';
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return {
    albums,
    loading,
    error,
    fetchAlbums,
    addAlbum,
    updateAlbum,
    deleteAlbum,
  };
};