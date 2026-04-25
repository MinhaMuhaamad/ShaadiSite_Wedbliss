# 🎨 WedBliss Frontend Pages - Visual Guide

## Page Overview & Layout

### 1. Landing Page (/)
**Route:** `/`  
**Access:** Public (no login required)

```
┌─────────────────────────────────────────────────────┐
│ 💍 WedBliss          [Sign In] [Get Started]       │ <- Navigation
├─────────────────────────────────────────────────────┤
│                                                     │
│            Plan Your Perfect Wedding              │ <- Hero
│  From budgets to timelines, WedBliss makes        │
│     wedding planning seamless and stress-free.    │
│                                                     │
│            [Start Planning] [Learn More]          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  💰 Budget    👥 Guests    📅 Timeline          │ <- Features
│  🎤 Vendors   💬 Chat      🎥 Memories           │
│                                                     │
├─────────────────────────────────────────────────────┤
│ Ready to plan your big day?                        │ <- CTA
│ [Sign Up Free]                                    │
├─────────────────────────────────────────────────────┤
│ Product | Pricing | Blog | Support | Security     │ <- Footer
└─────────────────────────────────────────────────────┘
```

---

### 2. Login Page (/auth/login)
**Route:** `/auth/login`  
**Access:** Public (unauthenticated)

```
┌─────────────────────────────┐
│                             │
│      Welcome Back! 💍       │ <- Header
│                             │
│  📧 Email                   │
│  ┌─────────────────────┐   │
│  │ user@example.com    │   │
│  └─────────────────────┘   │
│                             │
│  🔒 Password                │
│  ┌─────────────────────┐   │
│  │ ••••••••••          │   │
│  └─────────────────────┘   │
│                             │
│  [ ] Remember me            │
│  [Forgot password?]         │
│                             │
│  ┌─────────────────────┐   │
│  │  Sign In            │   │
│  └─────────────────────┘   │
│                             │
│  Don't have an account?     │
│  [Create one]              │
│                             │
└─────────────────────────────┘
```

---

### 3. Register Page (/auth/register)
**Route:** `/auth/register`  
**Access:** Public (unauthenticated)

```
┌──────────────────────────────────┐
│                                  │
│    Let's Plan Your Wedding! 💍   │
│                                  │
│  👤 First Name                   │
│  ┌──────────────────────────┐   │
│  │ Sarah                    │   │
│  └──────────────────────────┘   │
│                                  │
│  👤 Last Name                    │
│  ┌──────────────────────────┐   │
│  │ Johnson                  │   │
│  └──────────────────────────┘   │
│                                  │
│  📧 Email                        │
│  ┌──────────────────────────┐   │
│  │ sarah@example.com        │   │
│  └──────────────────────────┘   │
│                                  │
│  📞 Phone                        │
│  ┌──────────────────────────┐   │
│  │ (555) 123-4567           │   │
│  └──────────────────────────┘   │
│                                  │
│  🔒 Password (min 6 chars)       │
│  ┌──────────────────────────┐   │
│  │ ••••••••••               │   │
│  └──────────────────────────┘   │
│                                  │
│  👑 Role                         │
│  ☑ Bride  ☐ Family  ☐ Vendor   │
│                                  │
│  ☑ I agree to Terms of Service  │
│                                  │
│  ┌──────────────────────────┐   │
│  │  Create Account          │   │
│  └──────────────────────────┘   │
│                                  │
│  Already have account? [Sign In]│
│                                  │
└──────────────────────────────────┘
```

---

### 4. Dashboard Home (/dashboard)
**Route:** `/dashboard`  
**Access:** Authenticated users only

