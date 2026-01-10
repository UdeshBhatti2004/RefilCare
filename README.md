# RefilCare 💊

RefilCare is a backend-first **Medical Refill Reminder SaaS** built using **Next.js (App Router)**, **MongoDB**, and **NextAuth**.  
The goal of this project is to build a clean, production-ready foundation for managing patients, medicines, and refill schedules in a secure multi-tenant environment.

---

## 🧠 Project Overview

RefilCare follows a **tenant-based architecture**, where each **Pharmacy** acts as an isolated tenant managing its own patients and medicines.

The project intentionally focuses on backend correctness first:
- Proper data modeling
- Reliable refill date calculation
- Secure authentication & authorization
- Predictable and testable APIs

Frontend features are layered **only after validating backend logic and auth flow**.

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
- **Medicine** – Core model with refill logic
- **RefillLog** – Designed for tracking refill/missed events (pending wiring)

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

### 🛠️ Technical Details
- MongoDB connection reuse for development stability
- Fixed Mongoose serialization issues using `.toObject()`
- Correct MongoDB collection naming
- Date-only comparisons to avoid timezone bugs
- APIs and auth flows tested using **Postman**

---

## 🧪 Testing
- Manual API testing with Postman
- Authentication flows verified:
  - Credentials login
  - Google OAuth
  - JWT session persistence

---

## 🚧 Work in Progress
- Session-based API protection
- Wiring `RefillLog` for refill and missed refill tracking
- Frontend API integration

---

## 🧰 Tech Stack
- Next.js (App Router)
- MongoDB & Mongoose
- NextAuth (Auth.js)
- JWT
- TypeScript

---

## 📌 Notes
This project is built incrementally, validating each layer before moving forward to ensure a secure, maintainable, and production-ready architecture.

More updates will be added as the project evolves.
