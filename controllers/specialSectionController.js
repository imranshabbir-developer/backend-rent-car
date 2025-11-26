import SpecialSection from '../models/specialSectionModel.js';

// @desc    Get all special sections
// @route   GET /api/v1/special-sections
// @access  Public
export const getAllSpecialSections = async (req, res, next) => {
  try {
    const { active } = req.query;

    // Build query object
    const query = {};
    
    // Filter by active status (default: show all for admin, only active for public)
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const sections = await SpecialSection.find(query)
      .populate('createdBy', 'name email')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: {
        sections,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single special section by ID
// @route   GET /api/v1/special-sections/:id
// @access  Public
export const getSpecialSectionById = async (req, res, next) => {
  try {
    const section = await SpecialSection.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Special section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        section,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single special section by slug
// @route   GET /api/v1/special-sections/slug/:slug
// @access  Public
export const getSpecialSectionBySlug = async (req, res, next) => {
  try {
    const section = await SpecialSection.findOne({ 
      slug: req.params.slug,
      isActive: true 
    })
      .populate('createdBy', 'name email');

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Special section not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        section,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new special section
// @route   POST /api/v1/special-sections
// @access  Private/Admin
export const createSpecialSection = async (req, res, next) => {
  try {
    // Add createdBy from authenticated user
    req.body.createdBy = req.user.id;

    const section = await SpecialSection.create(req.body);

    res.status(201).json({
      success: true,
      data: {
        section,
      },
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A section with this slug already exists',
      });
    }
    next(error);
  }
};

// @desc    Update special section
// @route   PUT /api/v1/special-sections/:id
// @access  Private/Admin
export const updateSpecialSection = async (req, res, next) => {
  try {
    let section = await SpecialSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Special section not found',
      });
    }

    section = await SpecialSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: {
        section,
      },
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A section with this slug already exists',
      });
    }
    next(error);
  }
};

// @desc    Delete special section
// @route   DELETE /api/v1/special-sections/:id
// @access  Private/Admin
export const deleteSpecialSection = async (req, res, next) => {
  try {
    const section = await SpecialSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Special section not found',
      });
    }

    await section.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Special section deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle section active status
// @route   PATCH /api/v1/special-sections/:id/toggle
// @access  Private/Admin
export const toggleSpecialSectionStatus = async (req, res, next) => {
  try {
    const section = await SpecialSection.findById(req.params.id);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Special section not found',
      });
    }

    section.isActive = !section.isActive;
    await section.save();

    res.status(200).json({
      success: true,
      data: {
        section,
      },
    });
  } catch (error) {
    next(error);
  }
};

