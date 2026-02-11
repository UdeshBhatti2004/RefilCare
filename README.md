# RefilCare 💊

RefilCare is a backend-authoritative **Pharmacy-Managed Refill Reminder System** built with **Next.js (App Router)**, **MongoDB**, and **NextAuth**.

It is not a patient reminder app.

RefilCare is a compliance-focused refill lifecycle engine where:

- 🏥 The pharmacy controls everything  
- 👤 Patients remain passive (no login required)  
- 🤖 Automation drives reminders  
- 🔐 Data is tenant-isolated and audit-safe  

---

## 🌐 Live Demo

🔗 **Live App:**  
https://refil-care.vercel.app/

🔗 **GitHub Repository:**  
https://github.com/UdeshBhatti2004/RefilCare

---

# 🧠 System Philosophy

RefilCare is designed around:

- Backend-authoritative logic  
- Cron-driven lifecycle automation  
- Healthcare-appropriate messaging  
- Immutable refill logging  
- Multi-tenant data isolation  
- Minimal UI, maximum system reliability  

This is a lifecycle system — not just CRUD.

---

# ⚙️ Core Features

## 🔐 Authentication

- NextAuth (App Router)
- Credentials login
- Google OAuth
- JWT sessions
- Tenant isolation via `pharmacyId`

---

## 👥 Multi-Tenant Architecture

Each Pharmacy acts as an isolated tenant:

Pharmacy → Patients → Medicines → Refill Logs → Notifications


All queries are scoped by `pharmacyId`.

---

## 💊 Medicine Lifecycle (Fully Automated)

RefilCare manages refill status automatically:

| Timeline | System Action |
|----------|---------------|
| T - 2 days | Upcoming Reminder |
| T (Refill Day) | Today Reminder |
| T + 1 | Mark as Missed |

All refill dates are calculated strictly on the backend.

---

## 🤖 Telegram Bot Integration

- Deep link activation (`/start <patientId>`)
- Secure patient linking via `telegramChatId`
- Webhook-based production deployment
- Healthcare-friendly reminder tone
- No patient dashboard required

---

## ⏰ Cron Automation (Vercel)

Three automated cron jobs:

- Upcoming Refill Cron
- Today Refill Cron
- Missed Refill Cron

Features:

- Duplicate prevention
- UTC normalization
- Status transitions
- Notification creation
- Production-safe webhook validation

---

## 🔔 Notification System

- Backend-created notifications
- Unread prioritization
- Mark single as read
- Mark all as read
- Audit-safe retention
- Proper ordering:
.sort({ isRead: 1, createdAt: -1 })


---

## 📊 Dashboard

- Today count
- Upcoming count
- Missed count
- Recent refill activity
- Fully responsive layout
- No manual cron control

---

## 🧾 Data Models

### Pharmacy
Authentication owner & tenant

### Patient
{
pharmacyId,
name,
phone,
telegramChatId?
}


### Medicine
{
pharmacyId,
patientId,
medicineName,
condition,
dosagePerDay,
tabletsGiven,
startDate,
refillDate,
status,
lastReminderSentAt,
lastUpcomingReminderSentAt,
deleted,
deletedAt
}


### RefillLog (Immutable)
Audit-safe refill history

### Notification
{
pharmacyId,
patientId?,
medicineId?,
title,
message,
type,
isRead,
createdAt
}


---

# 🧰 Tech Stack

- Next.js (App Router)
- TypeScript
- MongoDB Atlas
- Mongoose
- NextAuth
- JWT
- Redux Toolkit
- Tailwind CSS
- Lucide React
- Vercel (Deployment + Cron)
- Telegram Bot API

---

# 🧪 Engineering Challenges Solved

- UTC vs IST mismatch
- Off-by-one refill detection
- Cron idempotency
- Duplicate reminder prevention
- Webhook production migration (ngrok → Vercel)
- OAuth redirect configuration
- Notification unread ordering bug
- Multi-tenant query symmetry

---

# 🚀 Production Status

RefilCare is:

- ✅ Fully deployed
- ✅ Cron-stable
- ✅ Webhook-enabled
- ✅ Multi-tenant ready
- ✅ Backend authoritative
- ✅ Healthcare tone compliant

---

# 👨‍💻 Author

Built and maintained by:

**Udesh Bhatti**

---

# 📄 License

This project is for learning, experimentation, and demonstration purposes.