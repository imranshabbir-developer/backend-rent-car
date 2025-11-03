import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Category description is required'],
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ name: 1 });
categorySchema.index({ status: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;

