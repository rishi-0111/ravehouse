# RAVE HOUSE — Community Event Management Platform

> **Movement. Culture. Community.**

A full-stack web application for managing community events — Running Events, Beach Activities, Social Welfare Programs, and Community Meetups.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React, Vite, Tailwind CSS v4, GSAP, Three.js, Recharts, Lucide Icons |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| **Email** | Resend (ready for integration) |
| **Hosting** | Netlify |
| **Maps** | Google Maps |

## Features

### User Side (No Login Required)
- 🎟️ Browse and register for community events
- 💳 QR-based UPI payment for paid events
- 📧 Email confirmations and QR ticket generation
- 📸 Photo and video gallery grouped by event
- 💬 Submit feedback, ratings, and suggestions
- 🤝 Volunteer registration

### Admin Dashboard (`/admin/login`)
- 📊 KPI Overview Dashboard
- 📅 Full Event CRUD Management
- ✅ Registration Approve/Reject
- 💰 Payment Verification
- 🎫 QR Ticket Check-in Desk
- 📈 Recharts Analytics (Registrations, Revenue, Attendance)
- 📢 Announcement Broadcasting
- 📄 Report Generation
- 🤖 AI Insights Engine (rule-based)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Database Setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL Editor to create all required tables.

## Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Demo Admin Access

- **Email:** `admin@ravehouse.in`
- **Password:** `admin123`

## License

MIT
