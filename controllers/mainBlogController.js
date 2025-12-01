import MainBlog from '../models/mainBlogModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all main blogs
// @route   GET /api/v1/main-blogs
// @access  Public
export const getAllMainBlogs = async (req, res, next) => {
  try {
    const { isPublished, search } = req.query;

    // Build query object
    const query = {};
    
    // Filter by published status (default: show all for admin, only published for public)
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    } else if (!req.user || req.user.role !== 'admin') {
      // Public users only see published blogs
      query.isPublished = true;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { blogTitle: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await MainBlog.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: {
        blogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single main blog by ID
// @route   GET /api/v1/main-blogs/:id
// @access  Public
export const getMainBlogById = async (req, res, next) => {
  try {
    const blog = await MainBlog.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    // Only show published blogs to non-admin users
    if (!blog.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: {
        blog,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get main blog by slug
// @route   GET /api/v1/main-blogs/slug/:slug
// @access  Public
export const getMainBlogBySlug = async (req, res, next) => {
  try {
    const blog = await MainBlog.findOne({ slug: req.params.slug })
      .populate('createdBy', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    // Only show published blogs in public slug access
    if (!blog.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: {
        blog,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new main blog
// @route   POST /api/v1/main-blogs
// @access  Private/Admin
export const createMainBlog = async (req, res, next) => {
  try {
    const { blogTitle, description, isPublished, seoTitle, seoDescription, slug, canonicalUrl } = req.body;

    // Validate required fields
    if (!blogTitle || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide blog title and description',
      });
    }

    // Build blog object
    const blogData = {
      blogTitle: blogTitle.trim(),
      description: description.trim(),
      isPublished: isPublished !== undefined ? (isPublished === true || isPublished === 'true') : false,
      createdBy: req.user._id,
    };

    // Add SEO fields if provided
    if (seoTitle) blogData.seoTitle = seoTitle.trim();
    if (seoDescription) blogData.seoDescription = seoDescription.trim();
    if (slug) blogData.slug = slug.trim();
    if (canonicalUrl) blogData.canonicalUrl = canonicalUrl.trim();

    // Handle image upload
    if (req.file) {
      blogData.image = `/uploads/main-blogs/${req.file.filename}`;
    }

    const blog = await MainBlog.create(blogData);

    // Populate before sending response
    await blog.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Main blog created successfully',
      data: {
        blog,
      },
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Main blog with this title already exists (slug conflict)',
      });
    }
    next(error);
  }
};

// @desc    Update main blog
// @route   PUT /api/v1/main-blogs/:id
// @access  Private/Admin
export const updateMainBlog = async (req, res, next) => {
  try {
    const { blogTitle, description, isPublished, seoTitle, seoDescription, slug, canonicalUrl } = req.body;

    const blog = await MainBlog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    // Update fields
    if (blogTitle) blog.blogTitle = blogTitle.trim();
    if (description) blog.description = description.trim();
    if (isPublished !== undefined) {
      blog.isPublished = isPublished === true || isPublished === 'true';
    }
    
    // Update SEO fields if provided
    if (seoTitle !== undefined) blog.seoTitle = seoTitle ? seoTitle.trim() : '';
    if (seoDescription !== undefined) blog.seoDescription = seoDescription ? seoDescription.trim() : '';
    if (slug !== undefined) blog.slug = slug ? slug.trim() : '';
    if (canonicalUrl !== undefined) blog.canonicalUrl = canonicalUrl ? canonicalUrl.trim() : '';

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (blog.image) {
        const oldImagePath = path.join(__dirname, '..', blog.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      blog.image = `/uploads/main-blogs/${req.file.filename}`;
    }

    // Regenerate slug if title changed
    if (blogTitle && blogTitle !== blog.blogTitle) {
      blog.slug = blogTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    await blog.save();

    // Populate before sending response
    await blog.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Main blog updated successfully',
      data: {
        blog,
      },
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Main blog with this title already exists (slug conflict)',
      });
    }
    next(error);
  }
};

// @desc    Delete main blog
// @route   DELETE /api/v1/main-blogs/:id
// @access  Private/Admin
export const deleteMainBlog = async (req, res, next) => {
  try {
    const blog = await MainBlog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    // Delete image file if exists
    if (blog.image) {
      const imagePath = path.join(__dirname, '..', blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await MainBlog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Main blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle main blog publish status
// @route   PATCH /api/v1/main-blogs/:id/publish
// @access  Private/Admin
export const toggleMainBlogPublish = async (req, res, next) => {
  try {
    const blog = await MainBlog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Main blog not found',
      });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Main blog ${blog.isPublished ? 'published' : 'unpublished'} successfully`,
      data: {
        blog,
      },
    });
  } catch (error) {
    next(error);
  }
};

