// routes/orderRoutes.js - Order Routes
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  trackOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/track/:orderId', trackOrder);
router.get('/:id', protect, getOrder);

module.exports = router;