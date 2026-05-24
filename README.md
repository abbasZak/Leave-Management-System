# Leave-Management-System
Leave Management system for Junior Developer Assessment. 

# Employee Leave Management System

A full-stack leave management application built with React, TypeScript, and Laravel.

Employees can create and manage leave requests, while admins can approve or reject requests through an admin dashboard.

---

# Tech Stack

# Frontend

* React
* TypeScript
* React Router
* Axios
* TanStack Query
* React Hook Form
* TailwindCSS

# Backend

* Laravel
* Laravel Sanctum
* MySQL / PostgreSQL


# Features

# Employee

* Authentication (Login/Logout)
* Create leave request
* Edit pending requests
* Cancel requests
* View leave history

# Admin

* Approve/reject leave requests
* Add comments
* Filter requests by status/type
* Search employees

---

# API Endpoints

```http
GET    /leave-requests
POST   /leave-requests
PUT    /leave-requests/{id}
DELETE /leave-requests/{id}

PUT    /leave-requests/{id}/approve
PUT    /leave-requests/{id}/reject
```

---

# Installation

# Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

# Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Test Accounts

# Admin

```
admin@example.com
password
```

# Employee

```
employee@example.com
password
```

---

# Folder Structure

# Frontend

```
src/
├── api/
├── components/
├── hooks/
├── pages/
├── routes/
├── types/
└── utils/
```

### Backend

```
app/
├── Http/
├── Models/
├── Policies/
└── Services/
```

---

# Validation Rules

* End date cannot be before start date
* Only pending requests can be edited
* Only authenticated users can access routes
* Only admins can approve/reject requests

---


## Author

Abbas Zakariya

Your Name
