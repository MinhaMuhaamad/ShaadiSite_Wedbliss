# WedBliss - Complete Setup & Usage Guide

## 🎉 Welcome to WedBliss

WedBliss is a comprehensive wedding planning platform built with the MERN stack (MongoDB, Express, React, Node.js) that helps couples manage every aspect of their wedding.

---

## 📋 Quick Start

### Prerequisites
- Node.js v18 or higher
- npm, yarn, or pnpm package manager
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (optional, for photo uploads)

### Installation

1. **Navigate to the project**
```bash
cd /vercel/share/v0-project
```

2. **Install dependencies**
```bash
# Install all frontend and development dependencies
pnpm install

# Install server dependencies
cd server
npm install
cd ..
```

3. **Configure Environment Variables**

Create `.env.local` in the root directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Create `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=your_super_secret_jwt_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start the Application**
```bash
# Runs both frontend and backend concurrently
pnpm dev
```

**The application will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🎨 Frontend Pages & Features

### Public Pages
- **Landing Page** (`/`) - Hero section, features showcase, CTA buttons
- **Login** (`/auth/login`) - Email/password authentication
- **Register** (`/auth/register`) - Sign up with role selection (Bride, Family, Vendor)

### Dashboard Pages (Authenticated)

#### Wedding Management
- **Dashboard** (`/dashboard`) - Overview, quick actions, statistics
- **Weddings** (`/dashboard/weddings`) - Manage multiple weddings, create new
- **Wedding Details** (`/dashboard/weddings/[id]`) - Individual wedding overview
- **Settings** (`/dashboard/settings`) - Collaborator management
- **Profile** (`/dashboard/profile`) - User profile and account settings

#### Planning Features
- **Guests** (`/dashboard/guests`) - Guest list management, RSVP tracking
  - Add/edit/delete guests
  - Filter by RSVP status and side
  - Track dietary restrictions
  - Send invitations

- **Budget** (`/dashboard/budget`) - Financial tracking
  - Budget overview with 12 expense categories
  - Add expense items with status tracking
  - Visual charts (pie chart, bar chart)
  - Budget alerts and remaining balance

- **Vendors** (`/dashboard/vendors`) - Vendor marketplace
  - Browse 150+ vendors
  - Filter by category and rating
  - View vendor details, packages, and reviews
  - Request bookings

- **Timeline** (`/dashboard/timeline`) - Wedding day schedule
  - Create timeline events with times and durations
  - Assign vendors to events
  - Add notes and coordination details
  - Visual timeline view

- **Chat** (`/dashboard/chat`) - Real-time messaging
  - Direct messaging with family
  - Group chat with planning team
  - Vendor communication
  - Unread message tracking

- **Memories** (`/dashboard/memories`) - Photo albums
  - Create and organize photo albums
  - Upload photos and videos
  - Like and share albums
  - Download photos

### Admin Pages
- **Admin Dashboard** (`/admin/dashboard`) - Platform analytics
  - User and wedding statistics
  - Vendor management overview
  - Revenue tracking
  - Platform growth charts

---

## 🔐 Authentication & Roles

### User Roles
1. **Bride** - Main wedding organizer with full access
2. **Family Member** - Can view and assist with planning
3. **Vendor** - Can list services and manage bookings
4. **Admin** - Platform administration and analytics

### Default Test Users
You can create accounts during registration, or use these test accounts:
```
Email: bride@example.com
Password: password123

Email: vendor@example.com
Password: password123
```

---

## 🏗️ Architecture

### Frontend Structure
```
/app
├── page.tsx                    # Landing page
├── auth/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   ├── page.tsx               # Dashboard home
│   ├── layout.tsx             # Dashboard layout
│   ├── weddings/              # Wedding management
│   ├── guests/                # Guest management
│   ├── budget/                # Budget tracking
│   ├── vendors/               # Vendor marketplace
│   ├── timeline/              # Timeline scheduler
│   ├── chat/                  # Messaging
│   ├── memories/              # Photo albums
│   ├── profile/               # User profile
│   └── settings/              # Settings
└── admin/
    └── dashboard/page.tsx     # Admin panel

/components
├── ui/                         # shadcn/ui components
├── dashboard/                  # Dashboard-specific components
│   ├── DashboardNavigation.tsx
│   └── DashboardSidebar.tsx

/lib
├── context/
│   └── AuthContext.tsx        # Global auth state
└── utils.ts                   # Utility functions
```

### Backend Structure
```
/server
├── models/                    # MongoDB schemas
│   ├── User.js
│   ├── Wedding.js
│   ├── Budget.js
│   ├── Guest.js
│   ├── Vendor.js
│   ├── Booking.js
│   ├── Invitation.js
│   ├── Timeline.js
│   ├── SeatingArrangement.js
│   ├── Media.js
│   └── Chat.js

