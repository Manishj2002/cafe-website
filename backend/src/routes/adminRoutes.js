// routes/adminRoutes.js - Admin Routes (Fixed)
const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');

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
const { createTransporter } = require('../utils/email');

// Apply middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// ============= DASHBOARD =============
router.get('/dashboard/stats', getDashboardStats);

// ============= MENU MANAGEMENT =============
router.post('/menu', addMenuItem);
router.put('/menu/:id', updateMenuItem);
router.delete('/menu/:id', deleteMenuItem);
router.patch('/menu/:id/availability', toggleAvailability);

// ============= CATEGORY MANAGEMENT =============
router.post('/categories', addCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// ============= ORDER MANAGEMENT =============
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// ============= USER MANAGEMENT =============
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

// ============= OFFERS MANAGEMENT =============
router.post('/offers', createOffer);
router.get('/offers', getAllOffers);
router.put('/offers/:id', updateOffer);
router.delete('/offers/:id', deleteOffer);

// ============= SETTINGS MANAGEMENT =============
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

// ============= CONTACT MESSAGES =============
router.get('/contact-messages', getContactMessages);

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