# RefilCare 💊

RefilCare is a backend-first **Medical Refill Reminder SaaS** built using **Next.js (App Router)**, **MongoDB**, and **NextAuth**.  
The goal of this project is to design a clean, production-ready foundation for managing patients, medicines, and refill schedules in a multi-tenant setup.

---

## 🧠 Project Overview

RefilCare is designed around a **tenant-based architecture**, where each **Pharmacy** acts as an isolated tenant managing its own patients and medicines.

The project focuses on:
- Correct data modeling
- Reliable refill logic
- Secure authentication
- Predictable API behavior

Frontend work will be layered on top after validating the backend and auth flow.

---

## 🧩 Core Features (Implemented)

### 🔐 Authentication
- NextAuth (App Router)
- Credentials-based authentication
- Google OAuth
- JWT-based sessions
- Proper tenant isolation using `pharmacyId`

---

### 🗄️ Data Models
- **Pharmacy** – Tenant & authentication owner  
- **Patient** – Belongs to a pharmacy  
- **Medicine** – Core model with refill logic  
- **RefillLog** – Designed for tracking refill events (wiring next)

---

### ⚙️ Backend APIs
- Create Patient
- Create Medicine (refill date calculated on backend)
- Dashboard APIs:
  - Today’s refills
  - Upcoming refills
  - Missed refills

---

### 🛠️ Technical Details
- MongoDB connection with proper reuse in development
- Fixed Mongoose serialization issues using `.toObject()`
- Correct MongoDB collection naming
- Date-only comparisons to avoid timezone-related bugs
- All APIs and auth flows tested using **Postman**

---

## 🧪 Testing
- APIs tested manually using Postman
- Authentication flows verified for:
  - Credentials login
  - Google OAuth
  - JWT session persistence

---

## 🚧 Work in Progress
- Protecting APIs using session-based authentication
- Wiring `RefillLog` for refill and missed refill events
- Frontend integration

---

## 🧰 Tech Stack
- Next.js (App Router)
- MongoDB & Mongoose
- NextAuth (Auth.js)
- JWT
- TypeScript

---

## 📌 Notes
This project is intentionally built step by step, validating each layer before moving forward, to ensure a clean and production-ready architecture.

More updates will be added as the project evolves.