├── routes/                    # API endpoints
│   ├── auth.js
│   ├── users.js
│   ├── weddings.js
│   ├── guests.js
│   ├── budget.js
│   ├── vendors.js
│   ├── invitations.js
│   ├── timeline.js
│   ├── seating.js
│   ├── media.js
│   ├── chat.js
│   ├── bookings.js
│   ├── collaborators.js
│   └── admin.js

├── controllers/               # Business logic
├── middleware/                # Auth & custom middleware
└── server.js                 # Express setup
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register     - Create account
POST   /api/auth/login        - Login
GET    /api/auth/me           - Get current user
POST   /api/auth/logout       - Logout
```

### Weddings
```
POST   /api/weddings          - Create wedding
GET    /api/weddings          - Get user's weddings
GET    /api/weddings/:id      - Get wedding details
PUT    /api/weddings/:id      - Update wedding
DELETE /api/weddings/:id      - Delete wedding
GET    /api/weddings/:id/stats - Get wedding statistics
```

### Guests
```
GET    /api/guests/wedding/:weddingId    - Get guests
POST   /api/guests                       - Add guest
PUT    /api/guests/:id                   - Update guest
PUT    /api/guests/:id/rsvp              - Update RSVP
DELETE /api/guests/:id                   - Delete guest
GET    /api/guests/stats/:weddingId      - Get guest statistics
```

### Budget
```
GET    /api/budget/wedding/:weddingId     - Get budget
PUT    /api/budget/:id                    - Update budget
POST   /api/budget/:id/items              - Add budget item
GET    /api/budget/summary/:weddingId     - Get budget summary
```

### Vendors
```
GET    /api/vendors                      - Get all vendors
GET    /api/vendors/:id                  - Get vendor details
POST   /api/vendors                      - Register as vendor
PUT    /api/vendors/:id                  - Update vendor profile
POST   /api/vendors/:id/reviews          - Add review
```

### More endpoints...
See `server/API_DOCUMENTATION.md` for complete API reference.

---

## 🎨 Design System

### Color Palette
- **Primary**: Rose Gold (`oklch(0.65 0.15 30)`)
- **Secondary**: Soft Blush (`oklch(0.9 0.05 30)`)
- **Accent**: Elegant Mauve (`oklch(0.7 0.1 280)`)
- **Background**: Cream (`oklch(0.98 0.001 300)`)
- **Text**: Dark Gray (`oklch(0.25 0.01 300)`)

### Typography
- **Headings**: Geist Sans
- **Body**: Geist Sans
- **Monospace**: Geist Mono

### Components
All components use `shadcn/ui` built with Tailwind CSS v4 for consistency and accessibility.

---

## 🔄 Common Workflows

### Creating a Wedding
1. Go to `/dashboard/weddings`
2. Click "Create New Wedding"
3. Fill in couple information and wedding details
4. Add theme, colors, and budget
5. Invite collaborators
6. Start planning!

### Managing Guests
1. Navigate to `/dashboard/guests`
2. Click "Add Guest" to add individual guests
3. Set dietary restrictions and notes
4. Track RSVP responses
5. Send reminder invitations
6. View statistics

### Tracking Budget
1. Go to `/dashboard/budget`
2. Create expense categories
3. Add items with estimated and actual costs
4. View visual charts of spending
5. Get alerts for over-budget items

### Booking Vendors
1. Browse `/dashboard/vendors`
2. Filter by category and rating
3. View vendor details and packages
4. Submit booking request
5. Manage bookings and payments

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
pnpm install
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `server/.env`
- Verify database name is correct

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

---

## 📚 Key Features

✅ **Complete Wedding Planning**
- Budget management with visual charts
- Guest list and RSVP tracking
- Vendor marketplace with 150+ vendors
- Real-time team collaboration
- Wedding day timeline scheduling

✅ **User-Friendly Interface**
- Responsive design (mobile, tablet, desktop)
- Intuitive navigation and controls
- Accessible components with ARIA labels
- Dark mode support

✅ **Security**
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure API endpoints

✅ **Scalability**
- MongoDB for flexible data storage
- Socket.io for real-time features
- RESTful API architecture
- Modular component structure

---

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy with one click

### Deploy Backend
- Use services like Heroku, Railway, or Render
- Set MongoDB URI to MongoDB Atlas
- Configure environment variables

---

## 📞 Support

For issues or questions, please refer to the API documentation at `/server/API_DOCUMENTATION.md`.

---

## 📝 License

WedBliss © 2024. All rights reserved.

Happy Wedding Planning! 💍✨
