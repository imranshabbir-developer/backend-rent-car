import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog title is required'],
      trim: true,
    },
    // Reference to the category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    // Rich text content (HTML from React Quill)
    content: {
      type: String,
      required: [true, 'Blog content is required'],
    },
    // Short description (can be extracted from content or set separately)
    description: {
      type: String,
      trim: true,
    },
    // Published status
    published: {
      type: Boolean,
      default: true,
    },
    // Featured image (optional)
    featuredImage: {
      type: String,
      default: null,
    },
    // SEO fields (optional)
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    // Author reference
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  // Auto-generate description from content if not provided
  if (!this.description && this.content) {
    // Strip HTML tags and get first 150 characters
    const textContent = this.content.replace(/<[^>]*>/g, '').trim();
    this.description = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
  }
  
  next();
});

// Index for faster queries
blogSchema.index({ category: 1 });
blogSchema.index({ published: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ slug: 1 });
blogSchema.index({ createdBy: 1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;

