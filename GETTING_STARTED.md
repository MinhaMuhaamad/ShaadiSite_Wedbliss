# Getting Started with WedBliss

Welcome to WedBliss! This guide will help you get the application running locally and deployed to production.

## Quick Start (5 minutes)

### 1. Install Dependencies
```bash
cd /vercel/share/v0-project
pnpm install
cd server && npm install && cd ..
```

### 2. Setup Environment Variables
```bash
# Copy the server environment template
cp server/.env.example server/.env

# For local testing with MongoDB:
# Edit server/.env and use:
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=test_key_change_in_production
```

### 3. Start Development Servers
```bash
pnpm dev
```

### 4. Open in Browser
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## For Local Testing

Follow **LOCAL_TESTING.md** to:
- Test all features locally
- Verify database connectivity
- Check API endpoints
- Test authentication flow
- Verify mobile responsiveness

---

## For Production Deployment

Follow **DEPLOYMENT_GUIDE.md** to:
1. Setup MongoDB Atlas (cloud database)
2. Deploy backend to Render (free tier)
3. Deploy frontend to Vercel
4. Configure environment variables
5. Test production endpoints

---

## Project Structure

```
/vercel/share/v0-project/
├── app/                          # Next.js Frontend (15 pages)
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Login & Register
│   └── dashboard/               # Main app
│       ├── weddings/            # Wedding management
│       ├── guests/              # Guest list
│       ├── budget/              # Budget tracking
│       ├── vendors/             # Vendor marketplace
│       ├── timeline/            # Event timeline
│       ├── chat/                # Messaging
│       ├── memories/            # Photo albums
│       ├── profile/             # User settings
│       └── settings/            # Collaborators
├── server/                       # Express Backend
│   ├── models/                  # MongoDB schemas
│   ├── routes/                  # API endpoints
│   ├── controllers/             # Business logic
│   ├── middleware/              # Auth & validation
│   ├── .env.example             # Template
│   ├── .env                     # Local config
│   └── server.js                # Express setup
├── components/                   # React components
├── lib/                          # Utilities & context
├── DEPLOYMENT_GUIDE.md          # Production setup
├── LOCAL_TESTING.md             # Testing guide
├── DEPLOYMENT_CHECKLIST.md      # Pre-deployment checklist
└── README.md                     # Project overview
```

---

## Environment Variables

### Frontend (/.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Backend (/server/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**For Production:**
- `MONGODB_URI` → MongoDB Atlas connection string
- `JWT_SECRET` → Strong random string
- `CLIENT_URL` → Your Vercel frontend URL
- `NODE_ENV` → `production`

---

## Test Credentials

After signup/testing:
```
Email: test@example.com
Password: password123
Role: Bride (full access)
```

---

## Common Commands

```bash
# Start development
pnpm dev

# Start frontend only
npm run client

# Start backend only
cd server && npm run dev

# Build frontend
pnpm build

# Start production frontend
pnpm start

# Check for dependency issues
npm audit

# Install dependencies
pnpm install

# Clean and reinstall
rm -rf node_modules server/node_modules
pnpm install
cd server && npm install
```

---

## Troubleshooting

### Frontend not loading
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Backend not connecting
```bash
# Check port 5000 is not in use
lsof -ti:5000 | xargs kill -9

# Check MongoDB is running
ps aux | grep mongod
```

### MongoDB error
```bash
# Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
# Windows: Start MongoDB from Services
```

### CORS error in console
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify `CLIENT_URL` in `server/.env`
- Both must match your frontend/backend URLs

---

## Next Steps

1. **Local Testing**: Read `LOCAL_TESTING.md`
   - Run the application locally
   - Test all features
   - Verify database connection

2. **Production Setup**: Read `DEPLOYMENT_GUIDE.md`
   - Create MongoDB Atlas account
   - Deploy backend to Render
   - Deploy frontend to Vercel
   - Configure environment variables

3. **Pre-Deployment**: Use `DEPLOYMENT_CHECKLIST.md`
   - Verify all settings
   - Test endpoints
   - Ensure data persistence

---

## Architecture Overview

### Frontend Stack
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State**: React Context + localStorage
- **Authentication**: JWT tokens

### Backend Stack
- **Framework**: Express.js
- **Database**: MongoDB
- **Real-time**: Socket.io
- **Auth**: JWT + bcryptjs
- **Validation**: express-validator

### Deployment
- **Frontend**: Vercel (serverless, auto-scaling)
- **Backend**: Render (Node.js container, free tier)
- **Database**: MongoDB Atlas (cloud, free tier)
- **Cost**: $0/month for free tiers

---

## Features Implemented

✅ **User Management**
- Registration & Login
- Profile editing
- Collaborator management
- Role-based access (Bride, Family, Vendor, Admin)

