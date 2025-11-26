import mongoose from 'mongoose';
import { generateSlug, generateCanonicalUrl, generateSeoTitle, generateSeoDescription } from '../utils/seoUtils.js';

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
  },
  {
    timestamps: true,
  }
);

// Auto-generate SEO fields before saving
categorySchema.pre('save', async function (next) {
  // Generate slug from name if not provided
  if (this.isModified('name') && !this.slug) {
    let baseSlug = generateSlug(this.name);
    let finalSlug = baseSlug;
    let counter = 1;
    
    // Check for duplicate slugs and append counter if needed
    const Category = mongoose.model('Category');
    while (true) {
      const existing = await Category.findOne({ slug: finalSlug, _id: { $ne: this._id } });
      if (!existing) {
        break;
      }
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    this.slug = finalSlug;
  }

  // Generate SEO title if not provided
  if (!this.seoTitle && this.name) {
    this.seoTitle = generateSeoTitle(`${this.name} Car Rental`);
  }

  // Generate SEO description if not provided
  if (!this.seoDescription) {
    const desc = this.description || `Rent ${this.name} cars in Lahore with Convoy Travels. Affordable ${this.name.toLowerCase()} car rental services.`;
    this.seoDescription = generateSeoDescription(desc);
  }

  // Generate canonical URL if not provided
  if (!this.canonicalUrl && this.slug) {
    this.canonicalUrl = generateCanonicalUrl('/vehicle-types', this.slug);
  }

  next();
});

// Index for faster queries
categorySchema.index({ name: 1 });
categorySchema.index({ status: 1 });
categorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', categorySchema);

export default Category;

