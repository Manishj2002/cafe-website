// src/services/orderApi.js
import API from './api';

export const orderService = {
  // Create new order
  createOrder: async (orderData) => {
    const response = await API.post('/orders', orderData);
    return response.data; // Returns { success: true, data: { _id: ... } }
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await API.get('/orders/myorders');
    return response.data;
  },

  // Get single order
  getOrder: async (orderId) => {
    const response = await API.get(`/orders/${orderId}`);
    return response.data;
  },

  // Track order (public)
  trackOrder: async (orderId) => {
    const response = await API.get(`/orders/track/${orderId}`);
    return response.data;
  }
};

export default orderService;