# WedBliss API Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All endpoints (except `/auth/register` and `/auth/login`) require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Routes (`/auth`)
- `POST /register` - Register new user
  - Body: `{ name, email, password, role }`
- `POST /login` - Login user
  - Body: `{ email, password }`
- `GET /me` - Get current user profile
- `POST /logout` - Logout user

### Wedding Routes (`/weddings`)
- `POST /` - Create new wedding
  - Body: `{ brideName, groomName, weddingDate, venue, theme, colors, numberOfGuests, totalBudget }`
- `GET /` - Get user's weddings
- `GET /:id` - Get wedding details
- `PUT /:id` - Update wedding
- `POST /:id/collaborators` - Add collaborator

### Guest Routes (`/guests`)
- `POST /` - Add guest
  - Body: `{ weddingId, firstName, lastName, email, phone, relationship, side, numberOfGuests }`
- `GET /wedding/:weddingId` - Get wedding guests
- `PUT /:id` - Update guest
- `PUT /:id/rsvp` - Update RSVP status
  - Body: `{ rsvpStatus, numberOfGuests, mealChoice, dietaryRestrictions }`
- `DELETE /:id` - Delete guest
- `GET /stats/:weddingId` - Get guest statistics

### Budget Routes (`/budget`)
- `GET /wedding/:weddingId` - Get wedding budget
- `GET /summary/:weddingId` - Get budget summary
- `PUT /:id` - Update budget
- `POST /:id/items` - Add budget item
- `PUT /:id/items` - Update budget item

### Vendor Routes (`/vendors`)
- `GET /` - Get all vendors (public)
- `GET /:id` - Get vendor details (public)
- `POST /` - Create vendor listing (vendors only)

### Booking Routes (`/bookings`)
- `GET /wedding/:weddingId` - Get wedding bookings
- `POST /` - Create booking
- `PUT /:id` - Update booking
- `GET /:id` - Get booking details

### Invitation Routes (`/invitations`)
- `GET /` - Get invitations
- `POST /` - Send invitation
- `PUT /:id` - Update invitation

### Timeline Routes (`/timeline`)
- `GET /` - Get timeline events
- `POST /` - Create timeline event
- `PUT /:id` - Update timeline event

### Seating Routes (`/seating`)
- `GET /` - Get seating arrangements
- `POST /` - Create seating arrangement
- `PUT /:id` - Update seating arrangement

### Media Routes (`/media`)
- `GET /` - Get media
- `POST /upload` - Upload media
- `DELETE /:id` - Delete media

### Chat Routes (`/chat`)
- `GET /conversations` - Get user conversations
- `GET /conversation/:conversationId` - Get conversation messages
- `POST /message` - Send message
- `POST /conversation` - Create conversation

### Admin Routes (`/admin`)
- `GET /dashboard` - Get admin dashboard data
- `GET /users` - Get all users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /analytics` - Get analytics

## User Roles
- `bride` - Wedding organizer
- `family` - Family collaborator
- `vendor` - Vendor account
- `admin` - Admin account

## Real-time Events (Socket.io)
- `join-chat` - Join a chat room
- `send-message` - Send message to room
- `receive-message` - Receive message from room

## Error Handling
All endpoints return errors in the format:
```json
{
  "message": "Error description"
}
```

## Database Models
- User - User accounts with roles
- Wedding - Wedding details and configuration
- Guest - Guest list and RSVP management
- Budget - Budget tracking and expenses
- Vendor - Vendor profiles and services
- Booking - Vendor bookings
- Invitation - Digital invitations
- Timeline - Wedding day timeline
- SeatingArrangement - Seating chart
- Media - Photos and videos
- Chat - Real-time messaging
