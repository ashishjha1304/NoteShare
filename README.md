# NoteShare — Online Notes Sharing Platform

A full-stack web application for students to share, discover, and download study notes. Built with Next.js, Express.js, and Supabase.

![NoteShare](https://img.shields.io/badge/NoteShare-v1.0-6366f1?style=for-the-badge)

---

## ✨ Features

- 🔐 **Authentication** — Sign up, login with Supabase Auth
- 📤 **High-Capacity Uploads** — Support for PDFs from **2KB up to 200MB**
- 📚 **Smart Categorization** — Create new subjects on the fly or select existing ones
- 🔍 **Search** — Search notes by title, subject, or keywords
- ⬇️ **Download** — Download PDFs with download tracking
- ⭐ **Ratings** — Rate notes (1-5 stars)
- 💬 **Comments** — Discuss and review notes
- 👑 **Admin Panel** — Manage notes, users, view stats
- 🌓 **Dynamic Theme** — Optimized Light and Dark modes with glassmorphism
- 📱 **Mobile-First Design** — Premium **Bottom Navigation** for effortless mobile browsing
- ✨ **Rich Aesthetics** — Smooth animations, custom gradients, and backdrop blurs (Glassmorphism)
- 🛡️ **Safe Areas** — Fully compatible with modern mobile devices and notch displays

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TailwindCSS, Axios |
| Backend | Node.js, Express.js |
| Database | Supabase PostgreSQL |
| Storage | Supabase Storage |
| Auth | Supabase Auth |

---

## 📁 Folder Structure

```
Online Notes Website/
├── frontend/                    # Next.js 14 frontend
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── BottomNav.js         # Mobile navigation bar
│   │   ├── NoteCard.js
│   │   ├── SearchBar.js
│   │   ├── RatingStars.js
│   │   ├── CommentSection.js
│   │   └── UploadForm.js
│   ├── pages/
│   │   ├── _app.js
│   │   ├── _document.js
│   │   ├── index.js             # Homepage
│   │   ├── login.js
│   │   ├── signup.js
│   │   ├── upload.js
│   │   ├── notes.js             # Browse all notes
│   │   ├── notes/[subject].js   # Notes by subject
│   │   ├── note/[id].js         # Note detail page
│   │   └── admin.js             # Admin panel
│   ├── services/
│   │   ├── api.js               # Axios client
│   │   ├── auth.js              # Auth helpers
│   │   └── notesService.js      # API service
│   └── styles/
│       └── globals.css
│
├── backend/                     # Express.js backend
│   ├── server.js
│   ├── config/
│   │   └── supabaseClient.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── notesController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── routes/
│       ├── authRoutes.js
│       ├── notesRoutes.js
│       ├── commentRoutes.js
│       └── adminRoutes.js
│
└── supabase-schema.sql          # Database schema + sample data
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your **Project URL**, **anon key**, and **service role key** from Settings → API

### 2. Run SQL Schema

1. In your Supabase Dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` and execute it
3. This creates all tables, indexes, RLS policies, and sample data

### 3. Create Storage Bucket

1. Go to **Storage** in the Supabase Dashboard
2. Click **New Bucket**
3. Name it `notes-pdfs` and set it to **Public**
4. Add storage policies:
   - **Authenticated uploads**: Allow INSERT for authenticated users
   - **Public downloads**: Allow SELECT for everyone

### 4. Set Up Backend

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your Supabase credentials:
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=your_anon_key
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
# PORT=5000

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend runs at `http://localhost:5000`

### 5. Set Up Frontend

```bash
cd frontend

# Copy environment file
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
# NEXT_PUBLIC_API_URL=http://localhost:5000

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user |
| POST | `/auth/login` | Login user |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notes` | Get all notes (supports `?search=`, `?subject=`, `?sort=`) |
| GET | `/notes/subjects` | Get all subjects |
| GET | `/notes/subject/:subject` | Get notes by subject name |
| GET | `/notes/details/:id` | Get single note details |
| POST | `/notes/upload` | Upload a new note (auth required) |
| GET | `/notes/download/:id` | Track download and get file URL |
| POST | `/notes/rate` | Rate a note (auth required) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/comments/add` | Add comment (auth required) |
| GET | `/comments/:noteId` | Get comments for a note |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/stats` | Platform statistics (admin only) |
| GET | `/admin/users` | List all users (admin only) |
| GET | `/admin/notes` | List all notes (admin only) |
| DELETE | `/admin/note/:id` | Delete a note (admin only) |

---

## 📦 Sample Data

The SQL schema includes sample data so the site works immediately:

**Subjects:**
- Computer Science
- Database Management System
- Python Programming
- Web Development
- Data Structures

**Sample Notes:**
1. Introduction to DBMS
2. Python Basics Notes
3. HTML and CSS Fundamentals
4. Data Structures & Algorithms
5. Operating Systems Concepts

**Demo Accounts:**
- User: `demo@noteshare.com`
- Admin: `admin@noteshare.com`

> Note: These are database records only. To login, create auth accounts via the signup flow or Supabase Auth dashboard.

---

## 🚢 Deployment

### Deploy Backend on Render

1. Push backend code to a GitHub repository
2. Go to [render.com](https://render.com)
3. Create a **New Web Service**
4. Connect your GitHub repo and select the `backend` directory
5. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `PORT`
7. Deploy!

### Deploy Frontend on Vercel

1. Push frontend code to a GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import your repository and select the `frontend` directory
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your Render backend URL)
5. Deploy!

---

## 🔒 Environment Variables

### Backend (`.env`)
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=5000
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## 📄 License

MIT License — feel free to use this project for learning and personal use.