```
┌────────────────────────────────────────────────────────────┐
│ 💍 WedBliss         [👤 Profile] [⚙️ Settings] [🚪 Logout] │
├─────────────┬──────────────────────────────────────────────┤
│             │                                              │
│ 📍 Dashboard│  Quick Actions                             │
│ 💍 Weddings │  ┌──────────┐  ┌──────────┐              │
│ 👥 Guests   │  │ Create   │  │ Invite   │              │
│ 💰 Budget   │  │ Wedding  │  │ Family   │              │
│ 🎤 Vendors  │  └──────────┘  └──────────┘              │
│ 📅 Timeline │                                            │
│ 💬 Chat     │  Getting Started                          │
│ 🎥 Memories │  ☐ Create wedding                        │
│             │  ☑ Invite collaborators                  │
│ 👤 Profile  │  ☐ Add first guest                       │
│ ⚙️ Settings │  ☐ Set budget                            │
│             │  ☐ Book vendors                          │
│             │                                            │
│             │  Statistics                               │
│             │  ┌─────────┐  ┌─────────┐ ┌────────┐   │
│             │  │Weddings │  │ Guests  │ │Budget  │   │
│             │  │   1     │  │   24    │ │$15,000 │   │
│             │  └─────────┘  └─────────┘ └────────┘   │
│             │                                            │
└─────────────┴──────────────────────────────────────────────┘
```

---

### 5. Weddings List Page (/dashboard/weddings)
**Route:** `/dashboard/weddings`  
**Access:** Authenticated users

```
┌──────────────────────────────────────────────────────────────┐
│ My Weddings                             [+ Create New Wedding]│
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │              │  │              │  │              │     │
│  │ Sarah & John │  │ Emily & Mike │  │ Jessica & ...│     │
│  │              │  │              │  │              │     │
│  │ June 15,2024 │  │ Aug 20, 2024 │  │ Sept 10, ...│     │
│  │ 150 guests   │  │ 200 guests   │  │ 100 guests  │     │
│  │ [Details]... │  │ [Details]... │  │ [Details]...│     │
│  │ [Edit][Del]  │  │ [Edit][Del]  │  │ [Edit][Del] │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 6. Wedding Details (/dashboard/weddings/[id])
**Route:** `/dashboard/weddings/[id]`

```
┌───────────────────────────────────────────────────────────┐
│ Sarah & John - June 15, 2024                              │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Planning Progress: ████████░░  75%                      │
│                                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Guests   │  │ Budget   │  │ Vendors  │              │
│  │ 22/30    │  │$8,200/   │  │ 5        │              │
│  │Accepted  │  │$15,000   │  │Booked    │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│                                                           │
│  Venue: The Grand Ballroom, Downtown                     │
│  Address: 123 Main St, City, State                      │
│                                                           │
│  ┌──────────────────────────────────────────────┐      │
│  │ [Manage Guests] [Budget] [Vendors]           │      │
│  │ [Timeline] [Chat] [Memories]                 │      │
│  └──────────────────────────────────────────────┘      │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

### 7. Guests Page (/dashboard/guests)
**Route:** `/dashboard/guests`

```
┌──────────────────────────────────────────────────────────────┐
│ Guest Management                            [+ Add Guest]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Stats:                                                      │
│  Total: 30 | Accepted: 22 ✓ | Pending: 5 ⏰ | Declined: 3 ✗│
│  Response Rate: 90%                                         │
│                                                              │
│  Search: ┌──────────────────────┐  Status: [All ▼]         │
│          │ Search guests...      │  Side: [All ▼]           │
│          └──────────────────────┘                           │
│                                                              │
│  Name | Contact | Party | +1 | Dietary | RSVP | Actions   │
│  ─────────────────────────────────────────────────────────  │
│  Sarah J. | sarah@... | Family | 1 | None | ✓ Accepted    │
│  Michael J. | mike@... | Family | 0 | None | ✓ Accepted   │
│  Emma D. | emma@... | Friends | 1 | GF | ⏰ Pending       │
│  James W. | james@... | Work | 0 | None | ✗ Declined      │
│  ...                                                        │
│                                                              │
│  [Send Reminder Invitations to 5 Pending Guests]          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 8. Budget Page (/dashboard/budget)
**Route:** `/dashboard/budget`

```
┌──────────────────────────────────────────────────────────────┐
│ Budget Tracking                             [+ Add Expense]  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Total Budget: $15,000 | Spent: $8,200 | Remaining: $6,800 │
│  Progress: ████████░░  54%                                 │
│                                                              │
│  ┌──────────────────┐    ┌──────────────────────────────┐ │
│  │ Budget by        │    │ Budget vs Actual             │ │
│  │ Category (Pie)   │    │ (Bar Chart)                  │ │
│  │ Venue: 35%       │    │ Catering: $4000/$3500       │ │
│  │ Catering: 30%    │    │ Venue: $5000/$4500          │ │
│  │ Photography: 20% │    │ Photography: $2000/$1000    │ │
│  │ Others: 15%      │    │ ...                         │ │
│  └──────────────────┘    └──────────────────────────────┘ │
│                                                              │
│  Expenses:                                                  │
│  Category | Amount | Status | Progress | Over?             │
│  ──────────────────────────────────────────────────────    │
│  Venue | $5,000 | Paid | ████████░ $5000/$5500 | ✓ OK      │
│  Catering | $4,000 | Pending | ████░░░░ $4000/$3500 | ✗    │
│  Photography | $2,000 | Paid | ████████ $2000/$2000 | ✓    │
│  ...                                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 9. Vendors Page (/dashboard/vendors)
**Route:** `/dashboard/vendors`

