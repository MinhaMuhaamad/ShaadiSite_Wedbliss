# WedBliss Deployment Checklist

## Pre-Deployment Setup

### Database Setup
- [ ] Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
- [ ] Create a cluster (M0 free tier)
- [ ] Create database user (wedbliss_user / WedBliss123)
- [ ] Copy connection string with credentials
- [ ] Whitelist IP address (0.0.0.0/0 for testing)
- [ ] Connection string format check:
  ```
  mongodb+srv://username:password@cluster.mongodb.net/wedbliss?retryWrites=true&w=majority
  ```

### GitHub Repository Setup
- [ ] Create GitHub account if not exists
- [ ] Initialize git in project: `git init`
- [ ] Add all files: `git add .`
- [ ] First commit: `git commit -m "Initial commit"`
- [ ] Create new repository on GitHub
- [ ] Push code: `git remote add origin <your-repo-url>` && `git push -u origin main`
- [ ] Verify code is on GitHub

### Environment Variables Setup
- [ ] Copy `/server/.env.example` to `/server/.env`
- [ ] Update MONGODB_URI with your Atlas connection string
- [ ] Generate JWT_SECRET:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Copy generated JWT_SECRET to `/server/.env`
- [ ] Verify `.env` file is in `.gitignore` (don't commit secrets!)

---

## Backend Deployment (Render)

### Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub
- [ ] Connect GitHub account

### Deploy Backend Service
- [ ] Click "New +" → "Web Service"
- [ ] Select your GitHub repository
- [ ] Fill deployment details:
  - Name: `wedbliss-backend`
  - Environment: `Node`
  - Region: `Oregon` or closest to you
  - Plan: `Free`
  - Build Command: `cd server && npm install`
  - Start Command: `cd server && npm start`
  - [ ] Save and continue

### Configure Environment Variables (in Render)
- [ ] Click "Advanced" 
- [ ] Add environment variables:
  - `MONGODB_URI`: Your Atlas connection string
  - `JWT_SECRET`: Your generated secret
  - `NODE_ENV`: `production`
  - `CLIENT_URL`: Leave empty for now (update after frontend deployed)
  - `PORT`: `10000`
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-5 minutes)
- [ ] Check "Logs" for any errors
- [ ] Note your backend URL: `https://wedbliss-backend.onrender.com`

### Test Backend
- [ ] Visit `https://wedbliss-backend.onrender.com/api/health`
- [ ] Should return `{"status":"ok","message":"WedBliss API is running"}`

---

## Frontend Deployment (Vercel)

### Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub

### Deploy Frontend
- [ ] Click "New Project"
- [ ] Select your GitHub repository
- [ ] Click "Import"
- [ ] Framework: `Next.js` (should auto-detect)
- [ ] Root Directory: `./`
- [ ] Build Settings: Default (auto-detected)

### Configure Environment Variables (in Vercel)
- [ ] Go to "Environment Variables"
- [ ] Add:
  - Key: `NEXT_PUBLIC_API_URL`
  - Value: `https://wedbliss-backend.onrender.com` (your Render URL)
  - Scopes: `Production`, `Preview`, `Development`
  - [ ] Add Variable
- [ ] Add:
  - Key: `NEXT_PUBLIC_SOCKET_URL`
  - Value: `https://wedbliss-backend.onrender.com` (same as API URL)
  - Scopes: `Production`, `Preview`, `Development`
  - [ ] Add Variable
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Note your frontend URL: `https://wedbliss.vercel.app`

### Test Frontend
- [ ] Visit your Vercel URL
- [ ] Landing page should load
- [ ] Navigation should work
- [ ] No CORS errors in console

---

## Post-Deployment Updates

### Update Backend CORS URL
- [ ] Go to Render dashboard
- [ ] Select `wedbliss-backend` service
- [ ] Go to "Environment"
- [ ] Update `CLIENT_URL` to: `https://wedbliss.vercel.app` (your Vercel URL)
- [ ] Click "Save" (service will redeploy automatically)
- [ ] Wait for redeploy to complete (1-2 minutes)

### Verify CORS is Working
- [ ] Open frontend in new browser window
- [ ] Open DevTools (F12) → Network tab
- [ ] Try to login
- [ ] Check that API request succeeds (no CORS errors)

---

## End-to-End Testing

