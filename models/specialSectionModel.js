import mongoose from 'mongoose';

const specialSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Section title is required'],
      trim: true,
    },
    content: {
      type: String,
      required: [true, 'Section content is required'],
    },
    image: {
      type: String,
      required: [true, 'Section image is required'],
    },
    imagePosition: {
      type: String,
      enum: ['left', 'right'],
      default: 'right',
    },
    backgroundColor: {
      type: String,
      default: 'white', // white, #f4f7fc, #e7ecf5
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // SEO fields
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
    // Created by
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
specialSectionSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
specialSectionSchema.index({ isActive: 1, order: 1 });
specialSectionSchema.index({ slug: 1 });

const SpecialSection = mongoose.model('SpecialSection', specialSectionSchema);

export default SpecialSection;

