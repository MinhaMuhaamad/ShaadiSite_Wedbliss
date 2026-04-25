# WedBliss Deployment Flow

## Complete Visual Guide to Deployment Process

---

## Step-by-Step Deployment Flow

```
START
  │
  ├─→ STEP 1: Local Setup (15 min)
  │    ├─ pnpm install
  │    ├─ cd server && npm install
  │    ├─ Copy .env files
  │    └─ pnpm dev ✅ Verify works locally
  │
  ├─→ STEP 2: Test Locally (45 min)
  │    ├─ Create account
  │    ├─ Test all features
  │    ├─ Check MongoDB data
  │    └─ Verify no console errors ✅
  │
  ├─→ STEP 3: GitHub Setup (10 min)
  │    ├─ git init
  │    ├─ git add .
  │    ├─ git commit -m "Initial"
  │    ├─ Create GitHub repo
  │    └─ git push -u origin main ✅
  │
  ├─→ STEP 4: MongoDB Atlas (15 min)
  │    ├─ Create account at mongodb.com/cloud/atlas
  │    ├─ Create cluster (M0 free)
  │    ├─ Create user (wedbliss_user)
  │    ├─ Get connection string
  │    ├─ Whitelist IP (0.0.0.0/0)
  │    └─ Test connection ✅
  │
  ├─→ STEP 5: Deploy Backend (10 min)
  │    ├─ Go to render.com
  │    ├─ New Web Service
  │    ├─ Select GitHub repo
  │    ├─ Fill in settings
  │    │  ├─ Name: wedbliss-backend
  │    │  ├─ Environment: Node
  │    │  ├─ Build: cd server && npm install
  │    │  └─ Start: cd server && npm start
  │    ├─ Add env vars
  │    │  ├─ MONGODB_URI (from Atlas)
  │    │  ├─ JWT_SECRET
  │    │  ├─ NODE_ENV=production
  │    │  └─ CLIENT_URL (update later)
  │    ├─ Deploy
  │    └─ Wait 5-10 min ✅
  │
  ├─→ STEP 6: Deploy Frontend (10 min)
  │    ├─ Go to vercel.com
  │    ├─ New Project
  │    ├─ Select GitHub repo
  │    ├─ Framework: Next.js (auto)
  │    ├─ Add env vars
  │    │  ├─ NEXT_PUBLIC_API_URL=https://render-backend-url.com
  │    │  └─ NEXT_PUBLIC_SOCKET_URL=https://render-backend-url.com
  │    ├─ Deploy
  │    └─ Wait 5 min ✅
  │
  ├─→ STEP 7: Update Backend CORS (5 min)
  │    ├─ Go to Render dashboard
  │    ├─ Select wedbliss-backend service
  │    ├─ Environment variables
  │    ├─ Update CLIENT_URL to Vercel URL
  │    ├─ Save (auto redeploy)
  │    └─ Wait 2 min ✅
  │
  ├─→ STEP 8: Verify Deployment (10 min)
  │    ├─ Visit frontend URL
  │    ├─ Try to login
  │    ├─ Check browser console (no CORS errors)
  │    ├─ Verify in MongoDB Atlas
  │    └─ Test all features ✅
  │
  └─→ DONE! 🎉 Live in Production

TOTAL TIME: ~2 hours (mostly waiting for builds)
```

---

## Architecture Diagram

