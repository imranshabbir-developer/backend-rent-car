import mongoose from 'mongoose';
import { generateSlug, generateCanonicalUrl, generateSeoTitle, generateSeoDescription } from '../utils/seoUtils.js';

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
    // SEO fields
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
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
mainBlogSchema.pre('save', async function (next) {
  // Generate slug from title if not provided
  if (this.isModified('blogTitle') && !this.slug) {
    let baseSlug = generateSlug(this.blogTitle);
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check for duplicate slugs and append counter if needed
    const MainBlog = mongoose.model('MainBlog');
    while (true) {
      const existing = await MainBlog.findOne({ slug: finalSlug, _id: { $ne: this._id } });
      if (!existing) {
        break;
      }
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = finalSlug;
  }

  // Generate SEO title if not provided
  if (!this.seoTitle && this.blogTitle) {
    this.seoTitle = generateSeoTitle(this.blogTitle);
  }

  // Generate SEO description if not provided
  if (!this.seoDescription) {
    const descSource = this.description || '';
    this.seoDescription = generateSeoDescription(descSource);
  }

  // Generate canonical URL if not provided
  if (!this.canonicalUrl && this.slug) {
    this.canonicalUrl = generateCanonicalUrl('/main-blog', this.slug);
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

