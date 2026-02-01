// routes/menuRoutes.js - Menu Routes
const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItem,
  getFeaturedItems,
  getMenuByCategory
} = require('../controllers/menuController');

router.get('/', getMenuItems);
router.get('/featured/items', getFeaturedItems);
router.get('/category/:categoryId', getMenuByCategory);
router.get('/:id', getMenuItem);

module.exports = router;