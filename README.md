# HRMS Lite - Human Resource Management System

A lightweight, professional internal tool for managing employee records and tracking attendance.

## 🚀 Tech Stack
- **Frontend:** React, Tailwind CSS, Lucide Icons
- **Backend:** Python, Django, Django REST Framework
- **Database:** PostgreSQL
- **Deployment:** Vercel (Frontend), Render (Backend)

## ✨ Features
- **Employee Management:** Add, View, and Delete employees with unique ID validation.
- **Attendance Roster:** Mark daily attendance (Present/Absent) with date filtering.
- **Minimalist UI:** Responsive design with Material-style notifications.

## 🛠️ Installation & Local Setup
1. Clone the repo: `git clone <repo-url>`
2. **Backend:**
   - `pip install -r requirements.txt`
   - `python manage.py migrate`
   - `python manage.py runserver`
3. **Frontend:**
   - `cd frontend`
   - `npm install`
   - `npm run dev`

## 📝 Assumptions
- Single admin access (No authentication as per requirements).
- Attendance is logged per date for the entire roster.