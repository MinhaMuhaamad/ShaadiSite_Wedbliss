# 💍 WedBliss - Wedding Planning Platform

A comprehensive full-stack wedding planning application built with the MERN stack (MongoDB, Express, React, Node.js) that helps couples manage every aspect of their wedding, from budgets to guests, vendors to timelines.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-blue)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)](https://www.mongodb.com/)

---

## ✨ Features

### 🎯 Core Planning Tools
- **Wedding Management** - Create and manage multiple weddings with all key details
- **Guest Management** - Manage guest lists, track RSVPs, and dietary restrictions
- **Budget Tracking** - Visual budget management with charts and category tracking
- **Vendor Marketplace** - Browse 150+ vendors with ratings, reviews, and booking
- **Timeline Scheduling** - Plan your wedding day with detailed event scheduling
- **Real-time Chat** - Communicate with family, friends, and vendors
- **Memory Album** - Share and organize wedding photos and videos
- **Seating Arrangements** - Plan table assignments (coming soon)
- **Admin Dashboard** - Platform analytics and management

### 🔐 Security & Access Control
- JWT-based authentication
- Role-based access (Bride, Family, Vendor, Admin)
- Password hashing with bcrypt
- Secure API endpoints
- Protected routes and resources

### 📱 User Experience
- Fully responsive design (mobile, tablet, desktop)
- Rose gold and wedding-themed aesthetic
- Accessible components with ARIA labels
- Dark mode support
- Intuitive navigation and controls
- Real-time updates with Socket.io

### 🏗️ Architecture
- **Frontend**: Next.js 16 with React 19 and Tailwind CSS v4
- **Backend**: Express.js with MongoDB
- **Real-time**: Socket.io for messaging and live updates
- **Components**: shadcn/ui for consistent, accessible UI
- **Styling**: Rose gold/mauve wedding-appropriate color scheme
- **API**: RESTful architecture with 50+ endpoints

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- pnpm, npm, or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# 1. Clone/Download project
cd /vercel/share/v0-project

# 2. Install dependencies
pnpm install
cd server && npm install && cd ..

# 3. Configure environment
echo 'NEXT_PUBLIC_API_URL=http://localhost:5000' > .env.local
echo 'PORT=5000
MONGODB_URI=mongodb://localhost:27017/wedbliss
JWT_SECRET=your_secret_key' > server/.env

# 4. Start application
pnpm dev
```

**Access the application:**
- Frontend: http://localhost:3001
- Backend API: http://localhost:5000

### Create Your First Wedding
1. Sign up at http://localhost:3001/auth/register
2. Navigate to `/dashboard/weddings`
3. Click "Create New Wedding"
4. Fill in couple info, date, and venue
5. Start planning!

---

## 📁 Project Structure

```
wedbliss/
├── app/                              # Next.js frontend
│   ├── page.tsx                     # Landing page
│   ├── auth/                        # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/                   # Main application
│   │   ├── layout.tsx              # Dashboard wrapper
│   │   ├── page.tsx                # Dashboard home
│   │   ├── weddings/               # Wedding management
│   │   ├── guests/                 # Guest management
│   │   ├── budget/                 # Budget tracking
│   │   ├── vendors/                # Vendor marketplace
│   │   ├── timeline/               # Timeline scheduler
│   │   ├── chat/                   # Real-time messaging
│   │   ├── memories/               # Photo albums
│   │   ├── profile/                # User profile
│   │   └── settings/               # Collaborators
│   └── admin/                       # Admin dashboard
│       └── dashboard/page.tsx
├── server/                           # Express backend
│   ├── models/                      # MongoDB schemas
│   │   ├── User.js
│   │   ├── Wedding.js
│   │   ├── Budget.js
│   │   ├── Guest.js
│   │   ├── Vendor.js
│   │   ├── Booking.js
│   │   ├── Invitation.js
│   │   ├── Timeline.js
│   │   ├── Media.js
│   │   └── Chat.js
│   ├── routes/                      # API endpoints
│   │   ├── auth.js
│   │   ├── weddings.js
│   │   ├── guests.js
│   │   ├── budget.js
│   │   ├── vendors.js
│   │   ├── timeline.js
│   │   ├── chat.js
│   │   ├── media.js
│   │   └── admin.js
│   ├── controllers/                 # Business logic
│   ├── middleware/                  # Auth & validation
│   ├── server.js                    # Express setup
│   └── package.json
├── components/
│   ├── ui/                          # shadcn/ui components
│   └── dashboard/                   # Dashboard components
├── lib/
│   ├── context/AuthContext.tsx      # Auth state
│   └── utils.ts                     # Helpers
├── public/                          # Static files
├── SETUP_GUIDE.md                   # Detailed setup
├── QUICK_START.md                   # Quick reference
├── COMMANDS.md                      # Command reference
└── package.json
```

---

## 🎨 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.4 | React framework |
| **React** | 19+ | UI library |
| **Tailwind CSS** | v4 | Styling |
| **shadcn/ui** | Latest | Component library |
| **TypeScript** | 5.7+ | Type safety |
| **Lucide React** | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Express.js** | Latest | HTTP server |
| **MongoDB** | Latest | Database |
| **Mongoose** | Latest | ODM |
| **JWT** | Latest | Authentication |
| **bcryptjs** | Latest | Password hashing |
| **Socket.io** | Latest | Real-time messaging |

---

## 📚 API Endpoints (50+)

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user
- `POST /api/auth/logout` - Logout

### Weddings
- `POST /api/weddings` - Create wedding
- `GET /api/weddings` - User's weddings
- `GET /api/weddings/:id` - Wedding details
- `PUT /api/weddings/:id` - Update wedding
- `DELETE /api/weddings/:id` - Delete wedding
- `GET /api/weddings/:id/stats` - Wedding statistics

### Guests (+ 6 more endpoints)
- `POST /api/guests` - Add guest
- `GET /api/guests/wedding/:weddingId` - Get guests
- `PUT /api/guests/:id` - Update guest
- `PUT /api/guests/:id/rsvp` - Update RSVP

### Budget (+ 5 more endpoints)
- `POST /api/budget` - Create budget
- `GET /api/budget/wedding/:weddingId` - Get budget
- `PUT /api/budget/:id` - Update budget
- `POST /api/budget/:id/items` - Add item

### Vendors (+ 4 more endpoints)
- `GET /api/vendors` - All vendors
- `POST /api/vendors` - Register vendor
- `GET /api/vendors/:id` - Vendor details

### Plus: Timeline, Chat, Media, Bookings, Invitations, Admin endpoints...

See `/server/API_DOCUMENTATION.md` for complete reference.

---

## 🎯 Key Pages & Routes

| Page | Route | Role | Purpose |
|------|-------|------|---------|
| Landing | `/` | Public | Marketing page |
| Sign In | `/auth/login` | Public | User login |
| Sign Up | `/auth/register` | Public | Create account |
| Dashboard | `/dashboard` | Bride/Family | Planning hub |
| Weddings | `/dashboard/weddings` | Bride/Family | Manage weddings |
| Guests | `/dashboard/guests` | Bride/Family | Guest list |
| Budget | `/dashboard/budget` | Bride/Family | Budget tracking |
| Vendors | `/dashboard/vendors` | All | Vendor marketplace |
| Timeline | `/dashboard/timeline` | Bride/Family | Day schedule |
| Chat | `/dashboard/chat` | All | Messaging |
| Memories | `/dashboard/memories` | All | Photo albums |
| Profile | `/dashboard/profile` | All | User settings |
| Settings | `/dashboard/settings` | Bride/Family | Collaborators |
| Admin | `/admin/dashboard` | Admin | Analytics |

---

## 🔐 User Roles & Permissions

### Bride
✅ Full access to all planning features
✅ Manage guest list and invitations
✅ Budget planning and tracking
✅ Vendor marketplace and booking
✅ Timeline and schedule planning
✅ Invite collaborators
✅ Access chat and messaging

### Family Member
✅ View wedding details
✅ Help with guest management
✅ Chat with team
✅ View budget and timeline
❌ Cannot modify core settings

### Vendor
✅ Register and manage services
✅ View vendor marketplace
✅ Accept and manage bookings
✅ Chat with clients
✅ View reviews and ratings

### Admin
✅ Platform-wide analytics
✅ User management
✅ Vendor moderation
✅ Revenue tracking
✅ System administration

---

## 🎨 Design System

### Color Palette
- **Primary**: Rose Gold - `oklch(0.65 0.15 30)`
- **Secondary**: Soft Blush - `oklch(0.9 0.05 30)`
- **Accent**: Elegant Mauve - `oklch(0.7 0.1 280)`
- **Background**: Cream - `oklch(0.98 0.001 300)`
- **Foreground**: Dark Gray - `oklch(0.25 0.01 300)`

### Typography
- **Headings & Body**: Geist Sans
- **Monospace**: Geist Mono

### Components
All components built with shadcn/ui using Tailwind CSS for consistency, accessibility, and beautiful styling.

---

## 📊 Database Models

- **User** - User accounts with roles and profiles
- **Wedding** - Wedding information and configuration
- **Budget** - Budget tracking and expense items
- **Guest** - Guest list with RSVP status
- **Vendor** - Vendor profiles and services
- **Booking** - Vendor booking management
- **Invitation** - Digital invitations
- **Timeline** - Wedding day schedule
- **SeatingArrangement** - Table assignments
- **Media** - Photos and videos
- **Chat** - Messages and conversations

---

## 🚀 Deployment

### Deploy Frontend (Vercel)
```bash
vercel
```

### Deploy Backend
```bash
# Using Render, Railway, or Heroku
heroku create wedbliss-api
git push heroku main
```

### Environment Variables
Set in deployment platform:
```
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
CLOUDINARY_API_KEY=your_key
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
lsof -ti:3001 | xargs kill -9  # Frontend
lsof -ti:5000 | xargs kill -9  # Backend
```

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `server/.env`
- Use MongoDB Atlas for cloud database

### Dependencies Not Installing
```bash
rm -rf node_modules && pnpm install
```

See `SETUP_GUIDE.md` for more troubleshooting.

---

## 📖 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed installation and configuration
- **[QUICK_START.md](./QUICK_START.md)** - Quick reference for pages and features
- **[COMMANDS.md](./COMMANDS.md)** - All useful commands
- **[server/API_DOCUMENTATION.md](./server/API_DOCUMENTATION.md)** - Complete API reference

---

## 👥 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 💡 Future Enhancements

- [ ] Stripe payment integration
- [ ] Advanced seating arrangements with visualization
- [ ] AI-powered wedding planning suggestions
- [ ] Integration with wedding registries
- [ ] Mobile app (React Native)
- [ ] Video messaging
- [ ] Email reminders and invitations
- [ ] Analytics dashboard for vendors
- [ ] Guests feedback and rating system
- [ ] Multi-language support

---

## 🎉 Getting Help

For issues, questions, or suggestions:
1. Check the troubleshooting section in SETUP_GUIDE.md
2. Review API_DOCUMENTATION.md for API questions
3. Check the console logs for errors
4. Open an issue with detailed description

---

## 🙏 Acknowledgments

Built with:
- React & Next.js community
- shadcn/ui for beautiful components
- Tailwind CSS for styling
- MongoDB for database
- Socket.io for real-time features

---

## 📱 Social & Community

- 🐦 Twitter: [@WedBliss](#)
- 💬 Discord: [Join Community](#)
- 📧 Email: support@wedbliss.com

---

## ✨ Special Features

🎁 **Smart Planning** - AI-powered suggestions (coming soon)
💰 **Budget Insights** - Real-time spending analytics
📊 **Guest Analytics** - RSVP tracking and insights
🎨 **Customization** - Personalize every detail
🔒 **Secure** - Enterprise-grade security
⚡ **Fast** - Optimized performance with Next.js
📱 **Responsive** - Works on all devices
🌙 **Dark Mode** - Comfortable for any lighting
♿ **Accessible** - WCAG compliant

---

## 🎯 Latest Updates

- ✅ Complete MERN stack implementation
- ✅ 12 core modules with 40+ screens
- ✅ Real-time messaging with Socket.io
- ✅ Vendor marketplace with 150+ vendors
- ✅ Budget tracking with visual charts
- ✅ Guest management with RSVP tracking
- ✅ Wedding day timeline scheduler
- ✅ Photo album and memory sharing
- ✅ Admin dashboard with analytics
- ✅ Fully responsive design

---

**Happy Wedding Planning! 💍✨**

Made with ❤️ by the WedBliss Team
