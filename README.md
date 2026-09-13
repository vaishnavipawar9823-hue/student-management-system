# Student Management System

A web-based Student Management System built with React, PHP, and MySQL.

## Features

- Admin login and logout
- Protected admin dashboard
- Student registration
- Student profile image upload
- View student details
- Edit student details
- Delete students
- Search students
- Filter students by course
- Dashboard statistics
- Course charts
- Student tables
- Forms
- UI components
- Student details modal
- Admin profile
- Settings
- Dark mode
- Sidebar collapse and expand
- Responsive admin layout

## Technologies

### Frontend

- React
- React Router
- Axios
- Vite
- Bootstrap Icons

### Backend

- PHP
- MySQL
- XAMPP

### Version Control

- Git
- GitHub

## Project Structure

```text
student-management-system/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── AddStudent.jsx
│   │   ├── AdminLayout.jsx
│   │   ├── AdminLayout.css
│   │   ├── Charts.jsx
│   │   ├── Components.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Forms.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── StudentCount.jsx
│   │   ├── StudentManagement.jsx
│   │   ├── StudentModal.jsx
│   │   └── Tables.jsx
│   └── package.json
│
├── php-api/
│   ├── auth/
│   │   ├── login.php
│   │   ├── logout.php
│   │   ├── profile.php
│   │   └── register.php
│   │
│   ├── config/
│   │   └── db.php
│   │
│   ├── middleware/
│   │   └── auth.php
│   │
│   ├── students/
│   │   ├── create.php
│   │   ├── delete.php
│   │   ├── get.php
│   │   └── update.php
│   │
│   ├── uploads/
│   │   └── .gitkeep
│   │
│   └── test-db.php
│
├── backend/
│
├── .gitignore
└── README.md