```
┌──────────────────────────────────────────────────────────────┐
│ Vendor Marketplace                                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Search: ┌──────────────────────┐                          │
│          │ Search vendors...     │                          │
│          └──────────────────────┘                          │
│                                                              │
│  Filter: [All Categories ▼] Sort: [Highest Rated ▼]       │
│                                                              │
│  Featured Vendors:                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ [Image]      │  │ [Image]      │  │ [Image]      │    │
│  │ The Grand    │  │ Culinary     │  │ Bloom &      │    │
│  │ Ballroom     │  │ Dreams       │  │ Blossom      │    │
│  │ ⭐ 4.9 (128) │  │ ⭐ 4.8 (95)  │  │ ⭐ 4.7 (87) │    │
│  │ $$$ Venue    │  │ $$ Catering  │  │ $$ Florist  │    │
│  │[Details]     │  │[Details]     │  │[Details]    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
│  All Vendors (Filter Results):                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Moments      │  │ Spin City DJ │  │ Glam &       │    │
│  │ Photography  │  │              │  │ Glamour      │    │
│  │ ⭐ 4.95 (156)│  │ ⭐ 4.6 (72)  │  │ ⭐ 4.85(110)│    │
│  │ [Details]    │  │ [Details]    │  │ [Details]   │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 10. Timeline Page (/dashboard/timeline)
**Route:** `/dashboard/timeline`

```
┌──────────────────────────────────────────────────────────────┐
│ Wedding Day Timeline                        [+ Add Event]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  First Event: 08:00 AM | Total Events: 14 | Last: 11:00 PM │
│                                                              │
│  ● 08:00 AM  Bridal Party Arrives                          │
│  │           Makeup Team | Bridal suite                    │
│  │           Duration: 2 hours                             │
│  │                                                          │
│  ● 10:00 AM  Hair & Makeup                                 │
│  │           Glam & Glamour | Duration: 1.5 hours         │
│  │                                                          │
│  ● 11:30 AM  Photos - Getting Ready                        │
│  │           Moments Photography | Duration: 1 hour       │
│  │                                                          │
│  ● 12:30 PM  Groom Preparation                             │
│  │           Self | Duration: 1 hour                       │
│  │                                                          │
│  ● 01:00 PM  First Look                                    │
│  │           Moments Photography                           │
│  │           Garden | Duration: 30 mins                   │
│  │                                                          │
│  ● 02:45 PM  Ceremony Begins                               │
│  │           Officiant | Main hall | Duration: 30 mins    │
│  │                                                          │
│  ● 04:15 PM  Reception Begins                              │
│  │           Spin City DJ | Dinner service               │
│  │           Duration: 4 hours                             │
│  │                                                          │
│  [More events...] ● 11:00 PM Last Dance                    │
│                                                              │
│  Coordination Reminders:                                    │
│  • Confirm all vendors 1 week before                       │
│  • Share final timeline with all participants              │
│  • Do final fitting for attire 2 weeks before              │
│  • Confirm final guest count with caterer                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 11. Chat Page (/dashboard/chat)
**Route:** `/dashboard/chat`

