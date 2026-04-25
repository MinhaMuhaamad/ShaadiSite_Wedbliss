# WedBliss Deployment Guide

## Overview
This guide will help you deploy WedBliss to production using Vercel (frontend) and Render or Railway (backend) with MongoDB Atlas.

## Prerequisites
- GitHub account
- Vercel account (free)
- Render.com or Railway.app account (free tier available)
- MongoDB Atlas account (free tier available)

---

## Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a new project (or use default)
4. Click "Build a Cluster"

### 1.2 Create a Cluster
1. Choose "M0 Sandbox" (free tier)
2. Select your region
3. Click "Create Cluster" (wait 5-10 minutes)

### 1.3 Create Database User
1. In the left sidebar, go to "Database Access"
2. Click "Add New Database User"
3. Create username: `wedbliss_user`
4. Create password: `WedBliss123` (or your own)
5. Click "Add User"

### 1.4 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<username>` and `<password>` with your credentials
5. Replace `<database_name>` with `wedbliss`

**Example:**
```
mongodb+srv://wedbliss_user:WedBliss123@wedbliss-cluster.mongodb.net/wedbliss?retryWrites=true&w=majority
```

### 1.5 Whitelist IP Address
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0)
4. Confirm

---

## Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub
```bash
# Create a new GitHub repository
# Push your code:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedbliss.git
git push -u origin main
```

### 2.2 Deploy Backend Service
1. Go to https://render.com
2. Sign up and create new account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Fill in the details:
   - **Name:** `wedbliss-backend`
   - **Environment:** `Node`
   - **Build Command:** `cd server && npm install`
   - **Start Command:** `cd server && npm start`
6. Click "Advanced"
7. Add Environment Variables:

```
MONGODB_URI=mongodb+srv://wedbliss_user:WedBliss123@wedbliss-cluster.mongodb.net/wedbliss?retryWrites=true&w=majority
JWT_SECRET=your_secure_random_string_here
NODE_ENV=production
CLIENT_URL=https://your-frontend-domain.vercel.app
PORT=10000
```

8. Click "Create Web Service"
9. Wait for deployment (2-5 minutes)
10. Copy the URL (e.g., `https://wedbliss-backend.onrender.com`)

### 2.3 Update Frontend with Backend URL
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://wedbliss-backend.onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Create Vercel Project
1. Go to https://vercel.com
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### 3.2 Configure Project
1. Set Framework: `Next.js`
2. Root Directory: `./` (default)
3. Environment Variables:

```
NEXT_PUBLIC_API_URL=https://wedbliss-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://wedbliss-backend.onrender.com
```

4. Click "Deploy"
5. Wait for deployment (2-3 minutes)

### 3.3 Get Your Frontend URL
After deployment completes, Vercel will give you a URL like:
```
https://wedbliss.vercel.app
```

---

## Step 4: Update Backend CORS

Now update your backend with the correct frontend URL:

### 4.1 Update Render Environment
1. Go to Render dashboard
2. Select `wedbliss-backend` service
3. Go to "Environment"
4. Update `CLIENT_URL` to your Vercel URL:
```
CLIENT_URL=https://wedbliss.vercel.app
```

5. Click "Save" (this will trigger a redeploy)

---

## Step 5: Test the Deployment

### 5.1 Test Frontend
1. Open https://wedbliss.vercel.app
2. You should see the landing page
3. Try to sign up or log in
4. You should be able to authenticate

### 5.2 Test API Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Check that API requests go to your Render backend
5. No CORS errors should appear

---

## Database

### View Your Data
1. Go to MongoDB Atlas dashboard
2. Click "Collections" on your cluster
3. You'll see your data there

### Useful MongoDB Queries
```javascript
// View all users
db.users.find()

// View all weddings
db.weddings.find()

// View all guests
db.guests.find()

// Delete all data (use carefully!)
db.users.deleteMany({})
```

---

## Troubleshooting

### Issue: CORS Error
**Solution:**
- Check `CLIENT_URL` in backend .env
- Ensure it matches your Vercel frontend URL
- Redeploy backend

### Issue: MongoDB Connection Error
**Solution:**
- Check MONGODB_URI is correct in Render
- Ensure IP whitelist includes 0.0.0.0/0
- Check username and password are correct

### Issue: Backend Timeout
**Solution:**
- Render free tier has 15-minute limit
- If idle, redeploy manually
- Consider upgrading to paid tier

### Issue: Frontend Not Loading
**Solution:**
- Clear cache and reload
- Check NEXT_PUBLIC_API_URL in Vercel env vars
- Check browser console for errors

### Issue: Socket.io Not Working
**Solution:**
- Socket.io requires same origin as API
- Use same URL for API and Socket.io
- Update NEXT_PUBLIC_SOCKET_URL in Vercel

---

## Performance Tips

1. **Database Optimization**
   - Add indexes to frequently queried fields
   - MongoDB Atlas automatically handles this

2. **Frontend Optimization**
   - Vercel automatically optimizes Next.js builds
   - Images are optimized via Vercel Image Optimization

3. **Backend Optimization**
   - Render has auto-scaling
   - Monitor logs in Render dashboard

---

## Monitoring

### Check Backend Logs
1. Go to Render dashboard
2. Select your service
3. Click "Logs"
4. Real-time logs appear

### Check Frontend Logs
1. Go to Vercel dashboard
2. Select your project
3. Go to "Deployments"
4. Click on a deployment
5. View build logs

### Monitor API Usage
```bash
# SSH into Render to check logs:
# Click "Connect" on your service
# Then use tail -f to watch logs
```

---

## Security Best Practices

1. **Change Default Passwords**
   - MongoDB user password
   - JWT_SECRET should be random

2. **Use Environment Variables**
   - Never commit secrets to GitHub
   - Use Vercel and Render env var panels

3. **Enable MongoDB IP Whitelist**
   - Whitelist only your Render IP
   - Or use VPC (premium feature)

4. **Update Dependencies**
   ```bash
   npm audit
   npm audit fix
   ```

---

## Domain Setup (Optional)

### Custom Domain on Vercel
1. Go to Vercel project settings
2. Click "Domains"
3. Enter your domain
4. Follow DNS setup instructions

### Custom Domain on Render
1. Go to your service settings
2. Click "Custom Domain"
3. Follow DNS setup instructions

---

## Cost Estimation

| Service | Cost | Notes |
|---------|------|-------|
| Vercel Frontend | Free | Up to 100GB bandwidth |
| Render Backend | Free | 0.1 credits/hour (free tier includes this) |
| MongoDB Atlas | Free | Up to 5GB storage |
| **Total** | **Free** | Sufficient for production |

---

## Next Steps

1. Test all functionality in production
2. Set up error monitoring (Sentry)
3. Add email notifications (SendGrid)
4. Configure payment (Stripe)
5. Set up analytics (Vercel Analytics)

---

## Support

For issues with:
- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs
- **MongoDB:** https://docs.mongodb.com/

---

**Congratulations! Your WedBliss application is now deployed!** 🎉
