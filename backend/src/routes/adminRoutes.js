// routes/adminRoutes.js - Admin Routes (Enhanced)
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage'); // ← add this if not already

const {
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
  addCategory,
  updateCategory,
  deleteCategory,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  toggleUserStatus,
  createOffer,
  getAllOffers,
  updateOffer,
  deleteOffer,
  getDashboardStats,
  getSettings,
  updateSettings,
  getContactMessages,
  updateMessageStatus,
  deleteContactMessage,
  
} = require('../controllers/adminController');

const { protect, authorize } = require('../middleware/authMiddleware');
const { createTransporter } = require('../utils/email'); // ← NEW IMPORT

// Apply middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Dashboard
// router.get('/dashboard', getDashboardStats);
router.get("/dashboard/stats", protect,getDashboardStats);
// Menu Management
router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);
router.patch('/menu/:id/availability', toggleAvailability);

// Category Management
router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// User Management
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

// Offers Management
router.post('/offers', createOffer);
router.get('/offers', getAllOffers);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

// Settings Management
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// ────────────────────────────────────────────────
// Contact Messages – inline handlers with email support
// ────────────────────────────────────────────────

router.get('/contact-messages', getContactMessages); // keep using controller if it works

// Optional: if you want to override / replace the controller version:
router.get('/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('GET contact-messages error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.patch('/contact-messages/:id', async (req, res) => {
  try {
    const { status, adminReply } = req.body;

    const updateData = { status };
    if (adminReply !== undefined) {
      updateData.adminReply = adminReply;
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Send email only when there's a real reply
    if (adminReply && status === 'replied') {
      let transporter;
      try {
        transporter = createTransporter();
      } catch (emailConfigError) {
        console.error('Email transporter creation failed:', emailConfigError);
        // Still continue – don't fail the whole request if email fails
      }

      if (transporter) {
        try {
          const mailOptions = {
            from: `"Cafe Delight" <${process.env.EMAIL_USER}>`,
            to: message.email,
            subject: `Re: ${message.subject} – Response from Cafe Delight`,
            text: `
Dear ${message.name},

Thank you for reaching out to us. Here is our response:

"${adminReply}"

Your original message:
${message.message}

Best regards,
Cafe Delight Team
Phone: +91 98765 43210
Email: info@cafedelight.com
            `,
            html: `
<p>Dear ${message.name},</p>
<p>Thank you for reaching out to us. Here is our response:</p>
<blockquote style="border-left: 4px solid #4a90e2; padding-left: 12px; margin: 16px 0;">${adminReply.replace(/\n/g, '<br>')}</blockquote>
<p>Your original message:</p>
<blockquote style="border-left: 4px solid #666; padding-left: 12px; margin: 16px 0; color: #444;">${message.message.replace(/\n/g, '<br>')}</blockquote>
<p>Best regards,<br>
<strong>Cafe Delight Team</strong><br>
Phone: +91 98765 43210<br>
Email: info@cafedelight.com</p>
            `
          };

          await transporter.sendMail(mailOptions);
          console.log(`Reply email sent to ${message.email}`);
        } catch (emailSendError) {
          console.error('Failed to send reply email:', emailSendError);
          // Optional: you could add a field like emailSent: false in response
        }
      }
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    console.error('PATCH /contact-messages/:id error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
});

router.delete('/contact-messages/:id', deleteContactMessage);

module.exports = router;