### Authentication Flow
- [ ] Go to `/auth/register`
- [ ] Create new account with test data
- [ ] Check MongoDB Atlas - user should appear in database
- [ ] Go to `/auth/login`
- [ ] Login with your account
- [ ] Should redirect to `/dashboard`

### Core Features Testing
- [ ] **Dashboard**: Should load with no errors
- [ ] **Create Wedding**: Add a new wedding
- [ ] **Guest Management**: Add guests
- [ ] **Budget Tracking**: Add budget items
- [ ] **Vendors**: Browse vendor list
- [ ] **Chat**: Send messages (should not error)
- [ ] **Memories**: View album list

### Database Verification
- [ ] Go to MongoDB Atlas
- [ ] Click "Collections"
- [ ] Should see your data:
  - `users` collection with your account
  - `weddings` with created wedding
  - `guests` with added guests
  - `budgets` with budget items

---

## Troubleshooting During Deployment

### Backend Won't Deploy
- [ ] Check Render logs for errors
- [ ] Verify MONGODB_URI is correct
- [ ] Check JWT_SECRET is set
- [ ] Ensure `server/package.json` has all dependencies
- [ ] Try manual redeploy in Render dashboard

### Frontend Won't Connect to Backend
- [ ] Check NEXT_PUBLIC_API_URL in Vercel env vars
- [ ] Verify backend service is running (check `/api/health`)
- [ ] Check browser console for CORS errors
- [ ] Clear browser cache and reload
- [ ] Verify CLIENT_URL in backend matches frontend URL

### MongoDB Connection Error
- [ ] Check MONGODB_URI format (includes `?retryWrites=true&w=majority`)
- [ ] Verify username:password are correct
- [ ] Check IP whitelist includes 0.0.0.0/0
- [ ] Test connection string locally first

### Port Issues
- [ ] Render assigns dynamic port (10000)
- [ ] Process uses `process.env.PORT` (check server.js)
- [ ] Should not hardcode port to 5000 in production

---

## Production Optimizations (Optional)

### Custom Domains
- [ ] Register domain (Namecheap, GoDaddy, etc.)
- [ ] Vercel: Add custom domain in Settings
- [ ] Render: Add custom domain in Settings
- [ ] Update DNS records per instructions

### Monitoring
- [ ] Vercel: Enable Analytics in Settings
- [ ] Render: Check logs regularly
- [ ] MongoDB Atlas: Monitor storage usage

### Backups
- [ ] MongoDB Atlas: Enable automated backups
- [ ] GitHub: Repository is your code backup
- [ ] Periodic manual exports if needed

### Security
- [ ] Change default passwords (MongoDB user)
- [ ] Use strong JWT_SECRET (random 32+ characters)
- [ ] Enable IP whitelist on MongoDB (if possible)
- [ ] Implement rate limiting in API (future)
- [ ] Use HTTPS everywhere (Vercel/Render auto-enable)

---

## Maintenance Checklist

### Weekly
- [ ] Check Render logs for errors
- [ ] Check Vercel deployment status
- [ ] Monitor MongoDB storage usage

### Monthly
- [ ] Update npm dependencies: `npm audit fix`
- [ ] Review error logs
- [ ] Backup MongoDB (if manual backup enabled)

### Quarterly
- [ ] Major version updates if needed
- [ ] Security audit
- [ ] Performance review

---

## Common Commands

```bash
# Test locally before deployment
pnpm dev

# Check for dependency issues
npm audit

# Generate new JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# View server logs (if SSH'd into Render)
tail -f logs

# Access MongoDB directly (locally)
mongosh "your-connection-string"
```

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Render Docs:** https://render.com/docs
- **MongoDB Docs:** https://docs.mongodb.com
- **Next.js Docs:** https://nextjs.org/docs
- **Express.js Docs:** https://expressjs.com

---

## Final Verification

Before marking as complete, verify:
- [ ] Frontend loads without errors
- [ ] Can create account
- [ ] Can login
- [ ] Can create wedding
- [ ] Can add guests
- [ ] Can add budget items
- [ ] Can browse vendors
- [ ] Data persists after refresh
- [ ] No CORS errors in console
- [ ] API requests working correctly
- [ ] MongoDB has data
- [ ] Both services running in production

---

**Deployment Complete! Your WedBliss application is live!** 🎉
