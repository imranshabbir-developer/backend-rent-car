import Category from '../models/categoryModel.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public
export const getAllCategories = async (req, res, next) => {
  try {
    const { status } = req.query;

    // Build query object
    const query = {};
    if (status) {
      query.status = status;
    }

    const categories = await Category.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by ID
// @route   GET /api/v1/categories/:id
// @access  Public
export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/v1/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    // Check if category already exists
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      // Delete uploaded file if category already exists
      if (req.file) {
        const filePath = path.join(__dirname, '../uploads/categories', req.file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
      });
    }

    // Build category object
    const categoryData = {
      name,
      description,
    };

    // Add photo if uploaded
    if (req.file) {
      categoryData.photo = `/uploads/categories/${req.file.filename}`;
    }

    // Add status if provided
    if (status) {
      categoryData.status = status;
    }

    const category = await Category.create(categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/categories', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/v1/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const categoryId = req.params.id;

    let category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if name is being changed and if it's already taken
    if (name && name !== category.name) {
      const nameExists = await Category.findOne({ name, _id: { $ne: categoryId } });
      if (nameExists) {
        // Delete uploaded file if name already exists
        if (req.file) {
          const filePath = path.join(__dirname, '../uploads/categories', req.file.filename);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        return res.status(400).json({
          success: false,
          message: 'Category name already exists',
        });
      }
    }

    // Build update object
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (status) updateData.status = status;

    // Handle photo update
    if (req.file) {
      // Delete old photo if exists
      if (category.photo) {
        const oldFilePath = path.join(__dirname, '..', category.photo);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updateData.photo = `/uploads/categories/${req.file.filename}`;
    }

    category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: {
        category,
      },
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      const filePath = path.join(__dirname, '../uploads/categories', req.file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/v1/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Delete associated photo file
    if (category.photo) {
      const filePath = path.join(__dirname, '..', category.photo);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle category status
// @route   PATCH /api/v1/categories/:id/status
// @access  Private/Admin
export const toggleCategoryStatus = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    category.status = category.status === 'Active' ? 'Inactive' : 'Active';
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category status changed to ${category.status}`,
      data: {
        category,
      },
    });
  } catch (error) {
    next(error);
  }
};

