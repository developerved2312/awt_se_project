# HaritAyan Architecture Dossier

## 1. System Overview
**HaritAyan** (હરિત અયન) is an AI-powered agricultural intelligence, APMC mandi commodity pricing, and urban heat mitigation platform specifically engineered for **Vadodara District, Gujarat, India**.

The platform is designed around a **Hybrid Edge-Cloud Architecture**:
- **Presentation Tier:** React (SPA) with Vanilla CSS design tokens, dynamic bilingual English/Gujarati localization, and offline PWA capability.
- **Application & API Gateway Tier:** Node.js Express REST API Grid providing robust routing, JWT authentication, and MongoDB Atlas integration.
- **AI & Computer Vision Intelligence Tier:** 
  - *Tier 1 (Edge / Offline):* TensorFlow Lite / on-device lightweight convolutional classifiers for instant foliar segmentation without internet.
  - *Tier 2 (Cloud Multimodal):* Google Gemini 3.8 Flash Vision for comprehensive clinical disease diagnosis and dual-protocol remediation (Bio-organic + precision ICAR chemicals).
- **Data Persistence Tier:** MongoDB Atlas (`haritayan_db`) with automatic client-side cache failover ensuring 100% platform availability.

```
+-------------------------------------------------------------------------+
|                  HaritAyan Client Layer (React / Vite)                  |
|  - Plant Disease Scanner (Foliar Diagnostics)                           |
|  - APMC Mandi Market Prices Engine (Sayajiganj, Padra, Karjan, etc.)    |
|  - Urban Heat & Tree Canopy Simulator (Vadodara Heat Zones)             |
|  - Agronomist & Officer Desk (Farmer Consultation & Prescriptions)      |
+------------------------------------+------------------------------------+
                                     |  REST API (JSON)
                                     v
+-------------------------------------------------------------------------+
|                  API Gateway & Web Core (Node.js Express)               |
|  - /api/scan       - /api/mandi       - /api/auth       - /api/queries  |
+-------------------+---------------------------------+-------------------+
                    |                                 |
                    v                                 v
+-----------------------------+     +-------------------------------------+
|   MongoDB Atlas Database    |     |     AI & Pathology Pipeline         |
|   (haritayan_db Cluster)    |     |  - Gemini 3.8 Flash Multimodal      |
|  - Users    - MandiPrices   |     |  - TensorFlow Foliar Classifiers    |
|  - Scans    - Queries       |     |  - AAU / ICAR Advisory Logic        |
+-----------------------------+     +-------------------------------------+
```

## 2. Directory Design & Domain Separation
```
HaritAyan/
├── frontend/          # Client application (Pages, Components, Modules)
├── backend/           # API Services, Controllers, Mongoose Models
├── ai/                # Pure AI research, TensorFlow models & Gemini prompts
├── data/              # Raw & processed agricultural datasets
├── scripts/           # Standalone ingestion & data seeding pipelines
└── docs/              # System specifications and API documentation
```

## 3. High-Availability Failover Guarantee
The application implements an **Automated Graceful Failover**:
- If the MongoDB Atlas cluster or network experiences connectivity disruption, the API gateway falls back to curated baseline datasets seamlessly.
- The user interface displays a non-blocking status indicator (`Live Atlas` vs. `Market Baseline Sync`), guaranteeing that farmers and extension officers never face blank screens or crashed workflows.
