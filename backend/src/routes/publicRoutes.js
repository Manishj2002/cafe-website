// routes/publicRoutes.js - Public Routes for Offers, Settings, Contact
const express = require('express');
const router = express.Router();
const Offer = require('../models/Offer');
const Settings = require('../models/Settings');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get active homepage offers
// @route   GET /api/public/offers
// @access  Public
router.get('/offers', async (req, res, next) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      showOnHomepage: true,
      startDate: { $lte: now },
      expiryDate: { $gte: now }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get site settings
// @route   GET /api/public/settings
// @access  Public
router.get('/settings', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Submit contact message
// @route   POST /api/public/contact
// @access  Public
router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    const contactMessage = await ContactMessage.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: contactMessage
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;