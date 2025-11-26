/**
 * Data Migration Script: Add SEO Fields to Existing Documents
 * 
 * This script adds SEO fields (seoTitle, seoDescription, slug, canonicalUrl)
 * to all existing documents in the database.
 * 
 * Run with: node scripts/migrateSeoFields.js
 * 
 * IMPORTANT: This script is safe to run multiple times - it only updates
 * documents that don't already have SEO fields set.
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Car from '../models/carModel.js';
import Category from '../models/categoryModel.js';
import Blog from '../models/blogModel.js';
import MainBlog from '../models/mainBlogModel.js';
import SpecialSection from '../models/specialSectionModel.js';
import connectDB from '../config/dbConfig.js';
import { generateSlug, generateCanonicalUrl, generateSeoTitle, generateSeoDescription } from '../utils/seoUtils.js';

dotenv.config();

const migrateCars = async () => {
  console.log('📦 Migrating Cars...');
  
  // Get all existing slugs to avoid duplicates
  const existingCars = await Car.find({ slug: { $exists: true, $ne: null, $ne: '' } }, { slug: 1 });
  const usedSlugs = new Set(existingCars.map(c => c.slug));
  
  const cars = await Car.find({
    $or: [
      { seoTitle: { $exists: false } },
      { seoTitle: null },
      { seoTitle: '' },
    ],
  }).sort({ createdAt: 1 }); // Sort by creation date for consistent ordering

  let updated = 0;
  
  for (const car of cars) {
    const updates = {};
    
    if (!car.slug && car.name) {
      let baseSlug = generateSlug(car.name);
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Handle duplicate slugs by checking database and appending counter
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(finalSlug);
      updates.slug = finalSlug;
    }
    
    if (!car.seoTitle && car.name) {
      updates.seoTitle = generateSeoTitle(car.name);
    }
    
    if (!car.seoDescription) {
      const descParts = [];
      if (car.name) descParts.push(car.name);
      if (car.brand) descParts.push(car.brand);
      if (car.model) descParts.push(car.model);
      if (car.location?.city) descParts.push(`in ${car.location.city}`);
      
      const defaultDesc = descParts.length > 0
        ? `Rent ${descParts.join(' ')} with Convoy Travels. ${car.rentPerDay ? `Starting at Rs ${car.rentPerDay} per day.` : 'Affordable car rental service.'}`
        : generateSeoDescription('');
      
      updates.seoDescription = generateSeoDescription(defaultDesc);
    }
    
    if (!car.canonicalUrl && updates.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/cars', updates.slug);
    } else if (!car.canonicalUrl && car.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/cars', car.slug);
    }

    if (Object.keys(updates).length > 0) {
      await Car.findByIdAndUpdate(car._id, { $set: updates });
      updated++;
    }
  }
  
  console.log(`   ✅ Updated ${updated} of ${cars.length} cars`);
  return updated;
};

const migrateCategories = async () => {
  console.log('📁 Migrating Categories...');
  
  // Get all existing slugs to avoid duplicates
  const existingCategories = await Category.find({ slug: { $exists: true, $ne: null, $ne: '' } }, { slug: 1 });
  const usedSlugs = new Set(existingCategories.map(c => c.slug));
  
  const categories = await Category.find({
    $or: [
      { seoTitle: { $exists: false } },
      { seoTitle: null },
      { seoTitle: '' },
    ],
  }).sort({ createdAt: 1 });

  let updated = 0;
  
  for (const category of categories) {
    const updates = {};
    
    if (!category.slug && category.name) {
      let baseSlug = generateSlug(category.name);
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Handle duplicate slugs
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(finalSlug);
      updates.slug = finalSlug;
    }
    
    if (!category.seoTitle && category.name) {
      updates.seoTitle = generateSeoTitle(`${category.name} Car Rental`);
    }
    
    if (!category.seoDescription) {
      const desc = category.description || `Rent ${category.name} cars in Lahore with Convoy Travels. Affordable ${category.name.toLowerCase()} car rental services.`;
      updates.seoDescription = generateSeoDescription(desc);
    }
    
    if (!category.canonicalUrl && updates.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/vehicle-types', updates.slug);
    } else if (!category.canonicalUrl && category.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/vehicle-types', category.slug);
    }

    if (Object.keys(updates).length > 0) {
      await Category.findByIdAndUpdate(category._id, { $set: updates });
      updated++;
    }
  }
  
  console.log(`   ✅ Updated ${updated} of ${categories.length} categories`);
  return updated;
};

const migrateBlogs = async () => {
  console.log('📝 Migrating Blogs...');
  
  // Get all existing slugs to avoid duplicates
  const existingBlogs = await Blog.find({ slug: { $exists: true, $ne: null, $ne: '' } }, { slug: 1 });
  const usedSlugs = new Set(existingBlogs.map(b => b.slug));
  
  const blogs = await Blog.find({
    $or: [
      { metaTitle: { $exists: false } },
      { metaTitle: null },
      { metaTitle: '' },
    ],
  }).sort({ createdAt: 1 });

  let updated = 0;
  
  for (const blog of blogs) {
    const updates = {};
    
    if (!blog.slug && blog.title) {
      let baseSlug = generateSlug(blog.title);
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Handle duplicate slugs
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(finalSlug);
      updates.slug = finalSlug;
    }
    
    if (!blog.metaTitle && blog.title) {
      updates.metaTitle = generateSeoTitle(blog.title);
    }
    
    if (!blog.metaDescription) {
      const descSource = blog.description || blog.content || '';
      updates.metaDescription = generateSeoDescription(descSource);
    }
    
    if (!blog.canonicalUrl && updates.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/blog', updates.slug);
    } else if (!blog.canonicalUrl && blog.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/blog', blog.slug);
    }

    if (Object.keys(updates).length > 0) {
      await Blog.findByIdAndUpdate(blog._id, { $set: updates });
      updated++;
    }
  }
  
  console.log(`   ✅ Updated ${updated} of ${blogs.length} blogs`);
  return updated;
};

const migrateMainBlogs = async () => {
  console.log('📰 Migrating Main Blogs...');
  
  // Get all existing slugs to avoid duplicates
  const existingMainBlogs = await MainBlog.find({ slug: { $exists: true, $ne: null, $ne: '' } }, { slug: 1 });
  const usedSlugs = new Set(existingMainBlogs.map(b => b.slug));
  
  const mainBlogs = await MainBlog.find({
    $or: [
      { seoTitle: { $exists: false } },
      { seoTitle: null },
      { seoTitle: '' },
    ],
  }).sort({ createdAt: 1 });

  let updated = 0;
  
  for (const blog of mainBlogs) {
    const updates = {};
    
    if (!blog.slug && blog.blogTitle) {
      let baseSlug = generateSlug(blog.blogTitle);
      let finalSlug = baseSlug;
      let counter = 1;
      
      // Handle duplicate slugs
      while (usedSlugs.has(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      usedSlugs.add(finalSlug);
      updates.slug = finalSlug;
    }
    
    if (!blog.seoTitle && blog.blogTitle) {
      updates.seoTitle = generateSeoTitle(blog.blogTitle);
    }
    
    if (!blog.seoDescription) {
      const descSource = blog.description || '';
      updates.seoDescription = generateSeoDescription(descSource);
    }
    
    if (!blog.canonicalUrl && updates.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/main-blog', updates.slug);
    } else if (!blog.canonicalUrl && blog.slug) {
      updates.canonicalUrl = generateCanonicalUrl('/main-blog', blog.slug);
    }

    if (Object.keys(updates).length > 0) {
      await MainBlog.findByIdAndUpdate(blog._id, { $set: updates });
      updated++;
    }
  }
  
  console.log(`   ✅ Updated ${updated} of ${mainBlogs.length} main blogs`);
  return updated;
};

const migrateSpecialSections = async () => {
  console.log('🎨 Migrating Special Sections...');
  // Special sections already have SEO fields, but ensure they're populated
  const sections = await SpecialSection.find({
    $or: [
      { canonicalUrl: { $exists: false } },
      { canonicalUrl: null },
      { canonicalUrl: '' },
    ],
  });

  let updated = 0;
  for (const section of sections) {
    const updates = {};
    
    if (!section.canonicalUrl && section.slug) {
      // Special sections don't have a specific route pattern, use homepage or custom
      updates.canonicalUrl = section.canonicalUrl || `https://convoytravels.pk/`;
    }

    if (Object.keys(updates).length > 0) {
      await SpecialSection.findByIdAndUpdate(section._id, { $set: updates });
      updated++;
    }
  }
  
  console.log(`   ✅ Updated ${updated} of ${sections.length} special sections`);
  return updated;
};

const runMigration = async () => {
  try {
    console.log('🚀 Starting SEO Fields Migration...\n');
    
    await connectDB();
    console.log('✅ Connected to database\n');

    const results = {
      cars: 0,
      categories: 0,
      blogs: 0,
      mainBlogs: 0,
      specialSections: 0,
    };

    results.cars = await migrateCars();
    results.categories = await migrateCategories();
    results.blogs = await migrateBlogs();
    results.mainBlogs = await migrateMainBlogs();
    results.specialSections = await migrateSpecialSections();

    const total = Object.values(results).reduce((sum, count) => sum + count, 0);

    console.log('\n📊 Migration Summary:');
    console.log(`   Cars: ${results.cars}`);
    console.log(`   Categories: ${results.categories}`);
    console.log(`   Blogs: ${results.blogs}`);
    console.log(`   Main Blogs: ${results.mainBlogs}`);
    console.log(`   Special Sections: ${results.specialSections}`);
    console.log(`\n   Total: ${total} documents updated`);
    console.log('\n✅ Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
runMigration();

