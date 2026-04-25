# WedBliss Local Testing Guide

Before deploying to production, test all features locally to ensure everything works correctly.

## Prerequisites

```bash
# Install Node.js 18+
node --version

# Install MongoDB locally (or use MongoDB Atlas)
# Download from: https://www.mongodb.com/try/download/community
```

## Step 1: Setup Local Environment

### 1.1 Install Dependencies

```bash
# Install frontend dependencies
pnpm install

# Install server dependencies
cd server
npm install
cd ..
```

### 1.2 Configure Environment Variables

Create `/server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=test_secret_key_for_development_change_in_production
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Create `/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 1.3 Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Windows
# Start MongoDB Community Server from Services

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**
```
# Update MONGODB_URI in /server/.env with your Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedbliss?retryWrites=true&w=majority
```

## Step 2: Start Development Servers

```bash
# From project root, start both frontend and backend concurrently
pnpm dev

# This should output:
# ✓ Compiled successfully
# ▲ Next.js 16.2.4
# - Local: http://localhost:3000
# - Environments: .env.local
# 
# And backend should show:
# Server running on port 5000
# MongoDB connected successfully
```

## Step 3: Test Frontend

### 3.1 Landing Page
1. Open http://localhost:3000
2. You should see the WedBliss landing page
3. Click "Get Started" - should navigate to sign up
4. Click logo - should go back to home

### 3.2 Sign Up
1. Go to http://localhost:3000/auth/register
2. Fill in form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Role: Bride
3. Click "Sign Up"
4. Should redirect to dashboard

### 3.3 Login
1. Go to http://localhost:3000/auth/login
2. Enter test@example.com / password123
3. Click "Sign In"
4. Should redirect to dashboard

### 3.4 Dashboard
1. Should see "Welcome back" message
2. Should display statistics
3. Navigation sidebar should be visible
4. All menu items should be clickable

## Step 4: Test API Endpoints

### 4.1 Test Health Check
```bash
curl http://localhost:5000/api/health
# Should return:
# {"status":"ok","message":"WedBliss API is running",...}
```

### 4.2 Test Login (API)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Should return user and token:
# {"token":"eyJhbGc...","user":{"id":"...","name":"Test User",...}}
```

### 4.3 Save Token for Next Tests
```bash
# Get the token from login response above
TOKEN="your_token_here"
```

### 4.4 Test Protected Route (Get Profile)
```bash
curl http://localhost:5000/api/users/me \
  -H "Authorization: Bearer $TOKEN"

# Should return your user profile
```

## Step 5: Test Core Features

### 5.1 Create Wedding
1. Go to `/dashboard/weddings`
2. Click "Create Wedding"
3. Fill in form:
   - Bride Name: Jane
   - Groom Name: John
   - Wedding Date: Select future date
   - Venue: My Venue
   - Number of Guests: 100
4. Click "Create Wedding"
5. Should appear in wedding list

### 5.2 Add Guest
1. Go to `/dashboard/guests`
2. Click "Add Guest"
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Phone: 555-1234
   - Side: Bride's Side
   - Party: Family
4. Click "Add Guest"
5. Guest should appear in table

### 5.3 Add Budget
1. Go to `/dashboard/budget`
2. Should see budget overview
3. Add expense item (if form available)
4. Budget chart should update

### 5.4 Browse Vendors
1. Go to `/dashboard/vendors`
2. Should display vendor cards
3. Try filtering by category
4. Try search functionality

### 5.5 View Timeline
1. Go to `/dashboard/timeline`
2. Should display scheduled events
3. Try adding new event
4. Events should appear in order

### 5.6 Chat
1. Go to `/dashboard/chat`
2. Click on a conversation
3. Type a message
4. Press Enter or click Send
5. Message should appear (in sent bubble)

### 5.7 Memories
1. Go to `/dashboard/memories`
2. Should display album cards
3. Try liking an album
4. Try creating new album

## Step 6: Test Database

### 6.1 View Data in MongoDB

**Local MongoDB:**
```bash
# Connect to local MongoDB
mongosh

# Switch to wedbliss database
use wedbliss

# View all users
db.users.find()