```
┌─────────────────┬──────────────────────────────────────────┐
│ Conversations   │ Wedding Planning Team                    │
│ ─────────────── │ [☎️ Call] [📹 Video]                    │
│                 │                                          │
│ ▌ Wedding       │ 10:30 AM                                │
│   Planning Team │ Mom: How are preparations going?        │
│   (3) 2h ago    │                                          │
│                 │ You: Everything is on track!            │
│ Mom             │ Just confirmed with the venue.          │
│   Yesterday     │                                          │
│                 │ 10:45 AM                                │
│ The Grand       │ Maid of Honor: I've sent reminders      │
│   Ballroom      │ to all bridesmaids!                     │
│   1h ago        │                                          │
│                 │ 10:50 AM                                │
│ Catering        │ You: Thanks so much! You're the best.   │
│   2 days ago    │                                          │
│                 │ 11:00 AM                                │
│                 │ Wedding Team: Vendor confirmations      │
│                 │ sent!                                    │
│                 │                                          │
│                 │ ┌──────────────────────────────────┐   │
│                 │ │ Type a message...          [📤]  │   │
│                 │ └──────────────────────────────────┘   │
│                 │                                          │
└─────────────────┴──────────────────────────────────────────┘
```

---

### 12. Memories Page (/dashboard/memories)
**Route:** `/dashboard/memories`

```
┌──────────────────────────────────────────────────────────────┐
│ Wedding Memories                            [+ New Album]    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Stats:                                                      │
│  Albums: 6 | Total Photos: 372 | Likes: 1,203 | My Likes: 8│
│                                                              │
│  Photo Albums:                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ [Image]      │  │ [Image]      │  │ [Image]      │     │
│  │ Ceremony     │  │ Reception    │  │ Getting Ready│     │
│  │ 45 photos    │  │ 87 photos    │  │ 32 photos    │     │
│  │ 3 days ago   │  │ 3 days ago   │  │ 3 days ago   │     │
│  │              │  │              │  │              │     │
│  │ Shared: All  │  │ Shared: All  │  │ Shared:      │     │
│  │ Guests       │  │ Guests       │  │ Bride's      │     │
│  │              │  │              │  │ Family       │     │
│  │ ❤️ 45 [⬇️]   │  │ ❤️ 87 [⬇️]   │  │ ❤️ 32 [⬇️]   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Cocktail     │  │ First Dance  │  │ Guest        │     │
│  │ Hour         │  │ & Cake       │  │ Candids      │     │
│  │ 56 photos    │  │ 28 photos    │  │ 124 photos   │     │
│  │              │  │              │  │              │     │
│  │ Shared: All  │  │ Shared: All  │  │ Shared: All  │     │
│  │ Guests       │  │ Guests       │  │ Guests       │     │
│  │              │  │              │  │              │     │
│  │ ❤️ 56 [⬇️]   │  │ ❤️ 89 [⬇️]   │  │ ❤️ 124 [⬇️]  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  Upload Photos                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Drag & drop photos here or click to browse        │  │
│  │ [📁 Choose Files]                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 13. Profile Page (/dashboard/profile)
**Route:** `/dashboard/profile`

```
┌──────────────────────────────────────────────────────────────┐
│ My Profile                                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Personal Information                                        │
│  First Name: ┌──────────────┐                              │
│              │ Sarah         │                              │
│              └──────────────┘                              │
│                                                              │
│  Last Name: ┌──────────────┐                               │
│             │ Johnson       │                               │
│             └──────────────┘                               │
│                                                              │
│  Email: sarah@example.com (verified ✓)                     │
│                                                              │
│  Phone: ┌──────────────────┐                               │
│         │ (555) 123-4567   │                               │
│         └──────────────────┘                               │
│                                                              │
│  Bio: ┌─────────────────────────────────────┐             │
│       │ Wedding planner and bride-to-be     │             │
│       └─────────────────────────────────────┘             │
│                                                              │
│  Wedding Information                                        │
│  Wedding Date: June 15, 2024                               │
│  Venue: The Grand Ballroom                                 │
│  Estimated Guests: 150                                     │
│  Theme: Romantic Garden                                    │
│  Primary Color: [🌹]                                       │
│  Secondary Color: [💜]                                     │
│                                                              │
│  Account Security                                           │
│  [Change Password] [Enable 2FA] [Deactivate Account]      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Save Changes]                                        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 14. Settings/Collaborators Page (/dashboard/settings)
**Route:** `/dashboard/settings`

