/**
 * Production Readiness Validation Script
 * 
 * This script validates that the backend is ready for production deployment.
 * It checks for syntax errors, required files, and production configuration.
 * 
 * Run with: npm run build or npm run validate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errors = [];
const warnings = [];

console.log('🔍 Starting Production Readiness Check...\n');

// Check 1: Verify required files exist
console.log('📁 Checking required files...');
const requiredFiles = [
  'server.js',
  'package.json',
  'config/dbConfig.js',
  'middleware/errorMiddleware.js',
  'middleware/authMiddleware.js',
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    errors.push(`Missing required file: ${file}`);
    console.log(`   ❌ ${file} - MISSING`);
  }
});

// Check 2: Validate syntax of main files
console.log('\n🔤 Validating JavaScript syntax...');
const filesToCheck = [
  'server.js',
  'config/dbConfig.js',
];

filesToCheck.forEach(file => {
  try {
    const filePath = path.join(__dirname, '..', file);
    execSync(`node --check "${filePath}"`, { stdio: 'pipe' });
    console.log(`   ✅ ${file} - Syntax valid`);
  } catch (error) {
    errors.push(`Syntax error in ${file}`);
      console.log(`   ❌ ${file} - Syntax error`);
  }
});

// Check 3: Check package.json
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8')
  );
  
  // Check required dependencies
  const requiredDeps = [
    'express',
    'mongoose',
    'dotenv',
    'jsonwebtoken',
    'bcrypt',
    'cors',
    'morgan',
    'multer'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep} - Installed`);
    } else {
      errors.push(`Missing required dependency: ${dep}`);
      console.log(`   ❌ ${dep} - Missing`);
    }
  });
  
  // Check scripts
  if (packageJson.scripts && packageJson.scripts.start) {
    console.log(`   ✅ start script - Present`);
  } else {
    warnings.push('Missing start script in package.json');
    console.log(`   ⚠️  start script - Missing`);
  }
  
} catch (error) {
  errors.push(`Error reading package.json: ${error.message}`);
  console.log(`   ❌ Error reading package.json`);
}

// Check 4: Verify route files exist
console.log('\n🛣️  Checking route files...');
const routeFiles = [
  'routes/userRoutes.js',
  'routes/carRoutes.js',
  'routes/categoryRoutes.js',
  'routes/blogRoutes.js',
  'routes/mainBlogRoutes.js',
  'routes/bookingRoutes.js',
  'routes/questionRoutes.js',
  'routes/specialSectionRoutes.js',
  'routes/contactQueryRoutes.js',
];

routeFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    warnings.push(`Route file missing: ${file}`);
    console.log(`   ⚠️  ${file} - Missing`);
  }
});

// Check 5: Verify model files exist
console.log('\n📊 Checking model files...');
const modelFiles = [
  'models/userModel.js',
  'models/carModel.js',
  'models/categoryModel.js',
  'models/blogModel.js',
  'models/mainBlogModel.js',
  'models/bookingModel.js',
  'models/questionModel.js',
  'models/specialSectionModel.js',
  'models/contactQueryModel.js',
];

modelFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    warnings.push(`Model file missing: ${file}`);
    console.log(`   ⚠️  ${file} - Missing`);
  }
});

// Check 6: Verify upload directories structure
console.log('\n📂 Checking upload directories...');
const uploadDirs = [
  'uploads',
  'uploads/cars',
  'uploads/categories',
  'uploads/main-blogs',
];

uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    warnings.push(`Upload directory missing: ${dir} (will be created on startup)`);
    console.log(`   ⚠️  ${dir}/ - Missing (will be auto-created)`);
  }
});

// Check 7: Check for .env.example or documentation
console.log('\n🔐 Checking environment configuration...');
const envExamplePath = path.join(__dirname, '..', '.env.example');
const readmePath = path.join(__dirname, '..', 'README.md');

if (fs.existsSync(envExamplePath)) {
  console.log(`   ✅ .env.example - Present`);
} else if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8');
  if (readme.includes('MONGODB_URI') || readme.includes('JWT_SECRET')) {
    console.log(`   ✅ Environment variables documented in README.md`);
  } else {
    warnings.push('Environment variables not documented');
    console.log(`   ⚠️  Environment variables not documented`);
  }
} else {
  warnings.push('No environment variable documentation found');
  console.log(`   ⚠️  No environment variable documentation`);
}

// Check 8: Verify Railway configuration
console.log('\n🚂 Checking Railway configuration...');
const railwayPath = path.join(__dirname, '..', 'railway.toml');
if (fs.existsSync(railwayPath)) {
  console.log(`   ✅ railway.toml - Present`);
} else {
  warnings.push('railway.toml not found (optional for Railway deployment)');
  console.log(`   ⚠️  railway.toml - Not found (optional)`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📋 Validation Summary\n');

if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! Backend is production-ready.');
  process.exit(0);
} else {
  if (errors.length > 0) {
    console.log(`❌ Found ${errors.length} error(s):`);
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error}`);
    });
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
    warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning}`);
    });
  }
  
  console.log('\n' + '='.repeat(50));
  
  if (errors.length > 0) {
    console.log('\n❌ Production validation failed. Please fix the errors above.');
    process.exit(1);
  } else {
    console.log('\n⚠️  Production validation completed with warnings. Backend should work, but review warnings above.');
    process.exit(0);
  }
}

