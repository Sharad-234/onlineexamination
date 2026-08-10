# Online Examination Registration System

A full-stack web application that allows applicants to register for examinations online. Applicants provide personal and academic information, upload documents, make payments, and download a PDF copy of their submitted application.

> **Note:** This is NOT an online examination/quiz system. It is a registration/application system only.

---

## Architecture Overview

```
React Frontend (Vite)
       ↓  Axios (FormData)
Express.js API
       ↓  Business Logic + Validation
MongoDB (Mongoose ODM)
       ↓
PDF Service (PDFKit)
       ↓
File Storage (Disk)
```

---

## Project Structure

```
online-exam-registration/
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js       # Centralized Axios client
│   │   ├── components/
│   │   │   ├── FileUpload.jsx  # Reusable file upload component
│   │   │   └── Navbar.jsx      # Top navigation bar
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── Success.jsx         # Post-submission success page
│   │   │   └── ApplicationDetails.jsx  # View application details
│   │   ├── App.jsx             # Route definitions
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── backend/                 # Node.js + Express
    ├── src/
    │   ├── config/
    │   │   └── database.js           # MongoDB connection
    │   ├── controllers/
    │   │   ├── applicationController.js  # Application endpoints
    │   │   ├── examController.js          # Exam endpoints
    │   │   └── paymentController.js       # Payment endpoints
    │   ├── models/
    │   │   ├── Application.js         # Application Mongoose model
    │   │   └── Exam.js                # Exam Mongoose model
    │   ├── routes/
    │   │   ├── applicationRoutes.js   # /api/applications
    │   │   ├── examRoutes.js          # /api/exams
    │   │   └── paymentRoutes.js       # /api/payments
    │   ├── middleware/
    │   │   ├── uploadMiddleware.js    # Multer file upload config
    │   │   ├── validationMiddleware.js # express-validator rules
    │   │   └── errorMiddleware.js     # Global error handler
    │   ├── services/
    │   │   ├── pdfService.js          # PDFKit PDF generation
    │   │   └── applicationService.js  # Application business logic
    │   ├── utils/
    │   │   └── generateApplicationId.js  # EXAM-YYYY-NNNNNN
    │   ├── server.js              # Express entry point
    │   └── seed.js                # Database seeder
    ├── uploads/
    │   ├── photos/
    │   ├── payment-proofs/
    │   └── pdfs/
    ├── .env
    └── package.json
```

---

## Prerequisites

- **Node.js** v16 or later
- **MongoDB** running locally (or a MongoDB Atlas connection string)
- **npm** (comes with Node.js)

---

## Setup Instructions

### 1. Clone the repository

```bash
cd online-exam-registration
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Configure environment variables

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/exam-registration
CLIENT_URL=http://localhost:5173
```

### 4. Seed the database

```bash
npm run seed
```

This creates sample examinations (BSc CSIT, BIT, BIM, BBA, MSc CSIT).

### 5. Start the backend

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 6. Frontend Setup (in a new terminal)

```bash
cd frontend
npm install
```

### 7. Start the frontend

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## Complete Application Flow

```
Applicant visits /register
    ↓
Fills personal information (name, email, phone)
    ↓
Uploads photo (JPG/JPEG/PNG, max 2MB)
    ↓
Selects course and enters college
    ↓
Selects examination (fetched from API)
    ↓
Sees exam fee (e.g., NPR 1,000)
    ↓
Selects payment method (eSewa, Khalti, Bank Transfer, Cash)
    ↓
Enters transaction ID
    ↓
Uploads payment proof (JPG/JPEG/PNG/PDF, max 5MB)
    ↓
Clicks Submit
    ↓
Frontend validates all fields client-side
    ↓
Sends multipart/form-data via Axios POST /api/applications
    ↓
Backend validates fields (express-validator)
    ↓
Backend validates file types and sizes (Multer)
    ↓
Backend verifies exam exists and is active
    ↓
Generates unique Application ID (EXAM-2026-000001)
    ↓
Saves files to disk (uploads/photos/, uploads/payment-proofs/)
    ↓
Saves application to MongoDB (paymentStatus: "pending")
    ↓
Generates PDF application copy (PDFKit)
    ↓
Returns JSON: { applicationId, status, paymentStatus }
    ↓
Frontend redirects to /success/:applicationId
    ↓
Applicant sees Application ID and Payment Status: Pending
    ↓
Applicant clicks "Download Application PDF"
    ↓
Browser downloads EXAM-2026-000001.pdf
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/exams` | List all active examinations |
| GET | `/api/health` | Server health check |
| POST | `/api/applications` | Submit a new application (multipart/form-data) |
| GET | `/api/applications/:applicationId` | Get application details |
| GET | `/api/applications/:applicationId/pdf` | Download application PDF |
| POST | `/api/payments` | Record/update payment info |

---

## Key Design Decisions

- **Payment status is always "Pending"** — entering a transaction ID does NOT mean payment is verified. Admin verification is required.
- **Application ID format:** `EXAM-YYYY-NNNNNN` (e.g., EXAM-2026-000001), auto-incremented per year.
- **Files are stored on disk** with UUID names to prevent collisions.
- **Exams come from the database**, not hardcoded, so they can be managed dynamically.
- **Architecture is admin-ready** — the model and service layer support future admin features (verify payment, approve/reject applications, search, export).

---

## Future Extensibility

The system is structured so the following can be added without redesign:

- Admin login (JWT authentication)
- Admin dashboard to view/search/filter applications
- Payment verification (change paymentStatus from "pending" to "verified")
- Application approval/rejection
- Payment gateway integration (eSewa, Khalti)
- Email notifications
- Application status tracking