# View all weddings
db.weddings.find()

# View all guests
db.guests.find()

# Count records
db.users.countDocuments()
```

**MongoDB Atlas:**
1. Go to MongoDB Atlas dashboard
2. Click your cluster
3. Click "Collections"
4. Browse data in UI

### 6.2 Verify Data Structure
Check that documents have expected fields:
- Users: `_id`, `name`, `email`, `password`, `role`, `createdAt`
- Weddings: `_id`, `userId`, `brideName`, `groomName`, `weddingDate`, `venue`
- Guests: `_id`, `weddingId`, `name`, `email`, `rsvpStatus`

## Step 7: Browser Console Testing

### 7.1 Check for Errors
1. Open DevTools (F12)
2. Go to Console tab
3. Perform actions (login, create wedding, etc.)
4. Look for red errors - should be none or only warnings

### 7.2 Check Network Requests
1. Go to Network tab
2. Perform an action (login)
3. Click on the API request (should be POST /api/auth/login)
4. Check:
   - Status: 200 (success)
   - Response: Contains token
   - Headers: Has Authorization header

### 7.3 Check Local Storage
1. Go to Application tab
2. Click "Local Storage"
3. Click http://localhost:3000
4. Should see:
   - Key: `token`, Value: JWT token
   - Key: `user`, Value: User data JSON

## Step 8: Performance Testing

### 8.1 Check Page Load Speed
1. Go to DevTools → Lighthouse
2. Click "Analyze page load"
3. Should show:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90

### 8.2 Check API Response Times
1. Network tab
2. Make API calls
3. Response times should be <500ms for most requests

## Step 9: Mobile Testing

### 9.1 Chrome DevTools Responsive Mode
1. DevTools → Toggle Device Toolbar (Ctrl+Shift+M)
2. Test different screen sizes:
   - iPhone SE (375px)
   - iPad (768px)
   - Desktop (1200px)
3. Verify:
   - Layout is responsive
   - Navigation works
   - Buttons are clickable
   - Text is readable

### 9.2 Test Touch Interactions
1. In responsive mode, simulate touch
2. Test all interactive elements
3. Verify no hover-only features

## Step 10: Edge Cases Testing

### 10.1 Test Error Handling
1. Login with wrong password
   - Should show error message
2. Try to access protected route without login
   - Should redirect to login
3. Network offline
   - Should show connection error
4. Form submission with invalid data
   - Should show validation errors

### 10.2 Test Session Persistence
1. Login to app
2. Refresh page (F5)
3. Should remain logged in (because token saved)
4. Clear localStorage
5. Refresh page
6. Should be logged out and redirect to login

### 10.3 Test Route Protection
1. Login as user
2. Try to access admin routes
3. Should be blocked or show error
4. Logout
5. Try to access dashboard
6. Should redirect to login

## Checklist Before Production

- [ ] Frontend loads without errors
- [ ] Can register new account
- [ ] Can login with created account
- [ ] Data persists in MongoDB
- [ ] All dashboard pages load
- [ ] Can create wedding
- [ ] Can add guests
- [ ] Can add budget items
- [ ] Can browse vendors
- [ ] Timeline displays events
- [ ] Chat messages appear
- [ ] Memory albums display
- [ ] API health check works
- [ ] No CORS errors
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Logout works
- [ ] Session persists on refresh
- [ ] Protected routes are protected
- [ ] Error messages display properly

## Troubleshooting Local Testing

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Check MongoDB is running
ps aux | grep mongod

# On macOS
brew services list

# On Linux
sudo systemctl status mongod
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules server/node_modules
pnpm install
cd server && npm install && cd ..
```

### CORS Error
- Check `CLIENT_URL` in server/.env matches frontend URL
- Restart backend after changing env variables

### API 404 Errors
- Check backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in .env.local
- Check route exists in server/routes/

## Next Steps

Once all tests pass:
1. Go to DEPLOYMENT_GUIDE.md
2. Follow steps to deploy to MongoDB Atlas + Render + Vercel
3. Test production endpoints
4. Monitor logs for errors

---

**Happy Testing!** 🎉
