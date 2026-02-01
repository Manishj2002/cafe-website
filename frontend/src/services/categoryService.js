// src/services/categoryService.js - Category Service
import API from './api';

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    const { data } = await API.get('/categories');
    return data;
  },

  // Get single category
  getCategory: async (id) => {
    const { data } = await API.get(`/categories/${id}`);
    return data;
  }
};

export default categoryService;