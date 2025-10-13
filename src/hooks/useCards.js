import { useState, useEffect } from "react";
import { message } from "antd";
import { cardAPI } from "../services/api";

export const useCards = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 获取所有小卡
  const fetchCards = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await cardAPI.getAll(params);
      setCards(response.cards || response);
    } catch (err) {
      setError(err.message || "获取小卡列表失败");
      message.error(err.message || "获取小卡列表失败");
    } finally {
      setLoading(false);
    }
  };

  // 添加新小卡
  const addCard = async (cardData) => {
    try {
      setLoading(true);
      setError(null);
      const newCard = await cardAPI.create(cardData);
      setCards((prev) => [...prev, newCard]);
      message.success("小卡添加成功");
      return newCard;
    } catch (err) {
      const errorMsg = err.message || "添加小卡失败";
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 更新小卡
  const updateCard = async (id, cardData) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCard = await cardAPI.update(id, cardData);
      setCards((prev) =>
        prev.map((card) => (card.id === id ? updatedCard : card))
      );
      message.success("小卡库存更新成功");
      return updatedCard;
    } catch (err) {
      const errorMsg = err.message || "更新小卡失败";
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 删除小卡
  const deleteCard = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await cardAPI.delete(id);
      setCards((prev) => prev.filter((card) => card.id !== id));
      message.success("小卡删除成功");
    } catch (err) {
      const errorMsg = err.message || "删除小卡失败";
      setError(errorMsg);
      message.error(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  return {
    cards,
    loading,
    error,
    fetchCards,
    addCard,
    updateCard,
    deleteCard,
  };
};
