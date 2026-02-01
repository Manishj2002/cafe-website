// controllers/menuController.js - Menu Controller
const MenuItem = require('../models/MenuItem');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getMenuItems = async (req, res, next) => {
  try {
    const { category, search, sort, isVeg, minPrice, maxPrice } = req.query;

    // Build query
    let query = { isAvailable: true };

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by veg/non-veg
    if (isVeg !== undefined) {
      query.isVeg = isVeg === 'true';
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sort
    let sortOption = {};
    if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else if (sort === 'popular') sortOption.numReviews = -1;
    else sortOption.createdAt = -1;

    const menuItems = await MenuItem.find(query)
      .populate('category', 'name')
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate('category', 'name description');

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured menu items
// @route   GET /api/menu/featured/items
// @access  Public
exports.getFeaturedItems = async (req, res, next) => {
  try {
    const featuredItems = await MenuItem.find({ 
      isFeatured: true, 
      isAvailable: true 
    })
      .populate('category', 'name')
      .limit(6);

    res.status(200).json({
      success: true,
      count: featuredItems.length,
      data: featuredItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get menu items by category
// @route   GET /api/menu/category/:categoryId
// @access  Public
exports.getMenuByCategory = async (req, res, next) => {
  try {
    const menuItems = await MenuItem.find({ 
      category: req.params.categoryId,
      isAvailable: true
    }).populate('category', 'name');

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    next(error);
  }
};