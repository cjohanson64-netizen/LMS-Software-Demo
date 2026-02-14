# LMS Demo

## Project Overview

LMS Demo is a full-stack learning management system prototype designed to demonstrate production-style client–server architecture, relational modeling, authentication flows, and role-based UI rendering.

It mirrors the structural logic of enterprise LMS platforms while emphasizing architectural clarity over UI cloning.

---

## Problem Statement

Modern LMS platforms must:

- Maintain strict client–server separation
- Securely authenticate users
- Enforce role-based permissions
- Support relational data modeling at scale
- Remain extensible for future feature growth

This project was built to demonstrate these concerns in a cohesive, production-oriented system.

---

## Architecture Summary

### Layered System Design

React Client  
↓  
Service Layer  
↓  
Express REST API  
↓  
Controllers  
↓  
Prisma ORM  
↓  
Relational Database  

All state mutations occur through authenticated endpoints.  
The client does not directly mutate data.

Clear separation between:

- UI components
- Service abstraction
- API layer
- Data access layer

---

## Key Features

### Authentication

- JWT-based sessions
- Secure password hashing (bcrypt)
- Role-based middleware

### Role-Aware Routing

- Student workflow
- Teacher scaffold
- Authorization middleware enforcement

### Relational Data Modeling

- Users
- Roles
- Courses
- Enrollments
- Assignments
- Submissions

### Service-Layer Abstraction

- No direct fetch calls inside UI components
- Dedicated API client and service modules

---

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Custom hooks
- Service abstraction layer

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite (dev-ready)
- JWT
- bcrypt

Database-ready for PostgreSQL migration.

---

## Running Locally

### Backend

```bash
cd server
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Runs at:

```
http://localhost:3000
```

---

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs at:

```
http://localhost:5173
```

---

## Future Roadmap

- Grade mutation interface  
- Course creation workflow  
- Teacher analytics dashboard  
- PostgreSQL production migration  
- Test suite integration  

---

## Status

Architecturally complete.  
Feature expansion intentionally scaffolded.  

Portfolio-ready.
# LMS-Software-Demo
lms-software-demo
