// controllers/orderController.js - Order Controller
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const { DELIVERY_FEE } = require('../utils/constants');
const { getIO } = require('../config/socket');
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
// controllers/orderController.js


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      deliveryAddress,
      orderType,
      paymentMethod,
      notes
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No order items'
      });
    }

    // Calculate items price
    let itemsPrice = 0;
    for (let item of orderItems) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`
        });
      }
      itemsPrice += menuItem.price * item.quantity;
    }

    // Calculate delivery fee
    const deliveryFee = orderType === 'delivery' ? 40 : 0; // Adjust as needed

    // Calculate total
    const totalPrice = itemsPrice + deliveryFee;

    // Estimate delivery time (30 mins from now)
    const estimatedDeliveryTime = new Date(Date.now() + 30 * 60000);

    // Create order
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      deliveryAddress,
      orderType,
      paymentMethod,
      itemsPrice,
      deliveryFee,
      totalPrice,
      notes,
      estimatedDeliveryTime
    });

    // ✅ EMIT NEW ORDER TO ADMIN (Optional)
    try {
      const io = getIO();
      const populatedOrder = await Order.findById(order._id)
        .populate('user', 'name email phone')
        .populate('orderItems.menuItem', 'name price');
      
      io.emit('new-order', populatedOrder);
      console.log('New order emitted to admin');
    } catch (socketError) {
      console.error('Socket emit error:', socketError);
    }

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.menuItem', 'name price image')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('orderItems.menuItem', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user is order owner or admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track order
// @route   GET /api/orders/track/:orderId
// @access  Public (with order ID)
exports.trackOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .select('status estimatedDeliveryTime deliveredAt createdAt orderType');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};