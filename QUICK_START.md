# WedBliss - Quick Start Guide

## 🚀 Get Running in 2 Minutes

### Step 1: Start the Application
```bash
cd /vercel/share/v0-project
pnpm dev
```

### Step 2: Open in Browser
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:5000 (API)

### Step 3: Create an Account
1. Click "Get Started" or go to `/auth/register`
2. Fill in your information
3. Select your role (Bride, Family Member, or Vendor)
4. Password must be at least 6 characters
5. Click "Create Account"

### Step 4: Log In
- Email: Your registered email
- Password: Your password
- You'll be redirected to the dashboard

---

## 📱 Frontend Pages Overview

### Landing Page (Public)
**Route**: `/`
- Hero section with wedding planning features
- Feature cards highlighting 6 key capabilities
- Call-to-action buttons for Sign In/Sign Up
- Footer with links and info

### Authentication Pages
**Sign In**: `/auth/login`
- Email and password fields
- "Forgot password" link
- "Create account" link

**Sign Up**: `/auth/register`
- Name, email, phone fields
- Password (min 6 characters)
- Role selection (Bride/Family/Vendor)
- Terms acceptance checkbox

### Dashboard Home
**Route**: `/dashboard`
- Quick action buttons (Create Wedding, Invite Family, etc.)
- Getting Started checklist
- Wedding statistics cards (total, guests, budget)
- Recent activities

### Wedding Management
**List Weddings**: `/dashboard/weddings`
- Grid of wedding cards
- Wedding date, venue, guest count
- Quick actions (view, edit, delete)
- "Create New Wedding" button

**Create Wedding**: `/dashboard/weddings/new`
- Form for couple information (names)
- Wedding date picker
- Guest count estimate
- Venue information
- Theme and color selection
- Budget allocation
- Save button

**Wedding Details**: `/dashboard/weddings/[id]`
- Wedding overview with statistics
- Planning progress percentage
- Guest RSVP summary (Accepted/Pending/Declined)
- Budget overview with progress bar
- Venue details
- Quick action buttons linking to planning areas

### Guest Management
**Route**: `/dashboard/guests`
- Guest list table with columns:
  - Name, Email, Phone
  - Party type (Family/Friends/Colleagues)
  - Plus-ones count
  - Dietary restrictions
  - RSVP status (Accepted/Pending/Declined)
- Statistics cards:
  - Total guests
  - Accepted count
  - Pending count
  - Declined count
  - Response rate percentage
- Add Guest dialog
- Filter options (RSVP status, bride/groom side)
- Search functionality
- Send invitations section

### Budget Tracking
**Route**: `/dashboard/budget`
- 4 metric cards:
  - Total Budget
  - Amount Spent
  - Remaining Budget
  - Number of Categories
- Add Expense dialog
- Pie chart (Budget by Category)
- Bar chart (Budgeted vs Actual by Category)
- Expense items table with:
  - Category
  - Amount
  - Status (Paid/Pending)
  - Progress bar
  - Over-budget alerts

### Vendor Marketplace
**Route**: `/dashboard/vendors`
- Search bar for vendor name/service
- Filter dropdown (By Category)
- Sort dropdown (Rating/Reviews/Price)
- Featured vendors section (top 3)
- Vendor grid with cards showing:
  - Vendor image
  - Name, category badge
  - Star rating and review count
  - Price range
  - Description
  - Location
  - Contact (phone, email)
  - "View Details" button
  - Heart icon to favorite

**Vendor Details**: `/dashboard/vendors/[id]`
- Full vendor profile
- Gallery of work
- Detailed information
- Services and packages with pricing
- Reviews section
- Availability calendar
- Booking request form

### Wedding Timeline
**Route**: `/dashboard/timeline`
- Timeline event creation dialog
- Sorted timeline of wedding day events showing:
  - Time (8:00 AM - 11:00 PM typical)
  - Event name
  - Assigned vendor
  - Duration
  - Notes
- Timeline statistics:
  - First event time
  - Total events
  - Last event time
- Coordination reminders checklist

### Real-Time Chat
**Route**: `/dashboard/chat`
- Left sidebar with conversation list
  - Unread badges
  - Last message preview
  - Timestamp
- Main chat window showing:
  - Conversation header with members
  - Message thread (received/sent)
  - User names and timestamps
  - Message input field
- Call/Video buttons
- Conversations:
  - Wedding Planning Team (group)
  - Mom (direct)
  - Vendors (vendor channels)

### Memory Album
**Route**: `/dashboard/memories`
- Create Album dialog
- Album statistics:
  - Total albums
  - Total photos
  - Total likes
  - My likes
- Album grid showing:
  - Cover image
  - Album name
  - Photo count badge
  - Created date
  - Shared with list
  - Like count
  - Share and Download buttons
- Upload photos section with drag-and-drop

### User Profile
**Route**: `/dashboard/profile`
- Personal Information section:
  - First/Last name
  - Email
  - Phone
  - Bio
- Wedding Information section:
  - Wedding date
  - Venue
  - Guest count
  - Theme
  - Colors