### Local Development
```
┌──────────────────────────────────────────────────────┐
│  Your Computer                                       │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Frontend (http://localhost:3000)               │ │
│  │  React/Next.js - Running via `pnpm dev`        │ │
│  └────────────────┬─────────────────────────────┘ │
│                   │ HTTP Calls                     │
│  ┌────────────────↓─────────────────────────────┐ │
│  │  Backend (http://localhost:5000)              │ │
│  │  Express/Node.js - Running via npm run dev   │ │
│  └────────────────┬─────────────────────────────┘ │
│                   │ Mongoose Queries              │
│  ┌────────────────↓─────────────────────────────┐ │
│  │  MongoDB (mongodb://localhost:27017)          │ │
│  │  Local MongoDB Server                         │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Production Deployment
```
┌──────────────────────────────────────────────────────────────┐
│  INTERNET / PRODUCTION                                       │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Frontend                                                ││
│  │  ✅ Hosted on Vercel                                    ││
│  │  ✅ Auto-deployed from GitHub                          ││
│  │  ✅ Domain: https://yourdomain.vercel.app             ││
│  │  ✅ URL: NEXT_PUBLIC_API_URL → Backend                 ││
│  └────────────────┬────────────────────────────────────┘│
│                   │ HTTPS Calls                          │
│  ┌────────────────↓────────────────────────────────────┐│
│  │  Backend                                             ││
│  │  ✅ Hosted on Render                                ││
│  │  ✅ Auto-deployed from GitHub                      ││
│  │  ✅ Domain: https://yourdomain.onrender.com         ││
│  │  ✅ Health Check: /api/health                       ││
│  └────────────────┬────────────────────────────────────┘│
│                   │ Mongoose Queries (HTTPS)             │
│  ┌────────────────↓────────────────────────────────────┐│
│  │  Database                                            ││
│  │  ✅ MongoDB Atlas (Cloud)                           ││
│  │  ✅ URL: mongodb+srv://user:pass@cluster...        ││
│  │  ✅ Automatic backups                              ││
│  │  ✅ High availability                              ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │  GitHub (Code Repository)                          ││
│  │  ✅ Trigger: Push code → Auto-deploy to Vercel    ││
│  │  ✅ Trigger: Push code → Auto-deploy to Render    ││
│  │  ✅ History: All deployments tracked               ││
│  └────────────────────────────────────────────────────┘│
│                                                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Deployment Component Matrix

| Component | Local | Dev | Production |
|-----------|-------|-----|-----------|
| **Frontend** | localhost:3000 | vercel.app | yourdom.vercel.app |
| **Backend** | localhost:5000 | onrender.com | yourdomain.onrender.com |
| **Database** | mongodb://local | mongodb+srv://atlas | mongodb+srv://atlas |
| **Auth** | JWT token | JWT token | JWT token |
| **SSL/TLS** | ❌ | ✅ Auto | ✅ Auto |
| **Backups** | Manual | Auto | Auto |
| **Scaling** | None | Manual | Auto |
| **Cost** | $0 | $0 (free tier) | Free or $$ |

---

## Environment Variables Mapping

### Frontend Environment Variables

