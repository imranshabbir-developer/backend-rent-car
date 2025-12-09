import ContactQuery from '../models/contactQueryModel.js';

// @desc    Create new contact query
// @route   POST /api/v1/contact-queries
// @access  Public
export const createContactQuery = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields. Please provide name, email, phone, and message.',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      });
    }

    const contactQuery = await ContactQuery.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      status: 'new',
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon.',
      data: { contactQuery },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact queries
// @route   GET /api/v1/contact-queries
// @access  Private/Admin
export const getContactQueries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status) {
      const validStatuses = ['new', 'read', 'replied', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status provided.',
        });
      }
      query.status = status;
    }

    const contactQueries = await ContactQuery.find(query)
      .populate({
        path: 'repliedBy',
        select: 'name email',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contactQueries.length,
      data: { contactQueries },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact query by ID
// @route   GET /api/v1/contact-queries/:id
// @access  Private/Admin
export const getContactQueryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactQuery = await ContactQuery.findById(id)
      .populate({
        path: 'repliedBy',
        select: 'name email',
      });

    if (!contactQuery) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found.',
      });
    }

    return res.status(200).json({
      success: true,
      data: { contactQuery },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact query
// @route   PUT /api/v1/contact-queries/:id
// @access  Private/Admin
export const updateContactQuery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, message, status, notes } = req.body;

    const contactQuery = await ContactQuery.findById(id);

    if (!contactQuery) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found.',
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['new', 'read', 'replied', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status provided.',
        });
      }
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format.',
        });
      }
    }

    // Update fields
    if (name !== undefined) contactQuery.name = name.trim();
    if (email !== undefined) contactQuery.email = email.trim().toLowerCase();
    if (phone !== undefined) contactQuery.phone = phone.trim();
    if (message !== undefined) contactQuery.message = message.trim();
    if (status !== undefined) contactQuery.status = status;
    if (notes !== undefined) contactQuery.notes = notes ? notes.trim() : '';

    // If status is changed to 'replied', update repliedBy and repliedAt
    if (status === 'replied' && contactQuery.status !== 'replied') {
      contactQuery.repliedBy = req.user?._id;
      contactQuery.repliedAt = new Date();
    }

    await contactQuery.save();

    await contactQuery.populate({
      path: 'repliedBy',
      select: 'name email',
    });

    return res.status(200).json({
      success: true,
      message: 'Contact query updated successfully.',
      data: { contactQuery },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact query
// @route   DELETE /api/v1/contact-queries/:id
// @access  Private/Admin
export const deleteContactQuery = async (req, res, next) => {
  try {
    const { id } = req.params;

    const contactQuery = await ContactQuery.findById(id);

    if (!contactQuery) {
      return res.status(404).json({
        success: false,
        message: 'Contact query not found.',
      });
    }

    await contactQuery.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Contact query deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