- Account Security section:
  - Change password
  - Two-factor authentication toggle
  - Account status
- Deactivate account option
- Save button

### Settings & Collaborators
**Route**: `/dashboard/settings`
- Invite Collaborators dialog
- Email input
- Role selection (Family/Friend/Planner)
- Active collaborators list showing:
  - Name
  - Email
  - Role
  - Added date
  - Remove option
- Collaboration permissions overview

### Admin Dashboard
**Route**: `/admin/dashboard` (Admin only)
- Platform Overview statistics:
  - Total users
  - Active weddings
  - Total vendors
  - Revenue this month
- Users section:
  - New users (this month)
  - User growth chart
- Weddings section:
  - Active weddings count
  - Monthly growth chart
- Vendors section:
  - By category pie chart
  - Top-rated vendors
- Revenue tracking
- Recent signups list
- System status

---

## 🎨 UI Components Used

### Buttons
- **Primary**: `<Button>Label</Button>`
- **Outline**: `<Button variant="outline">Label</Button>`
- **Ghost**: `<Button variant="ghost">Label</Button>`
- **Sizes**: `sm`, `lg`, `default`

### Forms
- Input fields with placeholders
- Select dropdowns
- Dialogs for forms
- Form validation messages

### Cards
- Header with title and description
- Content areas
- Statistics cards with values
- Hover effects

### Badges
- Status indicators (Accepted, Pending, Declined)
- Category labels
- Count indicators

### Icons
- Heart (favorite)
- Users, DollarSign, Calendar, Camera, MessageSquare
- Phone, Mail, MapPin
- Plus, Edit, Delete, Download, Share
- Check/X circles for status

---

## 🔐 Test Credentials (Mock)

While the backend isn't fully connected to MongoDB in this demo, you can still navigate the frontend:

**Role: Bride**
- Email: bride@example.com
- Password: password123

**Role: Family**
- Email: family@example.com  
- Password: password123

**Role: Vendor**
- Email: vendor@example.com
- Password: password123

---

## 📋 Form Fields Reference

### Guest Form
- Name (required)
- Email (required)
- Phone
- Bride/Groom Side (dropdown)
- Party Type (Family/Friends/Colleagues)
- Plus-ones (number)

### Wedding Form
- Bride Name (required)
- Groom Name (required)
- Wedding Date (required)
- Estimated Guest Count
- Venue Name
- Venue Location
- Theme
- Primary Color (color picker)
- Secondary Color (color picker)
- Total Budget
- Notes

### Budget Item Form
- Category (dropdown: Venue, Catering, Photography, etc.)
- Item Name
- Estimated Amount
- Actual Amount
- Status (Paid/Pending)
- Date

### Timeline Event Form
- Time (time picker)
- Event Name (required)
- Vendor/Contact Name
- Duration
- Notes

---

## 🎯 Navigation Map

```
/ (Landing)
├── /auth/login
├── /auth/register
└── /dashboard (Protected)
    ├── /dashboard/profile
    ├── /dashboard/settings
    ├── /dashboard/weddings
    │   ├── /dashboard/weddings/new
    │   └── /dashboard/weddings/[id]
    ├── /dashboard/guests
    ├── /dashboard/budget
    ├── /dashboard/vendors
    │   └── /dashboard/vendors/[id]
    ├── /dashboard/timeline
    ├── /dashboard/chat
    └── /dashboard/memories

/admin (Admin Protected)
└── /admin/dashboard
```

---

## 💡 Tips

1. **Add Multiple Weddings**: You can create and manage multiple weddings from the `/dashboard/weddings` page
2. **Invite Collaborators**: Use `/dashboard/settings` to invite family members to help plan
3. **Real-time Updates**: Chat features use Socket.io for instant messaging
4. **Mobile Friendly**: All pages are responsive and work on mobile, tablet, and desktop
5. **Dark Mode**: The app supports light/dark mode (check system preferences)
6. **Keyboard Navigation**: All forms support tab navigation and keyboard shortcuts

---

## 🆘 Common Actions

### How to Create a Wedding
1. Navigate to `/dashboard/weddings`
2. Click "Create New Wedding" button
3. Fill in couple names, date, and venue
4. Select theme and colors
5. Set budget
6. Click Save

### How to Add a Guest
1. Go to `/dashboard/guests`
2. Click "Add Guest" button
3. Enter guest information
4. Select dietary restrictions
5. Click Save

### How to Track Budget
1. Visit `/dashboard/budget`
2. Add expense items by category
3. Track spent vs budgeted amounts
4. View charts for visual breakdown
5. Monitor remaining budget

### How to Browse Vendors
1. Go to `/dashboard/vendors`
2. Use search and filters
3. Sort by rating, reviews, or price
4. Click vendor card to view details
5. Request booking

---

## 🎓 Learning Resources

- Component documentation: `/components/ui/`
- API endpoints: `/server/API_DOCUMENTATION.md`
- Database models: `/server/models/`
- Backend routes: `/server/routes/`
- Context API: `/lib/context/AuthContext.tsx`

---

Enjoy planning the perfect wedding with WedBliss! 🎉💍