**Local (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Production (Vercel Dashboard)**
```
NEXT_PUBLIC_API_URL=https://wedbliss-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://wedbliss-backend.onrender.com
```

### Backend Environment Variables

**Local (/server/.env)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=development_key_change_in_production
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Production (Render Dashboard)**
```
PORT=10000 (auto-assigned)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/wedbliss?retryWrites=true&w=majority
JWT_SECRET=very_secure_random_32_char_string
CLIENT_URL=https://yourapp.vercel.app
NODE_ENV=production
```

---

## Deployment Decision Tree

```
                    Ready to Deploy?
                          │
              ┌───────────┴──────────┐
              │                      │
             NO                     YES
              │                      │
              ↓                      ↓
        LOCAL_TESTING.md      DEPLOYMENT_GUIDE.md
        ├─ Setup locally           ├─ Create MongoDB Atlas
        ├─ Test all features       ├─ Deploy backend
        ├─ Verify API              ├─ Deploy frontend
        ├─ Check database          ├─ Update URLs
        ├─ Check console           └─ Verify
        └─ Fix issues
                │
                └──→ YES? ──→ DEPLOYMENT_GUIDE.md
```

---

## Data Flow Diagram

### User Registration Flow
```
User Browser
     │
     │ 1. Fill form
     ↓
Frontend (Vercel)
     │
     │ 2. POST /api/auth/register
     ↓
Backend (Render)
     │
     │ 3. Validate email
     │ 4. Hash password (bcryptjs)
     │ 5. Save to MongoDB
     ↓
Database (MongoDB Atlas)
     │
     │ 6. Return user ID
     ↓
Backend (Render)
     │
     │ 7. Create JWT token
     │ 8. Return token + user
     ↓
Frontend (Vercel)
     │
     │ 9. Save token to localStorage
     │ 10. Redirect to /dashboard
     ↓
User Dashboard
```

### API Call Flow
```
Frontend (Browser)
     │
     │ 1. Make request with Authorization header
     │    Headers: { Authorization: "Bearer token" }
     ↓
Backend (Express)
     │
     │ 2. Check Authorization header
     │ 3. Verify JWT token
     │ 4. Get user ID from token
     │ 5. Validate user exists
     ↓
Database (MongoDB)
     │
     │ 6. Query user data
     │ 7. Return to backend
     ↓
Backend (Express)
     │
     │ 8. Format response
     │ 9. Send JSON response
     ↓
Frontend (Browser)
     │
     │ 10. Update UI with data
     │ 11. Handle errors if any
     ↓
User sees updated data
```

---

## Deployment Timeline

### Quick Timeline
```
Time    Activity                      Platform
────────────────────────────────────────────
0:00    Local setup                   Your Machine
0:15    Local testing                 Your Machine
0:45    Push to GitHub                GitHub
1:00    Deploy backend                Render (5-10 min wait)
1:15    Deploy frontend               Vercel (5 min wait)
1:25    Update URLs                   Render
1:30    Final verification            Browser
────────────────────────────────────────────
TOTAL:  ~1.5 hours (mostly waiting)
```

### Detailed Timeline
```
HOUR 0:00 - 1:00: Local Setup & Testing
  0:00 - 0:15  Install dependencies (pnpm install)
  0:15 - 0:30  Setup environment files (.env)
  0:30 - 0:45  Run locally (pnpm dev)
  0:45 - 1:00  Test features (create account, add data)

HOUR 1:00 - 2:00: GitHub & Database
  1:00 - 1:15  Create GitHub repo and push code
  1:15 - 2:00  Setup MongoDB Atlas account and cluster

HOUR 2:00 - 3:00: Backend Deployment
  2:00 - 2:15  Create Render account
  2:15 - 2:45  Configure backend deployment
  2:45 - 3:00  Wait for deployment to complete

HOUR 3:00 - 4:00: Frontend Deployment
  3:00 - 3:15  Create Vercel account
  3:15 - 3:45  Configure frontend deployment
  3:45 - 4:00  Wait for deployment to complete

HOUR 4:00 - 4:30: Post-Deployment
  4:00 - 4:15  Update backend CLIENT_URL
  4:15 - 4:30  Test production endpoints

DONE! Application is live!
```

---

## Verification Points

At each stage, verify these things work:

### Local Development ✅
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend running at http://localhost:5000
- [ ] Can create account
- [ ] Can login
- [ ] Data appears in MongoDB
- [ ] No console errors

### MongoDB Atlas ✅
- [ ] Account created
- [ ] Cluster running
- [ ] Database user created
- [ ] IP whitelist enabled
- [ ] Connection string works
- [ ] Can connect with mongo shell

### Backend Deployment ✅
- [ ] Service created on Render
- [ ] GitHub connected
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Health check works: /api/health
- [ ] Logs show "MongoDB connected"

### Frontend Deployment ✅
- [ ] Project created on Vercel
- [ ] GitHub connected
- [ ] Environment variables set
- [ ] Deployment successful
- [ ] Page loads in browser
- [ ] Correct Vercel URL assigned

### Post-Deployment ✅
- [ ] Backend CLIENT_URL updated
- [ ] No CORS errors in console
- [ ] Can login in production
- [ ] Data persists in MongoDB
- [ ] Chat works (Socket.io)
- [ ] All features functioning

---

## Rollback Procedure

If something goes wrong:

### Backend Rollback
```
1. Go to Render dashboard
2. Select your service
3. Click "Deployments"
4. Find previous working deployment
5. Click "Redeploy"
6. Wait 5 minutes
```

### Frontend Rollback
```
1. Go to Vercel dashboard
2. Select your project
3. Click "Deployments"
4. Find previous working deployment
5. Click "Redeploy"
6. Wait 3 minutes
```

### Database Rollback
```
1. Go to MongoDB Atlas
2. Click "Backup" (if enabled)
3. Click "Restore" on previous backup
4. Confirm restore operation
5. Wait for restore to complete
```

---

## Common Deployment Issues & Solutions

### Issue: Blank Frontend
**Diagnosis:**
```
Browser console: No errors
But page is blank
```
**Solution:**
1. Check NEXT_PUBLIC_API_URL in Vercel env vars
2. Verify backend is running
3. Clear browser cache
4. Check network tab for API errors

### Issue: CORS Error
**Diagnosis:**
```
Browser console: Access-Control-Allow-Origin error
API requests failing
```
**Solution:**
1. Check CLIENT_URL in Render env vars
2. Must match frontend domain exactly
3. Update and redeploy backend
4. Wait 2 minutes for redeploy

### Issue: MongoDB Connection Error
**Diagnosis:**
```
Backend logs: MongoDB connection error
Backend won't start
```
**Solution:**
1. Check MONGODB_URI format
2. Verify username:password are correct
3. Check IP whitelist on Atlas
4. Test connection string locally first

### Issue: API 404 Errors
**Diagnosis:**
```
Browser: 404 on API calls
Backend is running but no routes
```
**Solution:**
1. Verify NEXT_PUBLIC_API_URL is correct
2. Check backend logs for route errors
3. Ensure all route files exist in /server/routes
4. Check express is serving routes

### Issue: Socket.io Not Working
**Diagnosis:**
```
Chat not updating in real-time
Browser console: WebSocket error
```
**Solution:**
1. Check NEXT_PUBLIC_SOCKET_URL matches API_URL
2. Verify Socket.io is running on backend
3. Check firewall isn't blocking WebSocket
4. Verify CORS includes socket connections

---

## Performance Metrics

After deployment, you should see:

| Metric | Target | Tool |
|--------|--------|------|
| Page Load Time | < 3 seconds | Vercel Analytics |
| API Response | < 500ms | Browser DevTools |
| Uptime | > 99.9% | Render Monitoring |
| Database Latency | < 100ms | MongoDB Atlas |

---

## Monitoring Dashboard

### Vercel Monitoring
- Go to Vercel dashboard
- Click your project
- View: Deployments, Analytics, Usage

### Render Monitoring
- Go to Render dashboard
- Select your service
- View: Logs, Metrics, Deployments

### MongoDB Monitoring
- Go to MongoDB Atlas
- Click your cluster
- View: Monitoring, Collections, Metrics

---

## Scaling Path (Future)

As your application grows:

```
Free Tier          → Paid Tier        → Enterprise
┌─────────────┐    ┌──────────────┐   ┌────────────────┐
│ Vercel Free │    │ Vercel Hobby │   │ Vercel Pro     │
│ $0/month    │ →  │ $20/month    │ → │ Custom pricing │
└─────────────┘    └──────────────┘   └────────────────┘

┌──────────────┐    ┌──────────────┐   ┌────────────────┐
│ Render Free  │    │ Render Paid  │   │ Render Scaling │
│ $0/month     │ →  │ $12/month    │ → │ Custom pricing │
└──────────────┘    └──────────────┘   └────────────────┘

┌────────────────┐  ┌────────────────┐  ┌──────────────────┐
│ MongoDB Free   │  │ MongoDB Shared │  │ MongoDB Dedicated│
│ $0/month       │→ │ $57/month      │→ │ Custom pricing   │
│ 5GB            │  │ 10GB+          │  │ Unlimited        │
└────────────────┘  └────────────────┘  └──────────────────┘
```

---

## Success! 🎉

After following this guide:
- ✅ Application live on Vercel
- ✅ API running on Render
- ✅ Database on MongoDB Atlas
- ✅ Automatic deployments from GitHub
- ✅ Scalable architecture
- ✅ Zero upfront costs

**Happy Deploying!** 🚀

---

*Created: April 25, 2026*
*For: WedBliss v1.0.0*
*Status: Production Ready*
