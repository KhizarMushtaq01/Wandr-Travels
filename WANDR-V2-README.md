# 🌍 Wandr v2.0 — All-In-One Adventure Travel Planner

A complete, production-ready full-stack travel platform with Vite + React frontend and Node.js + Express + MongoDB backend. Features a cinematic storytelling landing page with real travel photography, 35+ pages, 13 policy pages, and fully animated UI.

---

## ✅ Build Status

**Frontend (Vite):** ✅ Builds successfully (1,065 kB / 304 kB gzipped)  
**Backend (Express):** ✅ All 13 route groups wired  
**Emails:** ✅ 12 automated transactional emails  
**Pages:** ✅ 43 React pages  
**Policy pages:** ✅ 13 complete legal/info pages  
**Vite dev server:** ✅ Hot module replacement ready

---

## 🏗️ Tech Stack

| Layer       | Technology                                   |
|-------------|----------------------------------------------|
| Frontend    | **React 18 + Vite 6** (fast HMR)            |
| Styling     | Tailwind CSS v3 + custom design system       |
| Animation   | Framer Motion (parallax, scroll reveals)     |
| State       | Zustand                                      |
| Routing     | React Router v6                              |
| Charts      | Recharts                                     |
| Backend     | Node.js 20 + Express 4                       |
| Database    | MongoDB + Mongoose                           |
| Auth        | JWT                                          |
| Email       | Nodemailer (Gmail SMTP)                      |
| File upload | Multer                                       |
| Security    | Helmet, CORS, Rate Limiting, bcrypt-12       |

---

## 🎨 Design Highlights

- **Cinematic hero** with auto-cycling Unsplash travel photography + parallax scroll
- **Storytelling layout** — 4-act scroll narrative (Dream → Plan → Go → Remember)
- **Split-screen auth pages** — travel imagery left, form right
- **Animated sections** — Framer Motion scroll-triggered fade/slide reveals
- **Glassmorphism cards** — backdrop-blur + border effects
- **Custom typography** — Cormorant Garamond (display) + DM Sans (body)
- **Gold accent system** — `#e8c27a` primary with gradient variants
- **Travel imagery** throughout — Unsplash photos in hero, destinations, stories, blog

---

## 📱 Complete Route Map (43 pages)

### Public Routes
| Route | Page |
|-------|------|
| `/` | Storytelling Landing Page |
| `/explore` | Public Trip Discovery |
| `/login` | Split-screen Sign In |
| `/register` | Split-screen Register |
| `/forgot-password` | Password Reset Request |
| `/reset-password/:token` | Set New Password |

### Policy & Info Pages
| Route | Page |
|-------|------|
| `/about` | About Wandr (with travel imagery) |
| `/contact` | Contact Form + team emails |
| `/careers` | Open Positions + benefits |
| `/press` | Press Kit + media coverage |
| `/help` | Help Center + searchable FAQ |
| `/blog` | Travel Stories Blog |
| `/blog/:slug` | Blog Post detail |
| `/privacy` | Privacy Policy (full GDPR) |
| `/terms` | Terms of Service |
| `/cookies` | Cookie Policy + live toggles |
| `/refund` | Refund Policy |
| `/acceptable-use` | Acceptable Use Policy |
| `/accessibility` | Accessibility Statement |

### Client Dashboard (Auth Required)
| Route | Page |
|-------|------|
| `/dashboard` | Overview, stats, quick actions |
| `/trips` | Trip list with filters |
| `/trips/new` | Create trip form |
| `/trips/:id` | Trip detail + collaborators |
| `/trips/:id/itinerary` | Day-by-day itinerary builder |
| `/bookings` | Booking manager |
| `/bookings/:id` | Booking detail |
| `/budget` | Expense tracker + pie chart |
| `/packing` | Packing lists with templates |
| `/discover` | Community trip discovery |
| `/journal` | Travel journal list |
| `/journal/:id` | Journal entry + comments |
| `/social` | Social feed + suggestions |
| `/profile` | User profile + edit |
| `/profile/:id` | Any user's public profile |
| `/settings` | Account settings |
| `/settings/security` | Password + login history |
| `/settings/notifications` | Email preferences (toggles) |
| `/settings/danger` | Delete account |
| `/notifications` | All notifications |

### Admin Panel
| Route | Page |
|-------|------|
| `/admin` | Dashboard with charts |
| `/admin/users` | User management + role control |
| `/admin/trips` | Trip management + feature |
| `/admin/bookings` | All bookings overview |
| `/admin/activity` | Login activity log |
| `/admin/settings` | System health + broadcast email |

---

## 🚀 Setup (5 Minutes)

### Prerequisites
- Node.js 18+
- MongoDB (local) or [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- Gmail account for email sending

### 1. Install
```bash
unzip wandr-v2.zip
cd wandr-v2

# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure Email (Gmail)
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Enable 2FA if not already done
3. Create app password → select "Mail"
4. Copy the 16-character code

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wandr
JWT_SECRET=your_random_secret_here

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
EMAIL_FROM=Wandr Travel <your@gmail.com>

CLIENT_URL=http://localhost:3000
```

### 3. Seed Demo Data
```bash
cd backend
npm run seed
```

### 4. Run
```bash
# Terminal 1
cd backend && npm run dev      # API at :5000

# Terminal 2  
cd frontend && npm run dev     # App at :3000
```

Open **http://localhost:3000** 🎉

---

## 👤 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@wandr.travel | admin123 |
| User | sarah@example.com | password123 |
| User | marco@example.com | password123 |

**Make yourself admin:**
```js
// MongoDB Compass or shell
db.users.updateOne({ email: "you@email.com" }, { $set: { role: "admin" } })
```

---

## 📧 Email Triggers

| Event | Email |
|-------|-------|
| Register | Welcome + getting started guide |
| Sign In | Sign-in alert (IP, device, time) |
| Password Changed | Security confirmation |
| Password Reset | Reset link (1hr expiry) |
| Email Changed | Alert to old + new email |
| Avatar Changed | Security notification |
| Profile Updated | Change summary |
| Trip Created | Trip confirmation with details |
| Booking Confirmed | Full booking summary |
| Booking Cancelled | Cancellation notice |
| Trip Invite | Collaboration invite email |
| Account Deleted | Goodbye + data notice |

---

## 🗄️ Database Models

- **User** — auth, profile, followers, login history, notification prefs, subscription
- **Trip** — destinations (with activities), collaborators, likes, status, budget
- **Booking** — flights, hotels, cars, activities, status tracking
- **Expense** — categories, currency, group split
- **PackingList** — items, categories, templates, assignment
- **Journal** — posts, photos, mood, comments, likes
- **Notification** — types, read state, links

---

## 🎨 Design System

```
Fonts:     Cormorant Garamond (display) + DM Sans (body)
Primary:   #e8c27a (warm gold)
Dark bg:   #080810
Navy:      #0d1628
Border:    #1e3256
Text:      #c8d6e8
Muted:     #6b8ab8
```

Key CSS utilities: `.btn-primary`, `.btn-outline`, `.card`, `.card-hover`, `.input`, `.label`, `.badge-*`, `.glass`, `.heading-xl/lg/md`, `.nav-item`, `.prose-dark`
