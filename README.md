# 🩺 MedPlus Frontend — Specialist Booking & Clinical Care Portal

- **Frontend Repository:** [https://github.com/anas-byte-dev/MedPlus-Frontend](https://github.com/anas-byte-dev/MedPlus-Frontend)
- **Backend Repository:** [https://github.com/anas-byte-dev/MedPlus-Backend](https://github.com/anas-byte-dev/MedPlus-Backend)

Welcome to the frontend of **MedPlus Appointments**! I built this client using **React 19**, **Vite**, and clean **Vanilla CSS** to deliver a fast, responsive, and distraction-free healthcare portal. It serves patients looking for doctors across Muzaffarpur, Patna, and Delhi NCR, while giving physicians, hospital managers, and administrators dedicated dashboards to run their daily clinical operations.

---

## 💡 Why I Built It This Way

When designing healthcare apps, UI isn't just about looking fancy—it directly affects real people trying to book a specialist in a hurry, or doctors managing a crowded morning OPD queue. 

Here were my main design decisions:
- **No heavy UI component libraries**: Instead of bloated Bootstrap or Tailwind bundles, I created a custom CSS design system (`index.css` & `App.css`) with clean CSS variables (`--bg-main`, `--text-primary`, `--primary-blue`, `--emerald-green`). This keeps the bundle feather-light and lightning fast.
- **Human-Crafted Clinical Theme**: Soft slate backgrounds (`#f8fafc`), crisp white cards (`#ffffff`), deep navy headings (`#0f2942`), and clinical accents. It feels trustworthy, professional, and accessible to non-tech-savvy patients.
- **A4 PDF Pass Generation On The Fly**: Using `jspdf`, patients and doctors can instantly generate and download official appointment confirmation passes with hospital letterheads, OPD timings, doctor credentials, and a verification seal—without waiting for a server-side PDF renderer.
- **Dynamic Role-Based Views**: Based on the authenticated role (`ROLE_PATIENT`, `ROLE_DOCTOR`, `ROLE_HOSPITAL`, `ROLE_ADMIN`), the navigation seamlessly adjusts to show only the relevant tools and hides complex controls from patients.

---

## 📱 Pages & Features Overview

### 1. 🏥 Specialist Doctor Directory (`DoctorAppointments.jsx`)
- **Doctor Catalog**: Browse 41+ verified doctors across major regional hospitals (AIIMS Patna, Prasad Hospital, Medanta, etc.).
- **Live Search & Multi-Filters**: Filter instantly by city, specialty (Cardiology, Neurology, Pediatrics, Orthopedics, etc.), hospital, and consultation fee range.
- **1-Click Booking Modal**: Select available appointment dates and morning/evening slots (`10:00 AM - 1:00 PM`, `5:00 PM - 8:00 PM`).
- **Instant Confetti Feedback**: Integrated `canvas-confetti` upon successful booking confirmation.

### 2. 👤 Patient Portal (`PatientPanel.jsx`)
- **My Consultations**: Real-time list of all past and upcoming consultations.
- **Pass Downloader**: Instant download of official consultation passes in PDF format.
- **Direct Access to AI Copilot**: Patients can consult Dr. MedPlus for symptom guidance before their appointment.

### 3. 👨‍⚕️ Doctor OPD Panel (`DoctorPanel.jsx`)
- **Assigned Hospital & Specialization Banner**: Displays the active doctor's clinical profile.
- **Live OPD Patient Queue**: Real-time list of scheduled appointments for the doctor.
- **Consultation Lifecycle Controls**: 1-click status updates (`CONFIRMED` ➔ `COMPLETED` or `CANCELLED`).
- **Prescription & Slip Printing**: Print individual patient appointment slips.

### 4. 🏢 Hospital Operations Panel (`HospitalPanel.jsx`)
- **Facility Doctors Directory**: Roster management for attending physicians.
- **Doctor Onboarding**: Register new specialists directly into the database with OPD schedule, fees, and qualifications.
- **Facility-Wide Appointment Roster**: Monitor daily footfall and OPD traffic.
- **Ward & Bed Tracker**: Visual capacity indicators for ICU, General, and Emergency wards.

### 5. 🛡️ Super Admin Control Center (`AdminPanel.jsx`)
- **Central System Overview**: Real-time metrics across all doctors, departments, and booked visits.
- **DBMS User Registry Table**: Live table querying stored user accounts directly from the database.
- **Google Gemini AI Configuration**: Interactive widget to view, copy, test, and live-switch the active Gemini model (`gemini-2.5-flash` / `gemini-3.8-flash`) and API keys.
- **Developer Quick Links**: Direct navigation to Swagger UI (`/swagger-ui.html`) and H2 Database Console (`/h2-console`).

### 6. 🤖 Dr. MedPlus AI Assistant (`AiHealthAssistant.jsx`)
- **Conversational Health Copilot**: Natural, empathetic symptom advisor powered by Google Gemini.
- **Smart Triage & Specialist Referral**: Recommends appropriate medical departments based on user complaints.
- **Home Care & Safety Disclaimers**: Clear guidance with mandatory medical safety reminders.

---

## 🛠️ Tech Stack & Key Libraries

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-driven frontend architecture |
| **Vite 8** | Blazing-fast build tool and local dev server |
| **Vanilla CSS** | Custom design tokens, glassmorphism, flex/grid layouts |
| **Axios** | HTTP client configured with automated JWT interceptors |
| **Supabase JS** | Authentication session recovery and database real-time sync |
| **jsPDF** | Client-side vector PDF generation for appointment passes |
| **Lucide React** | Clean, modern medical and UI icon set |
| **Canvas Confetti** | Interactive visual celebration upon booking |

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm** (v9.0 or higher)

### 1. Navigate to the frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the `frontend` root:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```
*(If running purely against the local Spring Boot backend, `VITE_API_BASE_URL` is all that's required).*

### 4. Start the Vite development server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:5173
```

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📂 Project Structure

```
frontend/
├── index.html              # HTML5 entry with clinical meta tags and Google fonts
├── vite.config.js          # Vite configuration
├── package.json            # Scripts and dependencies
├── src/
│   ├── main.jsx            # Application root mounting
│   ├── App.jsx             # Main layout, tab switcher, role routing
│   ├── api.js              # Axios instance + JWT Authorization header interceptor
│   ├── index.css           # Global typography, color tokens, and responsive utilities
│   ├── App.css             # Page-level containers and grid layouts
│   ├── context/
│   │   ├── AuthContext.jsx # Global auth state, session restore, role helpers
│   │   └── ThemeContext.jsx# Clinical theme provider
│   ├── lib/
│   │   └── supabaseClient.js # Supabase client initialization
│   ├── pages/
│   │   ├── DoctorAppointments.jsx # Doctor catalog & booking modal
│   │   ├── PatientPanel.jsx       # Patient consultations & PDF downloads
│   │   ├── DoctorPanel.jsx        # Doctor OPD queue & status toggles
│   │   ├── HospitalPanel.jsx      # Hospital roster & bed capacity
│   │   ├── AdminPanel.jsx         # User table & AI key settings
│   │   ├── AiHealthAssistant.jsx  # Dr. MedPlus Gemini chat copilot
│   │   ├── TriagePipeline.jsx     # Emergency NEWS2/ESI triage view
│   │   └── Login.jsx              # Auth modal (Login & Register tabs)
│   ├── components/
│   │   ├── Navbar.jsx             # Responsive top navbar with mobile drawer
│   │   ├── Footer.jsx             # Footer with hospital network details
│   │   └── DoctorCard.jsx         # Specialist card component
│   └── utils/
│       └── pdfGenerator.js        # jsPDF consultation pass template builder
```

---

## 🔒 Authentication & API Communication Flow

1. When a user logs in, the JWT token received from the backend is stored in `localStorage` under `medpulse_token`.
2. `src/api.js` automatically attaches this token to every HTTP request in the standard header:
   ```
   Authorization: Bearer <token>
   ```
3. If the backend responds with a `401 Unauthorized` (e.g. token expired), the Axios response interceptor immediately cleans up local storage and resets the state so the user can re-authenticate cleanly.

---

## 👨‍💻 Author

**Anas Siddiqui**  
*Java Full Stack & AI Healthcare Developer*
