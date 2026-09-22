# SEUConnect

**SEUConnect** is a comprehensive campus platform designed for the **Faculty of Technology, South Eastern University of Sri Lanka (SEUSL)**. It bridges communication between students, lecturers, academic departments, and student organizations.

---

## 🌟 Key Features

- **Academic Hub**: Announcements, lecture schedules, course material repositories, and timetable access.
- **Community & Clubs**: Connect with student societies, technology clubs, and campus events.
- **Smart Notifications**: Real-time updates on notices, assignments, and campus alerts.
- **User Authentication**: Secure role-based access for Students, Faculty/Lecturers, and Administrators.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v7
- **Styling**: Modern Vanilla CSS with responsive design system
- **Icons**: Lucide React
- **Data Visualization**: Recharts

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Bcrypt
- **File Uploads**: Multer

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd backend
npm install
# Copy and configure environment variables
cp .env.example .env
# Start development server
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Start Vite development server
npm run dev
```

The frontend will run at `http://localhost:5173` and proxy API requests to `http://localhost:5000`.

---

## 🏛️ South Eastern University of Sri Lanka (SEUSL)
Developed for the Faculty of Technology community.
