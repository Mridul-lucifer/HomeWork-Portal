# School Management System (CBSE Compliant)

A cross-platform (iOS, Android, Web) application built with React Native and Express.js, 
using Neon PostgreSQL for secure, scalable data management.

## 🚀 Key Features
- **Role-Based Access:** Distinct flows for Admin, Teacher, and Student.
- **Academic Tracking:** Date-based Homework and Classwork management.
- **Modern UI:** Built with NativeWind (Tailwind CSS) for a professional look.
- **SQL Backend:** Secure relational database using Sequelize ORM.

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo), NativeWind, Lucide Icons.
- **Backend:** Node.js, Express.js, JWT Authentication.
- **Database:** Neon PostgreSQL.

## 📂 Installation

### Backend
1. `cd backend`
2. `npm install`
3. Configure your `.env` with `DATABASE_URL` from Neon.
4. `npm start`

### Frontend
1. `cd frontend`
2. `npm install`
3. Update `axios.defaults.baseURL` to your server URL.
4. `npx expo start`

## 🔒 Security Measures
- **Bcrypt:** Password hashing before storage.
- **JWT:** Token-based session management.
- **SSL:** Mandatory for all database and API connections.