import Blog from '../models/blogModel.js';
import Category from '../models/categoryModel.js';

// @desc    Get all blogs
// @route   GET /api/v1/blogs
// @access  Public
export const getAllBlogs = async (req, res, next) => {
  try {
    const { published, category, search } = req.query;

    // Build query object
    const query = {};
    
    // Filter by published status (default: show all for admin, only published for public)
    if (published !== undefined) {
      query.published = published === 'true';
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .populate('category', 'name description')
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

// @desc    Get single blog by ID
// @route   GET /api/v1/blogs/:id
// @access  Public
export const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('category', 'name description')
      .populate('createdBy', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
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

// @desc    Get blog by slug
// @route   GET /api/v1/blogs/slug/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('category', 'name description')
      .populate('createdBy', 'name email');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Only show published blogs in public slug access
    if (!blog.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
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

// @desc    Create new blog
// @route   POST /api/v1/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const { title, category, content, published, description } = req.body;

    // Validate required fields
    if (!title || !category || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, and content',
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Build blog object
    const blogData = {
      title: title.trim(),
      category,
      content,
      published: published !== undefined ? (published === true || published === 'true') : true,
      createdBy: req.user._id,
    };

    // Add description if provided
    if (description) {
      blogData.description = description.trim();
    }

    const blog = await Blog.create(blogData);

    // Populate before sending response
    await blog.populate('category', 'name description');
    await blog.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: {
        blog,
      },
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog with this title already exists (slug conflict)',
      });
    }
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/v1/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    const blogId = req.params.id;

    let blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const { title, category, content, published, description } = req.body;

    // Build update object
    const updateData = {};
    
    if (title) updateData.title = title.trim();
    if (category) {
      // Verify category exists
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
      updateData.category = category;
    }
    if (content) updateData.content = content;
    if (published !== undefined) {
      updateData.published = published === true || published === 'true';
    }
    if (description !== undefined) {
      updateData.description = description.trim();
    }

    // Update slug if title changed
    if (title && title !== blog.title) {
      updateData.slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    blog = await Blog.findByIdAndUpdate(blogId, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('category', 'name description')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: {
        blog,
      },
    });
  } catch (error) {
    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Blog with this title already exists (slug conflict)',
      });
    }
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/v1/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle blog published status
// @route   PATCH /api/v1/blogs/:id/publish
// @access  Private/Admin
export const toggleBlogPublish = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    blog.published = !blog.published;
    await blog.save();

    await blog.populate('category', 'name description');
    await blog.populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: `Blog ${blog.published ? 'published' : 'unpublished'} successfully`,
      data: {
        blog,
      },
    });
  } catch (error) {
    next(error);
  }
};

