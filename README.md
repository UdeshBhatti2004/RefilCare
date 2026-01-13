# RefilCare 💊

RefilCare is a backend-first **Medical Refill Reminder SaaS** built using **Next.js (App Router)**, **MongoDB**, and **NextAuth**.  
The goal of this project is to build a clean, production-ready foundation for managing patients, medicines, and refill schedules in a secure multi-tenant environment.

---

## 🧠 Project Overview

RefilCare follows a **tenant-based architecture**, where each **Pharmacy** acts as an isolated tenant managing its own patients and medicines.

The project prioritizes correctness and clarity:
- Reliable data modeling
- Backend-driven refill calculations
- Predictable APIs
- Clean and understandable UI

---

## 🧩 Core Features (Implemented)

### 🔐 Authentication
- NextAuth (App Router)
- Credentials-based authentication
- Google OAuth
- JWT-based sessions
- Tenant isolation using `pharmacyId`

---

### 🗄️ Data Models
- **Pharmacy** – Authentication owner & tenant
- **Patient** – Linked to a pharmacy
- **Medicine** – Core model with backend refill logic
- **RefillLog** – Schema created (logic pending)

---

### ⚙️ Backend APIs
- Create Patient
- Create Medicine  
  - Refill date calculated strictly on the backend
- Dashboard APIs:
  - Today’s refills
  - Upcoming refills
  - Missed refills

---

### 🎨 Frontend UI (Current)
- **Create Medicine Page**
  - Patient selection
  - Condition-based inputs
  - Dosage & tablet entry
  - Refill duration preview
  - Fully responsive layout

- **List Medicines Page**
  - Displays medicines per pharmacy
  - Clean, dashboard-aligned design

---

## 🧪 Testing
- Manual API testing using Postman
- Authentication flows verified
- Backend logic validated before UI integration

---

## 🚧 Work in Progress
- Medicine details page
- Medicine status handling
- Refill tracking using `RefillLog`
- Route protection
- Dashboard enhancements

---

## 🧰 Tech Stack
- Next.js (App Router)
- MongoDB & Mongoose
- NextAuth (Auth.js)
- JWT
- TypeScript

---

## 📌 Notes
RefilCare is built incrementally, validating each layer before moving forward to ensure a maintainable and production-ready architecture.
