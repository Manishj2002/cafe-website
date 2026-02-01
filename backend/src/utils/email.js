// src/utils/email.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
  // Add basic validation
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.error('Missing EMAIL_USER or EMAIL_PASSWORD in .env');
    throw new Error('Email configuration missing');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Optional: helps debugging
    logger: true,
    debug: process.env.NODE_ENV !== 'production',
  });
};

module.exports = { createTransporter };