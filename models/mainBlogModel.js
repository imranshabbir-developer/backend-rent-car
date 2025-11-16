import mongoose from 'mongoose';

const mainBlogSchema = new mongoose.Schema(
  {
    blogTitle: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Blog description is required'],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    // Author reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    // Slug for SEO-friendly URLs
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    // View count
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from title before saving
mainBlogSchema.pre('save', function (next) {
  if (this.isModified('blogTitle') && !this.slug) {
    this.slug = this.blogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for faster queries
mainBlogSchema.index({ isPublished: 1 });
mainBlogSchema.index({ createdAt: -1 });
mainBlogSchema.index({ slug: 1 });
mainBlogSchema.index({ createdBy: 1 });

const MainBlog = mongoose.model('MainBlog', mainBlogSchema);

export default MainBlog;

