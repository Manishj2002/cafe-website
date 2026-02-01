// utils/constants.js - Application Constants

// Order Status
const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Payment Status
const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed'
};

// Payment Methods
const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  ONLINE: 'online',
  UPI: 'upi'
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Delivery Fee
const DELIVERY_FEE = 50;

// Minimum Order Amount
const MIN_ORDER_AMOUNT = 100;

// Preparation Time (in minutes)
const DEFAULT_PREPARATION_TIME = 30;

module.exports = {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  USER_ROLES,
  DELIVERY_FEE,
  MIN_ORDER_AMOUNT,
  DEFAULT_PREPARATION_TIME
};