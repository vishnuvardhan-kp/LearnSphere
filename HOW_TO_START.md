# LearnSphere - How to Start All Components

## 🚀 Quick Start Guide

### Prerequisites
- Node.js installed
- PostgreSQL running on localhost:5432
- Database 'learnsphere' created

---

## 📋 Starting Each Component Separately

### 1️⃣ Backend Server (Port 5001)

**Location:** `backend/`

**Commands:**
```bash
# Navigate to backend folder
cd "d:\New folder\backend"

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

**Expected Output:**
```
Server running on port 5001
Connected to PostgreSQL database.
Schema execution successful (Safe & Idempotent).
```

**Health Check:** http://localhost:5001/health

---

### 2️⃣ Admin Frontend (Port 5173)

**Location:** `frontend/new admin/`

**Commands:**
```bash
# Navigate to admin frontend folder
cd "d:\New folder\frontend\admin"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
VITE v7.3.1  ready in 910 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Access:** http://localhost:5173

**Login Credentials:**
- Email: admin@example.com
- Password: password123

---

### 3️⃣ Instructor Frontend (Port 5174)

**Location:** `frontend/instructor/`

**Commands:**
```bash
# Navigate to instructor frontend folder
cd "d:\New folder\frontend\instructor"

# Install dependencies (first time only)
npm install

# Start the development server (will use port 5174)
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms

➜  Local:   http://localhost:5174/
```

**Access:** http://localhost:5174

**Login Credentials:**
- Email: instructor1@example.com
- Password: password123

---

### 4️⃣ Learner Frontend (Port 5175)

**Location:** `frontend/learner/`

**Commands:**
```bash
# Navigate to learner frontend folder
cd "d:\New folder\frontend\learner"

# Install dependencies (first time only)
npm install

# Start the development server (will use port 5175)
npm run dev
```

**Expected Output:**
```
VITE ready in XXX ms

➜  Local:   http://localhost:5175/
```

**Access:** http://localhost:5175

**Login Credentials:**
- Email: learner1@example.com
- Password: password123
- Or signup for a new account!

---

## 🎯 Port Summary

| Component | Port | URL |
|-----------|------|-----|
| **Backend** | 5001 | http://localhost:5001 |
| **Admin Frontend** | 5173 | http://localhost:5173 |
| **Instructor Frontend** | 5174 | http://localhost:5174 |
| **Learner Frontend** | 5175 | http://localhost:5175 |

---

## 📝 Startup Order (Recommended)

1. **Start Backend First** (Port 5001)
   - This must be running before any frontend can work
   
2. **Start Admin Frontend** (Port 5173)
   - Independent, can start anytime after backend

3. **Start Instructor Frontend** (Port 5174)
   - Independent, can start anytime after backend

4. **Start Learner Frontend** (Port 5175)
   - Independent, can start anytime after backend

---

## 🛑 How to Stop

Press `Ctrl + C` in each terminal window to stop the respective server.

---

## 🔧 Troubleshooting

### Port Already in Use
If you get "port already in use" error:

**Option 1:** Kill the process using that port
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

**Option 2:** Change the port in vite.config.ts (for frontends)
```typescript
export default defineConfig({
  server: {
    port: 5176  // Change to any available port
  }
})
```

### Dependencies Not Installed
If you get module not found errors:
```bash
npm install
```

### Backend Won't Start
1. Check if PostgreSQL is running
2. Check if database 'learnsphere' exists
3. Check .env file has correct credentials

---

## 💡 Tips

- Keep each component running in a **separate terminal window**
- Backend must be running for frontends to work properly
- You can run all 4 components simultaneously
- Use `npm run dev` for development (hot reload enabled)
- Use `npm run build` for production builds

---

## 🎨 Visual Terminal Layout Suggestion

```
┌─────────────────┬─────────────────┐
│   Terminal 1    │   Terminal 2    │
│   Backend       │   Admin         │
│   Port 5001     │   Port 5173     │
├─────────────────┼─────────────────┤
│   Terminal 3    │   Terminal 4    │
│   Instructor    │   Learner       │
│   Port 5174     │   Port 5175     │
└─────────────────┴─────────────────┘
```

Open 4 terminal windows and run each component in its own window!