✅ **Wedding Planning**
- Create & manage multiple weddings
- Track wedding progress
- Full wedding details

✅ **Guest Management**
- Guest list management
- RSVP tracking
- Dietary restrictions
- Send invitations

✅ **Budget Tracking**
- Budget overview
- Category-based expenses
- Visual charts (pie, bar)
- Budget alerts

✅ **Vendor Marketplace**
- Browse 150+ vendors
- Filter by category
- Vendor reviews & ratings
- Booking requests
- Vendor details & amenities

✅ **Timeline Management**
- Schedule wedding day events
- Assign vendors to events
- Track event duration
- Coordination reminders

✅ **Real-time Chat**
- Multi-channel messaging
- Direct & group chats
- Vendor communication
- Call/video placeholders

✅ **Photo Albums**
- Create & organize albums
- Like & share photos
- Download functionality
- Album management

✅ **Admin Dashboard**
- Platform analytics
- User statistics
- Wedding trends
- Vendor insights

---

## Documentation Files

| File | Purpose |
|------|---------|
| README.md | Project overview |
| SETUP_GUIDE.md | Detailed setup instructions |
| QUICK_START.md | Quick reference guide |
| COMMANDS.md | Useful development commands |
| FRONTEND_PAGES.md | Visual page layouts |
| LOCAL_TESTING.md | Local testing guide |
| DEPLOYMENT_GUIDE.md | Production deployment guide |
| DEPLOYMENT_CHECKLIST.md | Pre-deployment checklist |
| GETTING_STARTED.md | This file |

---

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Express.js: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- Vercel: https://vercel.com/docs
- Render: https://render.com/docs

### Deployment Platforms
- Vercel (Frontend): https://vercel.com
- Render (Backend): https://render.com
- MongoDB Atlas (Database): https://www.mongodb.com/cloud/atlas

### Community
- GitHub Issues: Create issue in your repo
- Stack Overflow: Tag with next.js, express, mongodb
- Discord: Next.js Discord community

---

## Quick Deployment Path

**Don't want to test locally?** Jump straight to production:

1. Get MongoDB Atlas string (see DEPLOYMENT_GUIDE.md)
2. Update `server/.env.example` → `server/.env`
3. Push to GitHub
4. Deploy backend to Render (5 min)
5. Deploy frontend to Vercel (5 min)
6. Update URLs and redeploy (2 min)
7. **Live in 15 minutes!** 🎉

---

## Security Checklist

Before going live:
- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Use MongoDB Atlas (not local MongoDB)
- [ ] Enable IP whitelist on MongoDB
- [ ] Use HTTPS everywhere (auto-enabled on Render/Vercel)
- [ ] Set NODE_ENV=production on backend
- [ ] Keep .env files out of Git (check .gitignore)
- [ ] Update vulnerable dependencies (npm audit fix)

---

## Performance Tips

1. **Database**: Create indexes on frequently searched fields
2. **Frontend**: Vercel automatically optimizes images
3. **Backend**: Render has auto-scaling for traffic spikes
4. **Caching**: Use Redis (optional, paid upgrade)

---

## Monitoring

### Check Backend Status
```bash
curl https://your-backend.onrender.com/api/health
```

### View Logs
- **Vercel**: Dashboard → Deployments → Logs
- **Render**: Dashboard → Service → Logs
- **MongoDB**: Atlas → Monitoring

### Error Tracking (Optional)
- Sentry: https://sentry.io (free tier)
- New Relic: https://newrelic.com

---

## FAQ

**Q: Do I need to pay for anything?**
A: No! All free tiers are sufficient for production.

**Q: How do I update the code after deployment?**
A: Push to GitHub → Auto-redeploy on Vercel/Render

**Q: Where is my data stored?**
A: MongoDB Atlas (cloud) - you can export anytime

**Q: Can I use my own domain?**
A: Yes! Add custom domain in Vercel/Render settings

**Q: How do I backup my database?**
A: MongoDB Atlas has auto-backups. Manual exports available.

---

## Version Info

- **Next.js**: 16.2.4
- **React**: 19
- **Node.js**: 18+
- **MongoDB**: 4.4+ (Atlas)
- **Express**: 5.2.1

---

## License

This project is open source and available for personal and commercial use.

---

## Ready?

Pick your path:

🏃 **Want to run locally?** → Read **LOCAL_TESTING.md**

🚀 **Want to go live?** → Read **DEPLOYMENT_GUIDE.md**

📋 **Need a checklist?** → Read **DEPLOYMENT_CHECKLIST.md**

---

**Happy Wedding Planning! 💍✨**

---

*Last updated: April 2026*
*WedBliss v1.0.0*
