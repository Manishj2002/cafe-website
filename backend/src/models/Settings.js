// models/Settings.js - Site Settings Schema
const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Contact Information
  phone1: {
    type: String,
    default: '+91 98765 43210'
  },
  phone2: {
    type: String,
    default: '+91 98765 43211'
  },
  email1: {
    type: String,
    default: 'info@cafedelight.com'
  },
  email2: {
    type: String,
    default: 'support@cafedelight.com'
  },
  address: {
    street: {
      type: String,
      default: '123 Food Street, MI Road'
    },
    city: {
      type: String,
      default: 'Jaipur'
    },
    state: {
      type: String,
      default: 'Rajasthan'
    },
    zipCode: {
      type: String,
      default: '302001'
    },
    country: {
      type: String,
      default: 'India'
    }
  },
  
  // Map Location
  mapLocation: {
    latitude: {
      type: Number,
      default: 26.9124 // Jaipur coordinates
    },
    longitude: {
      type: Number,
      default: 75.7873
    },
    embedUrl: {
      type: String,
      default: ''
    }
  },
  
  // Opening Hours
  openingHours: {
    weekday: {
      type: String,
      default: 'Monday - Friday: 8 AM - 10 PM'
    },
    weekend: {
      type: String,
      default: 'Saturday - Sunday: 9 AM - 11 PM'
    }
  },
  
  // Social Media (optional)
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String
  },
  
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Settings', settingsSchema);