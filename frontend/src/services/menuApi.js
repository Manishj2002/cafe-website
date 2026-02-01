// src/services/menuService.js - Menu Service
import API from './api';

export const menuService = {
  // Get all menu items with filters
  getMenuItems: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const { data } = await API.get(`/menu?${params}`);
    return data;
  },

  // Get single menu item
  getMenuItem: async (id) => {
    const { data } = await API.get(`/menu/${id}`);
    return data;
  },

  // Get featured items
  getFeaturedItems: async () => {
    const { data } = await API.get('/menu/featured/items');
    return data;
  },

  // Get items by category
  getMenuByCategory: async (categoryId) => {
    const { data } = await API.get(`/menu/category/${categoryId}`);
    return data;
  },

  // Search menu items
  searchMenu: async (query) => {
    const { data } = await API.get(`/menu?search=${query}`);
    return data;
  }
};

export default menuService;