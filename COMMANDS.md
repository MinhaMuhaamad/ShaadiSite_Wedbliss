# WedBliss - Command Reference

## 🚀 Getting Started

### Run the Full Application (Recommended)
```bash
cd /vercel/share/v0-project
pnpm dev
```
This starts both frontend (port 3001) and backend (port 5000) concurrently.

**Output:**
```
[1] ▲ Next.js 16.2.4 (Turbopack)
[1] - Local:         http://localhost:3001
[0] Server running on port 5000
```

---

## 📦 Installation Commands

### Install All Dependencies
```bash
# Install frontend/root dependencies
pnpm install

# Install server dependencies
cd server && npm install && cd ..
```

### Install Specific Package
```bash
# Add a package to frontend
pnpm add package-name

# Add a package to backend
cd server && npm install package-name && cd ..
```

---

## 🎯 Development Commands

### Start Frontend Only
```bash
pnpm client
```
Runs Next.js dev server on http://localhost:3001

### Start Backend Only
```bash
cd server && npm run dev
```
Runs Express server on http://localhost:5000

### Build for Production
```bash
pnpm build
```

### Start Production Build
```bash
pnpm start
```

---

## 🧪 Testing Commands

### Run Linter
```bash
pnpm lint
```

### Type Check
```bash
pnpm type-check
```

---

## 🗄️ Database Commands

### Connect to MongoDB
```bash
# If running locally
mongo

# If using MongoDB Atlas
# Use your connection string from MongoDB Atlas dashboard
```

### Clear Database
```bash
# This will delete all data - BE CAREFUL!
cd server
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, () => {
  mongoose.connection.dropDatabase();
  console.log('Database cleared');
  process.exit();
});"
```

---

## 🔧 Utility Commands

### Check Port Usage
```bash
# Check what's using port 3000/3001
lsof -i :3001

# Check what's using port 5000
lsof -i :5000
```

### Kill Process on Port
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### Clear Node Modules
```bash
# Remove dependencies
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm install
```

### View Server Logs
```bash
# View real-time server output
tail -f /tmp/wedbliss.log

# View last 50 lines
tail -50 /tmp/wedbliss.log
```

---

## 📋 Project Structure Commands

### List Project Files
```bash
# Show directory tree
tree -L 2 -I 'node_modules'

# Show frontend files
ls -la app/

# Show backend files
ls -la server/
```

### View Environment Variables
```bash
# View frontend env
cat .env.local

# View backend env
cat server/.env
```

---

## 🐛 Debugging Commands

### Enable Debug Mode
```bash
# Frontend debug
DEBUG=* pnpm dev

# Backend debug
cd server && DEBUG=* npm run dev
```

### View Browser Console
1. Open http://localhost:3001
2. Press `F12` or `Cmd+Option+I`
3. Go to Console tab
4. Look for `[v0]` prefixed messages

### Network Inspection
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Watch API calls and responses

---

## 📝 Configuration Commands

### Reset Environment Variables
```bash
# Reset frontend config
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000' > .env.local

# Reset backend config
echo 'PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=dev_secret_key' > server/.env
```

---

## 🌐 Access URLs

### Frontend Pages
```
Landing:        http://localhost:3001
Sign In:        http://localhost:3001/auth/login
Sign Up:        http://localhost:3001/auth/register
Dashboard:      http://localhost:3001/dashboard
Weddings:       http://localhost:3001/dashboard/weddings
Guests:         http://localhost:3001/dashboard/guests
Budget:         http://localhost:3001/dashboard/budget
Vendors:        http://localhost:3001/dashboard/vendors
Timeline:       http://localhost:3001/dashboard/timeline
Chat:           http://localhost:3001/dashboard/chat
Memories:       http://localhost:3001/dashboard/memories
Profile:        http://localhost:3001/dashboard/profile
Settings:       http://localhost:3001/dashboard/settings
Admin:          http://localhost:3001/admin/dashboard
```

### Backend API
```
Base URL:       http://localhost:5000
API Root:       http://localhost:5000/api/
Auth:           http://localhost:5000/api/auth
Weddings:       http://localhost:5000/api/weddings
Guests:         http://localhost:5000/api/guests
Budget:         http://localhost:5000/api/budget
Vendors:        http://localhost:5000/api/vendors
```

---

## 🚀 Deployment Commands

### Build Docker Image
```bash
docker build -t wedbliss .
docker run -p 3000:3000 -p 5000:5000 wedbliss
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy Backend to Heroku
```bash
# Install Heroku CLI
npm i -g heroku

# Login to Heroku
heroku login

# Create app
heroku create wedbliss-api

# Deploy
git push heroku main
```

---

## 📊 Useful npm Scripts

From `package.json`:
```json
{
  "scripts": {
    "dev": "concurrently \"cd server && npm run dev\" \"npm run client\"",
    "client": "next dev",
    "server": "cd server && npm run dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint ."
  }
}
```

From `server/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

---

## 🎯 Quick Command Combinations

### Full Setup from Scratch
```bash
# 1. Install dependencies
pnpm install
cd server && npm install && cd ..

# 2. Setup environment
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000' > .env.local
echo 'PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=dev_secret' > server/.env

# 3. Start application
pnpm dev

# 4. Open browser
# Frontend: http://localhost:3001
# Backend: http://localhost:5000
```

### Fresh Start (Clear Everything)
```bash
# Stop running servers (Ctrl+C)

# Clear cache and dependencies
rm -rf node_modules server/node_modules .next
rm -f package-lock.json pnpm-lock.yaml server/package-lock.json

# Reinstall
pnpm install
cd server && npm install && cd ..

# Start fresh
pnpm dev
```

### Update All Dependencies
```bash
# Frontend
pnpm update

# Backend
cd server && npm update && cd ..
```

---

## 🔍 Troubleshooting Commands

### Check Node Version
```bash
node --version  # Should be v18+
npm --version
pnpm --version
```

### Verify Installation
```bash
# Check frontend packages
ls node_modules | head -20

# Check backend packages
ls server/node_modules | head -20
```

### Test API Connection
```bash
# Test if backend is running
curl http://localhost:5000

# Test auth endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### Test Frontend
```bash
# Check if frontend is running
curl http://localhost:3001

# Check Next.js health
curl http://localhost:3001/api/health 2>/dev/null || echo "Frontend running"
```

---

## 📚 Documentation Commands

### View Setup Guide
```bash
cat SETUP_GUIDE.md
```

### View Quick Start
```bash
cat QUICK_START.md
```

### View API Documentation
```bash
cat server/API_DOCUMENTATION.md
```

---

## ⚡ Pro Tips

### Faster Installs
```bash
# Use pnpm - faster than npm
pnpm install

# Or use Yarn
yarn install
```

### Automatic Reload
The dev server automatically reloads when you edit files. Just save!

### Debug Specific Component
Add this to any component:
```javascript
console.log("[v0] Component Name:", { prop1, prop2 });
```

Then check the browser console (F12) to see debug output.

### Environment Variables
- Never commit `.env` or `.env.local` files
- Copy `.env.example` to `.env.local` and fill in values
- Variables must restart the server to take effect

---

Enjoy developing with WedBliss! 🎉
