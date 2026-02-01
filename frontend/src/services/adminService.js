// src/services/adminService.js - Admin Service
import API from './api';

export const adminService = {
  // Dashboard
  getDashboardStats: async () => {
  const { data } = await API.get('/admin/dashboard/stats');
  return data;
},

  // Menu Management
  addMenuItem: async (itemData) => {
    const { data } = await API.post('/admin/menu', itemData);
    return data;
  },

  updateMenuItem: async (id, itemData) => {
    const { data } = await API.put(`/admin/menu/${id}`, itemData);
    return data;
  },

  deleteMenuItem: async (id) => {
    const { data } = await API.delete(`/admin/menu/${id}`);
    return data;
  },

  toggleAvailability: async (id) => {
    const { data } = await API.patch(`/admin/menu/${id}/availability`);
    return data;
  },

  // Category Management
  addCategory: async (categoryData) => {
    const { data } = await API.post('/admin/categories', categoryData);
    return data;
  },

  updateCategory: async (id, categoryData) => {
    const { data } = await API.put(`/admin/categories/${id}`, categoryData);
    return data;
  },

  deleteCategory: async (id) => {
    const { data } = await API.delete(`/admin/categories/${id}`);
    return data;
  },

  // Order Management
  getAllOrders: async () => {
    const { data } = await API.get('/admin/orders');
    return data;
  },

  updateOrderStatus: async (id, status) => {
    const { data } = await API.put(`/admin/orders/${id}/status`, { status });
    return data;
  },

  // User Management
  getAllUsers: async () => {
    const { data } = await API.get('/admin/users');
    return data;
  },

  toggleUserStatus: async (id) => {
    const { data } = await API.patch(`/admin/users/${id}/status`);
    return data;
  },

  // Offers Management
  createOffer: async (offerData) => {
    const { data } = await API.post('/admin/offers', offerData);
    return data;
  },

  getAllOffers: async () => {
    const { data } = await API.get('/admin/offers');
    return data;
  },

  updateOffer: async (id, offerData) => {
    const { data } = await API.put(`/admin/offers/${id}`, offerData);
    return data;
  },

  deleteOffer: async (id) => {
    const { data } = await API.delete(`/admin/offers/${id}`);
    return data;
  },

  // Settings
getSettings: async () => {
  const { data } = await API.get('/admin/settings');
  return data;
},

updateSettings: async (settingsData) => {
  const { data } = await API.put('/admin/settings', settingsData);
  return data;
},

// Contact Messages
getContactMessages: async () => {
  const { data } = await API.get('/admin/contact-messages');
  return data;
},

updateMessageStatus: async (id, statusData) => {
  const { data } = await API.put(`/admin/contact-messages/${id}`, statusData);
  return data;
},

deleteContactMessage: async (id) => {
  const { data } = await API.delete(`/admin/contact-messages/${id}`);
  return data;
}
};

export default adminService;