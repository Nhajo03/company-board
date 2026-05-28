# 📺 Company Board — Digital Signage App

A modern digital signage system built with **React + Supabase + Tailwind CSS**.  
Black modern theme, full-screen TV optimized, with admin dashboard and public landing page.

---

## 🗂 Project Structure

```
src/
├── lib/
│   └── supabase.js          ← Supabase client
├── components/
│   └── ProtectedRoute.jsx   ← Auth guard for admin
├── pages/
│   ├── LandingPage.jsx      ← Public website (/)
│   ├── KioskScreen.jsx      ← TV display (/kiosk)
│   ├── AdminLogin.jsx       ← Login page (/login)
│   └── AdminDashboard.jsx   ← Admin panel (/admin)
├── App.jsx                  ← Router
├── main.jsx                 ← Entry point
└── index.css                ← Tailwind base
```

---

## 🚀 Setup Guide

### Step 1 — Create Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (note your **project URL** and **anon key**)
3. Go to **SQL Editor** and run the full contents of `supabase-schema.sql`

### Step 2 — Create admin user

In Supabase dashboard:  
**Authentication → Users → Add User**  
Enter your email and password → Save

### Step 3 — Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4 — Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📺 Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (public website) |
| `/kiosk` | Full-screen TV display |
| `/login` | Admin login |
| `/admin` | Admin dashboard (protected) |

---

## ☁️ Deploy to Vercel (free)

> **Note:** GitHub Pages does NOT work with React Router or environment variables.  
> Use **Vercel** instead — it's free and takes 2 minutes.

```bash
# 1. Push your code to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/company-board.git
git push -u origin main

# 2. Go to vercel.com → Import your GitHub repo
# 3. Add environment variables in Vercel dashboard:
#    VITE_SUPABASE_URL
#    VITE_SUPABASE_ANON_KEY
# 4. Deploy!
```

---

## ✨ Features

- **Kiosk Screen** — Auto-sliding announcements, live weather (Open-Meteo API, no key needed), live clock, alert ticker bar
- **Admin Dashboard** — Create/edit/delete announces, image upload to Supabase Storage, toggle active/inactive, set expiry dates
- **Landing Page** — Modern dark corporate site linked to your app
- **Auth** — Supabase email/password authentication, protected admin routes
- **Auto Refresh** — Kiosk fetches new content every 5 minutes automatically

---

## 🛠 Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | Frontend framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Supabase | Database + Auth + Storage |
| React Router v6 | Navigation |
| Open-Meteo | Free weather API (no key needed) |

---

## 📝 Customization

- Change `Company Board` text in all files to your company name
- Update colors in `tailwind.config.js` (currently black/white)
- Adjust `SLIDE_DURATION` in `KioskScreen.jsx` (default: 8 seconds)
- Adjust `REFRESH_INTERVAL` in `KioskScreen.jsx` (default: 5 minutes)