```
┌──────────────────────────────────────────────────────────────┐
│ Settings - Collaborators                    [+ Invite]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Invite Collaborators                                        │
│  Email: ┌──────────────────────────┐                        │
│         │ collaborator@example.com  │                        │
│         └──────────────────────────┘                        │
│                                                              │
│  Role: [Family Member ▼]                                    │
│  ☐ Can edit wedding details                                │
│  ☐ Can manage guests                                       │
│  ☑ Can view budget                                         │
│  ☐ Can manage vendors                                      │
│                                                              │
│  [Send Invitation]                                          │
│                                                              │
│  ─────────────────────────────────────────────────────────  │
│                                                              │
│  Active Collaborators:                                      │
│  Name | Email | Role | Added | Action                      │
│  ───────────────────────────────────────────────────────    │
│  Mom | mom@example.com | Family | Apr 1 | [Remove]        │
│  Maid of Honor | moh@example.com | Friend | Apr 5 | [...]  │
│  Wedding Planner | planner@ex.com | Planner | Apr 10 | ... │
│                                                              │
│  Collaboration Permissions:                                 │
│  ☑ Allow guests to RSVP online                            │
│  ☑ Allow collaborators to send messages                   │
│  ☑ Allow sharing budget details                           │
│  ☑ Allow vendor communication                             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### 15. Admin Dashboard (/admin/dashboard)
**Route:** `/admin/dashboard`  
**Access:** Admin users only

```
┌──────────────────────────────────────────────────────────────┐
│ Admin Dashboard - Platform Analytics                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Platform Overview:                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Users    │  │ Weddings │  │ Vendors  │  │ Revenue  │   │
│  │ 1,234    │  │ 342      │  │ 156      │  │ $125,400 │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  User Growth (Monthly)                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [Line Chart showing growth trend]                  │    │
│  │ Jan: 250 | Feb: 380 | Mar: 450 | Apr: 520 | ...  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Wedding Trends (Monthly)                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ [Line Chart showing weddings created]              │    │
│  │ Jan: 45 | Feb: 52 | Mar: 68 | Apr: 85 | ...      │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Vendors by Category                                         │
│  ┌──────────────┐    Photography: 28                        │
│  │ (Pie Chart)  │    Catering: 22                           │
│  │              │    Venues: 18                             │
│  │              │    Other: 88                              │
│  └──────────────┘                                           │
│                                                              │
│  Recent Signups                                              │
│  User | Email | Role | Joined                              │
│  ──────────────────────────────────────────────────        │
│  Sarah J. | sarah@ex.com | Bride | 2 hours ago            │
│  Michael V. | michael@ex.com | Vendor | 5 hours ago       │
│  Emma D. | emma@ex.com | Family | 1 day ago               │
│                                                              │
│  System Status:                                              │
│  Database: ✓ Connected | API: ✓ Running | Emails: ✓       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 📱 Mobile Responsive Views

All pages are fully responsive:
- **Desktop**: Full sidebar + content area
- **Tablet**: Collapsible sidebar + content
- **Mobile**: Bottom navigation bar + full-width content

---

## 🎨 Design System Elements

### Navigation
- Fixed sidebar on desktop (collapsible on tablet/mobile)
- Top navigation bar with user menu
- Breadcrumb navigation for deep pages
- Footer with links and info

### Cards & Sections
- Card components with rounded corners and shadows
- Stat cards with icons and values
- Feature cards with hover effects
- Grid layouts for responsive design

### Forms & Inputs
- Text inputs with placeholders
- Password inputs with visibility toggle
- Select dropdowns with icons
- Date/time pickers
- Color pickers
- Checkboxes and radio buttons
- Dialog forms for actions

### Tables
- Responsive tables with sorting
- Status badges and icons
- Action buttons in each row
- Pagination for large lists

### Visual Elements
- Progress bars for tracking (budget, timeline)
- Charts (pie, bar, line charts)
- Badges for status and categories
- Icons from Lucide React
- Color-coded alerts and indicators

---

## 🚀 Getting Started with Frontend

**Open the application:**
```
http://localhost:3001
```

**Navigate through pages:**
1. Start at landing page
2. Sign up for an account
3. Create a wedding
4. Explore each planning area
5. Try different features

**Default test accounts:**
```
Bride: bride@example.com / password123
Family: family@example.com / password123
Vendor: vendor@example.com / password123
```

---

Happy exploring the WedBliss frontend! 💍✨
