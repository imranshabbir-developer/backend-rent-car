import mongoose from 'mongoose';
import { generateSlug, generateCanonicalUrl, generateSeoTitle, generateSeoDescription } from '../utils/seoUtils.js';
// testing comments // for testing
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
    // Canonical URL for SEO
    canonicalUrl: {
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

// Generate slug and SEO fields before saving
blogSchema.pre('save', async function (next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    let baseSlug = generateSlug(this.title);
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check for duplicate slugs and append counter if needed
    const Blog = mongoose.model('Blog');
    while (true) {
      const existing = await Blog.findOne({ slug: finalSlug, _id: { $ne: this._id } });
      if (!existing) {
        break;
      }
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = finalSlug;
  }
  
  // Auto-generate description from content if not provided
  if (!this.description && this.content) {
    // Strip HTML tags and get first 150 characters
    const textContent = this.content.replace(/<[^>]*>/g, '').trim();
    this.description = textContent.substring(0, 150) + (textContent.length > 150 ? '...' : '');
  }

  // Generate metaTitle if not provided
  if (!this.metaTitle && this.title) {
    this.metaTitle = generateSeoTitle(this.title);
  }

  // Generate metaDescription if not provided
  if (!this.metaDescription) {
    const descSource = this.description || this.content || '';
    this.metaDescription = generateSeoDescription(descSource);
  }

  // Generate canonical URL if not provided
  if (!this.canonicalUrl && this.slug) {
    this.canonicalUrl = generateCanonicalUrl('/blog', this.slug);
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

