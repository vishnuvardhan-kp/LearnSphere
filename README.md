# 🎓 LearnSphere - E-Learning Platform

A comprehensive e-learning platform with separate interfaces for Admins, Instructors, and Learners.

## 🚀 Quick Start

### Option 1: Start All Components at Once (Easiest)
Double-click: **`start-all.bat`**

This will open 4 terminal windows and start:
- Backend Server (Port 5001)
- Admin Frontend (Port 5173)
- Instructor Frontend (Port 5174)
- Learner Frontend (Port 5175)

### Option 2: Start Components Individually

Double-click the respective batch file:
- **`start-backend.bat`** - Start backend server
- **`start-admin.bat`** - Start admin frontend
- **`start-instructor.bat`** - Start instructor frontend
- **`start-learner.bat`** - Start learner frontend

### Option 3: Manual Start (Command Line)

See **[HOW_TO_START.md](HOW_TO_START.md)** for detailed manual instructions.

---

## 📁 Project Structure

```
LearnSphere/
├── backend/                    # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API routes
│   │   ├── middleware/        # Auth & validation
│   │   └── database/          # Database schema
│   └── server.js              # Entry point
│
├── frontend/
│   ├── admin/             # Admin Dashboard (React + TypeScript)
│   ├── instructor/            # Instructor Portal (React + TypeScript)
│   └── learner/               # Learner Platform (React + TypeScript)
│
├── start-all.bat              # Start everything at once
├── start-backend.bat          # Start backend only
├── start-admin.bat            # Start admin only
├── start-instructor.bat       # Start instructor only
└── start-learner.bat          # Start learner only
```

---

## 🔐 Authentication System

### Three Separate Login Systems:

1. **Admin** (Separate)
   - Endpoint: `/api/admin/auth/login`
   - No signup (created via seed script)

2. **Instructor & Learner** (Unified)
   - Endpoint: `/api/auth/login`
   - Instructors: No signup (created by admin)
   - Learners: Can signup via `/api/auth/signup`

See **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** for complete details.

---

## 👥 Test Accounts

### Admin
- Email: `admin@example.com`
- Password: `password123`
- Access: http://localhost:5173

### Instructors
- Email: `instructor1@example.com` / Password: `password123`
- Email: `instructor2@example.com` / Password: `password123`
- Access: http://localhost:5174

### Learners
- Email: `learner1@example.com` / Password: `password123`
- Email: `learner2@example.com` / Password: `password123`
- Email: `learner3@example.com` / Password: `password123`
- Access: http://localhost:5175
- Or **signup** for a new account!

---

## 🌐 URLs & Ports

| Component | Port | URL | Purpose |
|-----------|------|-----|---------|
| Backend | 5001 | http://localhost:5001 | API Server |
| Admin | 5173 | http://localhost:5173 | Admin Dashboard |
| Instructor | 5174 | http://localhost:5174 | Instructor Portal |
| Learner | 5175 | http://localhost:5175 | Learner Platform |

---

## 📚 Documentation

- **[HOW_TO_START.md](HOW_TO_START.md)** - Detailed startup guide
- **[AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md)** - Authentication system docs
- **[STATUS_REPORT.md](STATUS_REPORT.md)** - Current project status

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL 16
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React 18
- TypeScript
- Vite
- Axios for API calls
- TailwindCSS (Admin & Learner)

---

## ⚙️ Prerequisites

1. **Node.js** (v16 or higher)
2. **PostgreSQL** (v16 or higher)
3. **Database** named `learnsphere` must exist

---

## 🔧 First Time Setup

1. **Create PostgreSQL Database**
   ```sql
   CREATE DATABASE learnsphere;
   ```

2. **Configure Backend**
   - Check `backend/.env` file
   - Ensure database credentials are correct

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Admin Frontend
   cd "../frontend/admin"
   npm install

   # Instructor Frontend
   cd ../instructor
   npm install

   # Learner Frontend
   cd ../learner
   npm install
   ```

4. **Seed Database**
   ```bash
   cd backend
   node seed-admin.js
   node seed-test-users.js
   ```

5. **Start All Components**
   - Double-click `start-all.bat`
   - Or start each component individually

---

## 🎯 Features

### Admin Dashboard
- ✅ User management (view, create instructors)
- ✅ Course management
- ✅ Reports and analytics
- ✅ System configuration

### Instructor Portal
- 🔄 Course creation and management
- 🔄 Student progress tracking
- 🔄 Content upload
- 🔄 Analytics dashboard

### Learner Platform
- ✅ Course enrollment
- ✅ Video lessons
- ✅ Document lessons
- ✅ Quizzes with scoring
- ✅ Progress tracking
- ✅ Points and badges

---

## 🆘 Troubleshooting

### Backend won't start
- Check if PostgreSQL is running
- Verify database exists
- Check `.env` credentials

### Frontend won't start
- Run `npm install` in the frontend folder
- Check if port is already in use
- Ensure backend is running first

### Can't login
- Verify you're using the correct login endpoint
- Admin uses different endpoint than instructors/learners
- Check credentials match test accounts

---

## 📞 Support

For issues or questions, check the documentation files:
- HOW_TO_START.md
- AUTHENTICATION_GUIDE.md
- STATUS_REPORT.md

---

## 📄 License

This project is for educational purposes.

---

**Happy Learning! 🎓**
