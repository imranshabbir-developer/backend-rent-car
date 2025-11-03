# Railway Image Storage Setup

## ⚠️ Current Issue

Images are not showing because:
1. The `uploads/` directory is in `.gitignore` (so images aren't deployed to Railway)
2. Railway uses **ephemeral filesystems** - files are lost when the container restarts

## ✅ What's Already Fixed

1. ✅ Upload directories are created automatically on server startup
2. ✅ Static file serving is configured (`/uploads` route)
3. ✅ Frontend is configured to use Railway backend URL for images

## 🔧 Solutions

### Option 1: Re-upload Images (Quick Fix)
After deploying to Railway:
1. Go to your dashboard
2. Re-upload all car and category images
3. Images will work until Railway restarts the container

**Note:** Images will be lost on Railway container restart.

---

### Option 2: Use Cloud Storage (Recommended for Production)

Use a cloud storage service like:
- **Cloudinary** (recommended - free tier available)
- **AWS S3**
- **Google Cloud Storage**
- **Azure Blob Storage**

#### Quick Cloudinary Setup:

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your API credentials
3. Install: `npm install cloudinary`
4. Update `uploadMiddleware.js` to upload to Cloudinary instead of local filesystem
5. Store Cloudinary URLs in database instead of local paths

**Benefits:**
- ✅ Images persist permanently
- ✅ CDN delivery (faster loading)
- ✅ Automatic image optimization
- ✅ No storage limits (on free tier)

---

### Option 3: Railway Persistent Volume (Medium Complexity)

1. Go to Railway dashboard
2. Add a **Persistent Volume** to your service
3. Mount it to `/uploads` directory
4. Update deployment to use the volume

**Note:** Requires Railway Pro plan or specific setup.

---

### Option 4: Temporary Git Commit (Quick but not recommended)

1. Remove `uploads/` from `.gitignore` temporarily
2. Commit images to git
3. Push to Railway
4. Re-add `uploads/` to `.gitignore`

**Warning:** This increases repository size and isn't scalable.

---

## 📝 Current Status

- ✅ Directories created on startup
- ✅ Static file serving configured
- ✅ Frontend URL configured
- ⚠️ Images need to be re-uploaded after deployment

## 🚀 Next Steps

1. **For immediate testing:** Re-upload images through your dashboard
2. **For production:** Set up Cloudinary or another cloud storage service

---

## 🔗 Helpful Links

- [Railway Persistent Volumes](https://docs.railway.app/storage/volumes)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Express Static Files](https://expressjs.com/en/starter/static-files.html)

