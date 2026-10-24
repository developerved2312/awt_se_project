# HaritAyan Deployment & Environment Setup

## 1. Prerequisites
- **Node.js:** v18.0.0 or higher
- **MongoDB Atlas Cluster:** Free M0 or M10 cluster with network access allowed (`0.0.0.0/0`)
- **Python:** v3.10+ (optional, for local `ai/` algorithms)

---

## 2. Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/haritayan_db?retryWrites=true&w=majority"

# Google Gemini AI Key
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_MODEL="gemini-3.8-flash"
JWT_SECRET="haritayan_secure_jwt_secret_key"
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

## 3. Database Seeding & Startup Commands

### Start Backend API Server
```bash
cd backend
npm install
npm run seed:mandi   # Seeds authentic APMC Mandi rates to Atlas
npm run dev          # Starts Express API server on port 5000
```

### Start Frontend Application
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server on http://localhost:5173
```

---

## 4. Docker Deployment (`docker-compose.yml`)
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      - PORT=5000
      - MONGODB_URI=${MONGODB_URI}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```
