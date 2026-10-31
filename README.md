# Advanced Web Technologies and Software Engineering Project

# HaritAyan (हरित અયન)
> **AI-Powered Smart Agriculture, Urban Heat Mitigation & Plant Intelligence Platform**  
> *Developed for Vadodara District, Gujarat, India*

[![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff?style=flat&logo=vite)](https://vitejs.dev/)
[![Styling](https://img.shields.io/badge/CSS-Vanilla%20CSS-2d6a4f?style=flat)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%20Vision-4285f4?style=flat&logo=google)](https://ai.google.dev/)
[![Language](https://img.shields.io/badge/Language-English%20%7C%20%E0%AA%97%E0%AA%81%E0%AA%9C%E0%AA%B0%E0%AA%BE%E0%AA%A4%E0%AA%BF-c47335?style=flat)]()

---

## 📖 Overview

**HaritAyan** is an AI-powered smart agriculture and plant management platform developed to assist farmers, gardeners, researchers, and urban planners in monitoring plant health, predicting microclimatic changes, and improving crop productivity. The system integrates computer vision, machine learning, and environmental data analysis to identify plant species, detect crop diseases, analyze thermal microclimates, and provide actionable bilingual recommendations.

By allowing users to upload leaf photos, HaritAyan recognizes visible disease symptoms (e.g., fungal spots, viral curls, bacterial blights) and recommends scientifically validated and organic remedies. Concurrently, the platform models urban heat islands (UHI) across Vadodara municipal wards and tracks real-time agricultural commodity prices from APMC markets across Vadodara District in both English and Gujarati.

---

## 🌿 Why "Harit Ayan"?

**Harit Ayan** is derived from two Sanskrit-rooted words:

- **Harit (हरित)** represents green, greenery, vegetation, biological vitality, and environmental sustainability.
- **Ayan (अयन)** represents an intentional path, journey, or purposeful movement towards a destination.

Together, **Harit Ayan** represents a **"Journey Towards a Greener Future."**

Rather than treating agricultural disease, urban heat, and market realization as isolated issues, HaritAyan establishes a closed-loop digital pathway:
$$\text{Understand Conditions} \longrightarrow \text{Take Informed Action} \longrightarrow \text{Measure Impact} \longrightarrow \text{Improve Decisions}$$

---

## 🧩 Core Modules

| Module | Scope & Functionality | Local Context & Target |
|---|---|---|
| **Dual-Engine Plant Disease Scanner** | Computer vision foliar diagnostic engine running in-browser offline TensorFlow.js MobileNetV2 with Google Gemini 1.5 Pro multimodal cloud failover for staple Gujarat crops (Cotton, Castor, Pigeon Pea, Tomato, Okra) with organic and chemical remedies in English and Gujarati. | Farmers, agronomists, home gardeners |
| **Urban Heat Mitigation Map & 3D Tree Canopy Simulator** | Interactive thermal grid tracking surface temperatures across Vadodara municipal wards (Alkapuri, Makarpura, Sayaji Baug, Manjalpur, etc.) with 2D polygon overlays and interactive 3D canopy cooling simulation. | Urban planners, municipal authorities, environmental researchers |
| **Real-Time APMC Mandi Engine** | Live commodity price ticker tracking arrivals, min/max bands, modal rates, and 24h price trends across 5 Vadodara district market yards (Sayajigunj, Padra, Karjan, Dabhoi, Savli). | Farmers, wholesale traders, agricultural cooperatives |
| **Smart Irrigation Timer & Power Roster** | Precision root-zone moisture balancing calculating exact water volumes (liters) and pump runtimes based on crop, soil type, and MGVCL 8-hour 3-phase agricultural power roster with live audio chimes. | Farmers, irrigation managers |
| **Agro-Weather Observatory & IMD Alerts** | Live microclimate dashboard with 7-day hourly forecasts, heatwave vulnerability indices, and emergency broadcast alerts from IMD Ahmedabad. | Agricultural officers, farmers |
| **Krishi Tools & Equipment Marketplace** | Shared farm machinery rental portal with automatic Gujarat state i-Khedut 40-60% subsidy calculations across 7 Vadodara taluka Custom Hiring Centers (CHCs). | Smallholder farmers, equipment owners |
| **District Admin Operations & Telemetry Hub** | Centralized console featuring real-time MongoDB Atlas shard latency ping, server memory telemetry, Dual-Engine AI token consumption ledger, mandi price overrides, and emergency advisory broadcast. | District operations administrators |
| **Multi-User Auth & Role-Based Desk Portal** | Secure JWT authentication with dedicated workspaces and query desks for Farmers, Agricultural Officers, and Administrators, with direct administrator registration on signup. | All platform stakeholders |
| **HaritAyan Sahayak Bilingual Chatbot** | Rule-based conversational assistant providing instant, offline-capable agronomic answers, Gujarati guidance, and one-click page navigation. | Field farmers, general citizens |

---

## 🎨 Design Philosophy & Theme

HaritAyan is styled exclusively using custom **Vanilla CSS** with a carefully crafted **Light Green & Dry Leaf Organic Theme** designed to evoke nature, soil, and vegetation:

- **Canvas & Surface:** Light warm botanical wash (`#fbf9f5` / `#ffffff`) with subtle organic background gradients.
- **Fresh Plant Greens:** Deep forest and emerald hues (`#1b4332`, `#2d6a4f`, `#40916c`) for headings, primary actions, and brand identity.
- **Dry Leaf & Earth Accents:** Warm amber ochre and dry-leaf tones (`#c47335`, `#9e5320`, `#faeee2`) for badges, counters, and highlights.
- **High-Contrast Accessibility:** Strict contrast discipline (mint `#d8f3dc` and crisp white on dark green, `#1a2a22` on light canvas) ensuring zero dark-on-dark text and effortless legibility in bright sunlight.
- **Bilingual Typography:** Curated font pairing using `Outfit` for geometric headings, `Plus Jakarta Sans` for clean body typography, and `Noto Sans Gujarati` for crisp Gujarati regional script rendering.

---

## 🏗️ System Architecture

```mermaid
flowchart TD

    A["🌱 HARITAYAN<br/><b>Smart Agriculture Platform</b>"]

    B["🖥️ FRONTEND<br/>React 18 + Vite 6<br/>Vanilla CSS • Lucide Icons<br/>TensorFlow.js Edge Engine"]

    C["⚙️ BACKEND API<br/>Node.js + Express.js<br/>RESTful Micro-Services<br/>JWT Auth & Middleware"]

    D["🤖 DUAL AI ENGINES<br/>Edge: TF.js MobileNetV2 (Offline)<br/>Cloud: Google Gemini 1.5 Pro Vision"]

    E["🌦️ EXTERNAL DATA SERVICES<br/>Open-Meteo & IMD Weather<br/>APMC Mandi Agricultural Feeds<br/>CartoDB / OpenStreetMap Tiles"]

    F["🔐 AUTH & DESK WORKSPACES<br/>Role-Based Access Control<br/>Farmer • Officer • Admin Desks<br/>i-Khedut Subsidy Calculator"]

    G["🍃 MONGODB ATLAS<br/>Users • Scans • Mandi Prices<br/>Queries • Equipment • Bookings<br/>Irrigation Logs • Weather Alerts"]

    A --> B
    B --> C

    B -. Offline Fallback .-> D
    C --> D
    C --> E
    C --> F

    D --> G
    E --> G
    F --> G
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18 (`react`, `react-dom`) | Declarative, component-driven UI architecture |
| **Build Tool & Bundler** | Vite 6 (`@vitejs/plugin-react`) | Lightning-fast HMR and optimized asset bundling |
| **Styling** | Vanilla CSS (`index.css`) | Custom design tokens, high-contrast palette, zero external CSS dependencies |
| **Iconography** | Lucide React (`lucide-react`) | Lightweight, accessible SVG icons |
| **Client-Side Edge AI** | TensorFlow.js (`@tensorflow/tfjs`) | In-browser offline plant pathology classification & hardware telemetry |
| **Cloud Multimodal AI** | Google Gemini 1.5 Pro API | High-resolution multimodal vision analysis & organic Gujarati remedies |
| **Internationalization** | Custom Bilingual Engine | Instant seamless English & Gujarati (`en` / `gu`) toggle |
| **Database** | MongoDB Atlas (M0 Mumbai Cluster) | Scalable NoSQL persistence for users, scans, mandis, and bookings |
| **Backend Runtime** | Node.js & Express.js | Modular REST API routing, Multer uploads, and telemetry |
| **Authentication** | JWT (`jsonwebtoken`) & `bcryptjs` | Secure stateless auth with role-based access control |

---

## 📂 Project Directory Structure

```text
HaritAyan/
├── .env.example                          # Root environment variables template
├── .gitignore                             # Git exclusions for dependencies and sensitive files
├── README.md                              # Project documentation and setup guide
├── directory_structure.txt                # Workspace file registry
├── package.json                           # Root scripts and workspace metadata
├── HaritAyan_Modules_Working_Architecture.pdf # Comprehensive technical module architecture PDF
│
├── frontend/                              # Client-side React 18 + Vite 6 web application
│   ├── .gitignore
│   ├── index.html                         # HTML5 root template with Google Fonts (Outfit, Plus Jakarta Sans, Noto Sans Gujarati)
│   ├── package.json                       # Frontend dependencies (React, Lucide, TensorFlow.js)
│   ├── vite.config.js                     # Vite build and dev configuration
│   │
│   ├── public/                            # Static visual and branding assets
│   │   ├── favicon.svg                    # Sprout brand emblem
│   │   └── images/                        # High-resolution regional images
│   │       ├── hero-banner.jpg            # Agricultural showcase banner
│   │       ├── leaf-scanner.jpg           # Diagnostic leaf sample illustration
│   │       └── vadodara-heatmap.jpg       # Vadodara thermal grid imagery
│   │
│   └── src/                               # Application source code
│       ├── main.jsx                       # React DOM entry point
│       ├── App.jsx                        # Top-level coordinator: routing, language, and user session
│       ├── index.css                      # Complete Light Green & Dry Leaf design system & tokens
│       │
│       ├── components/                    # Reusable modular UI components
│       │   ├── Navbar.jsx                 # Dynamic responsive header with role-adaptive desk & language toggle
│       │   ├── Footer.jsx                 # Institutional footer with regional hubs & navigation
│       │   ├── AlertCard.jsx              # Weather & microclimatic notification banner
│       │   ├── AuthModal.jsx              # 1-Click live demo personas & account registration modal
│       │   ├── Chatbot.jsx                # HaritAyan Sahayak bilingual agrarian assistant
│       │   ├── LanguageSelector.jsx       # English / Gujarati language toggle
│       │   ├── TensorFlowLabModal.jsx     # In-browser AI hardware benchmark & telemetry lab
│       │   ├── TreeCanopy3D.jsx           # Interactive 3D tree canopy cooling simulation widget
│       │   └── UrbanHeat2DMap.jsx         # Interactive 2D thermal polygon heat overlay map
│       │
│       ├── pages/                         # Core platform pages
│       │   ├── Home.jsx                   # Platform overview, mission, feature cards & regional FAQs
│       │   ├── PlantScanner.jsx           # Dual-Engine crop disease scanner with camera & remedy guide
│       │   ├── HeatMap.jsx                # Vadodara ward urban heat observatory & canopy cooling simulator
│       │   ├── MandiPrices.jsx            # Real-time APMC mandi commodity rates & price trends
│       │   ├── Weather.jsx                # Agro-weather observatory, 7-day forecast & IMD alerts
│       │   ├── IrrigationTimer.jsx        # Smart root-zone watering timer & MGVCL power roster
│       │   ├── Marketplace.jsx            # Krishi tools rental portal with i-Khedut subsidy calculator
│       │   ├── AdminPanel.jsx             # District Admin Operations & AI telemetry console
│       │   ├── LoginPage.jsx              # Dedicated login & role-based signup page (Farmer / Admin / Officer)
│       │   └── UserProfile.jsx            # User profile, query desk & agricultural officer response workspace
│       │
│       ├── services/                      # Client API & offline business logic services
│       │   ├── adminService.js            # Operations telemetry & emergency alert API client
│       │   ├── authService.js             # Session management, JWT storage, and demo persona switcher
│       │   ├── equipmentService.js        # Machinery catalog and rental booking API client
│       │   ├── mandiService.js            # APMC price fetcher with offline regional fallbacks
│       │   ├── queryService.js            # Farmer-officer query communication API client
│       │   ├── scanService.js             # Leaf diagnostic upload & history API client
│       │   ├── tfjsModelService.js        # Client-side offline TensorFlow.js inference & benchmark engine
│       │   └── translationService.js      # English & Gujarati translation dictionaries
│       │
│       └── utils/                         # Formatting & constants helpers
│           ├── constants.js               # Ward coordinates, crop lists, and default thresholds
│           └── formatters.js              # Currency, date, and unit formatters
│
└── backend/                               # Server-side REST API application (Node.js + Express)
    ├── .env                               # Local backend environment credentials
    ├── .env.example                       # Backend environment template
    ├── package.json                       # Backend dependencies (Express, Mongoose, Multer, JWT, etc.)
    │
    ├── public/                            # Static asset directory
    │   └── uploads/                       # Leaf diagnostic photo uploads & crop sample media
    │
    └── src/                               # Backend server source code
        ├── server.js                      # Express app initialization, middleware, routes, and MongoDB Atlas connection
        │
        ├── config/                        # Database & runtime configuration
        │   └── db.js                      # Mongoose connection to MongoDB Atlas with auto-retry
        │
        ├── controllers/                   # REST controller business logic
        │   ├── authController.js          # User registration (Farmer, Admin, Officer), login, and demo switcher
        │   ├── scanController.js          # Leaf image upload handler & Gemini AI multimodal diagnostics
        │   ├── mandiController.js         # APMC market rates query, caching, and trend calculation
        │   ├── queryController.js         # Farmer query creation & officer resolution workflow
        │   └── heatController.js          # Urban heat thermal calculations & canopy cooling simulation
        │
        ├── middleware/                    # HTTP interceptors & security
        │   ├── authMiddleware.js          # JWT token verification and role-based access gating
        │   └── uploadMiddleware.js        # Multer disk storage and file filter for image uploads
        │
        ├── models/                        # Mongoose NoSQL document schemas
        │   ├── User.js                    # User account (Farmer, Officer, Admin) with bcrypt hashing
        │   ├── Scan.js                    # Diagnostic scan records, symptoms, remedies, and confidence
        │   ├── MandiPrice.js              # APMC commodity prices, arrivals, and 24h market trends
        │   ├── Equipment.js               # Agricultural machinery specifications & daily rental rates
        │   ├── EquipmentBooking.js        # Equipment rental reservations with i-Khedut subsidy calculations
        │   ├── Query.js                   # Farmer questions and agricultural officer responses
        │   ├── IrrigationLog.js           # Water conservation sessions and pump runtime logs
        │   └── WeatherAlert.js            # IMD Vadodara weather advisories and emergency notices
        │
        ├── routes/                        # Express API route endpoints
        │   ├── authRoutes.js              # /api/auth (register, login, demo-login, me)
        │   ├── scanRoutes.js              # /api/scan (upload, diagnose, history)
        │   ├── mandiRoutes.js             # /api/mandi (market rates, trends, updates)
        │   ├── queryRoutes.js             # /api/queries (farmer queries, officer replies)
        │   ├── weatherRoutes.js           # /api/weather (real-time agro-weather & alerts)
        │   ├── heatRoutes.js              # /api/heat (ward temperatures, cooling simulator)
        │   ├── irrigationRoutes.js        # /api/irrigation (moisture calculations & logs)
        │   ├── equipmentRoutes.js         # /api/equipment (catalog, bookings, subsidy calculator)
        │   └── adminRoutes.js             # /api/admin (telemetry ping, AI ledger, alert dispatcher)
        │
        ├── services/                      # External service integrations
        │   └── geminiService.js           # Google Gemini 1.5 Pro multimodal vision prompt engineering
        │
        └── utils/                         # Seed data and cryptographic utilities
            ├── generateToken.js           # JWT token generation helper
            ├── mandiData.js               # Regional Vadodara APMC commodity dataset
            ├── seedData.js                # Database seeder for demo personas and sample queries
            ├── seedMandiData.js           # Database seeder for live mandi prices
            └── testAuth.js                # Authentication testing utility
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher) or yarn / pnpm
- A modern web browser (Chrome, Edge, Firefox, Safari)

### 1. Clone the Repository
```bash
git clone https://github.com/developerved2312/awt_se_project.git
cd awt_se_project
```

### 2. Configure Environment Variables
Copy `.env.example` to create your local environment file:
```bash
cp .env.example frontend/.env
```
Update `frontend/.env` with your API credentials (optional for UI exploration):
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
VITE_BACKEND_URL=http://localhost:5000/api
```

### 3. Install Dependencies
Navigate into the `frontend` directory and install the packages:
```bash
cd frontend
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

### 5. Build for Production
To create an optimized production build:
```bash
npm run build
```
The output will be generated inside `frontend/dist/`. To preview the production bundle locally:
```bash
npm run preview
```

---

## 🔑 API Keys & Environment Configuration Guide

HaritAyan is designed to run seamlessly out of the box with zero required API keys using built-in public endpoints and authentic regional fallbacks, while also supporting production API keys for enhanced real-time data:

| Service / Variable | Status | How to Obtain | Fallback if Omitted |
|---|---|---|---|
| **`VITE_MAPBOX_TOKEN`**<br/>*(Frontend Map Tiles)* | Optional | 1. Sign up at [account.mapbox.com](https://account.mapbox.com/) (Free 50,000 map loads/month).<br/>2. Copy your default public access token (`pk.eyJ...`).<br/>3. Add to `frontend/.env`: `VITE_MAPBOX_TOKEN="pk.eyJ..."` | Defaults automatically to high-resolution **CartoDB Voyager** raster tiles (`cartocdn.com`) with zero configuration or keys required. |
| **`OPENWEATHER_API_KEY`**<br/>*(Weather Overlays)* | Optional | 1. Sign up at [openweathermap.org/api](https://openweathermap.org/api) (Free tier 1,000 calls/day).<br/>2. Add to `backend/.env`: `OPENWEATHER_API_KEY="your_key"` | Real-time weather, ET₀, and rain probabilities automatically use the open **Open-Meteo API** (100% free, zero keys needed). |
| **`GEMINI_API_KEY`**<br/>*(AI Crop Vision Scanner)* | Optional | 1. Go to [Google AI Studio](https://aistudio.google.com/).<br/>2. Click **Create API Key**.<br/>3. Add to `backend/.env`: `GEMINI_API_KEY="AIzaSy..."` | Automatically falls back to HaritAyan's authentic botanical diagnostic rules engine with organic Gujarati remedies. |
| **`DATA_GOV_IN_API_KEY`**<br/>*(Live National Mandi Sync)* | Optional | 1. Register at [data.gov.in](https://data.gov.in/) (Open Government Data Platform India).<br/>2. Generate an API Key in the user dashboard.<br/>3. Add to `backend/.env`: `DATA_GOV_IN_API_KEY="579b..."` | Ships with authentic pre-ingested CSV/JSON benchmark rate records for all 5 Vadodara district market yards (`data/sample/mandi_rates.csv`). |
| **`MONGODB_URI`**<br/>*(Persistent Data Storage)* | **Configured** | See MongoDB Atlas setup below. Pre-configured in `backend/.env` for cloud persistence of users, scans, and mandi prices. | In-memory session cache. |

---

## ☁️ MongoDB Atlas Setup Guide

To integrate MongoDB Atlas for persistent storage of scan reports and mandi data:

1. **Create an Account:** Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Deploy Free Cluster:** Select **M0 Free Tier** and pick the **AWS / Mumbai (`ap-south-1`)** region for lowest latency in Gujarat.
3. **Database Access:** Create a database user with username and a secure password (e.g. `harit_user`).
4. **Network Access:** In **Network Access**, add an IP Access List entry:
   - For local development: click **"Add Current IP Address"** or use `0.0.0.0/0` (allow access from anywhere with credentials).
5. **Connection String:**
   - Click **Connect** → **Drivers** (Node.js).
   - Copy your connection string:
     ```text
     mongodb+srv://harit_user:<password>@cluster0.xxxxx.mongodb.net/haritayan_db?retryWrites=true&w=majority
     ```
6. **Set Environment Variable:** Place this URI in your backend `.env` file under `MONGODB_URI`.

---

## ❓ Frequently Asked Questions (General FAQs)

### Q1: What is HaritAyan and who is it designed for?
**A:** HaritAyan is an AI-powered smart agriculture and environmental intelligence platform specifically customized for Vadodara District. It is created for local farmers, commercial horticulturists, botanical researchers, and urban planners to monitor plant health, reduce crop loss, mitigate urban heat islands, and maximize harvest realization through live market rates.

### Q2: How does the Gemini AI Vision Scanner identify crop diseases?
**A:** Users submit or upload a close-up photo of an affected plant leaf or crop canopy. The multimodal Gemini Vision model analyzes foliar patterns, chlorophyll degradation, discoloration, and lesion morphology. It then outputs a diagnostic summary, confidence score, and both organic (bio-friendly) and chemical recommendations in English and Gujarati.

### Q3: How does the Urban Heat Island Mitigation Simulator calculate cooling in Vadodara?
**A:** The simulator correlates empirical satellite thermal surface readings with canopy coverage percentages across Vadodara wards (such as Makarpura, Alkapuri, and Sayaji Baug). It simulates the thermodynamic transpiration and shading benefits of planting native trees (such as Neem, Peepal, and Jamun), forecasting microclimatic cooling drops up to -3.4°C.

### Q4: Which APMC mandis are covered for live agricultural market rates?
**A:** HaritAyan monitors daily commodity arrivals, minimum-maximum price bands, and modal trading prices across 5 major APMCs in Vadodara District:
- **Sayajigunj APMC** (Central Vadodara)
- **Padra APMC** (Vegetable and cotton hub)
- **Karjan APMC** (Cotton and cash crop center)
- **Dabhoi APMC** (Pigeon pea and pulses market)
- **Savli APMC** (Grains and oilseeds trading)

### Q5: Is the application accessible in the Gujarati language?
**A:** Yes. HaritAyan is built with native bilingual capability. Every element — from navigation headers and weather warnings to disease diagnostics and commodity tickers — can be toggled instantly between English and Gujarati (ગુજરાતી) using the header language selector.

### Q6: Can this platform be extended to other districts or cities in Gujarat?
**A:** Absolutely. The modular architecture is designed to support geographic expansion by configuring new APMC mandi feeds, microclimate weather coordinates, and local crop varieties across other districts such as Anand, Bharuch, and Surat.

---

## 📜 Academic Project Notice & License

This project was developed as part of the **Advanced Web Technologies (AWT) & Software Engineering (SE)** coursework.

© 2026 HaritAyan. All rights reserved.
