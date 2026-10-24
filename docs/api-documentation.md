# HaritAyan REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. Health & Telemetry

### `GET /api/health`
Returns the operational health of the backend API and database connectivity.
- **Response `200 OK`**:
```json
{
  "status": "online",
  "service": "HaritAyan Backend API",
  "version": "1.0.0",
  "database": {
    "configured": true
  },
  "timestamp": "2026-10-24T10:00:00Z"
}
```

---

## 2. APMC Mandi Market Prices Engine (`/api/mandi`)

### `GET /api/mandi/prices`
Fetches real-time commodity prices across Vadodara district market yards.
- **Query Parameters**:
  - `mandi` (string, optional): Filter by market yard (e.g., `Sayajiganj`, `Padra`, `Karjan`, `Dabhoi`, `Savli`).
  - `commodity` (string, optional): Filter by crop name (e.g., `Cotton`, `Castor`, `Pigeon Pea`, `Tomato`, `Okra`, `Wheat`).
  - `sortBy` (string, default: `modalPrice`): Sort field (`modalPrice`, `arrivals`, `change`, `name`).
  - `order` (string, default: `desc`): `asc` or `desc`.
  - `search` (string, optional): Keyword search matching English or Gujarati names.
- **Response `200 OK`**:
```json
{
  "success": true,
  "count": 6,
  "source": "mongodb-atlas",
  "data": [
    {
      "commodity": "Cotton",
      "commodityGu": "કપાસ",
      "variety": "Shankar-6 (BT Medium Staple)",
      "mandi": "Karjan APMC",
      "mandiGu": "કરજણ APMC (સફેદ સોનું કેન્દ્ર)",
      "modalPrice": 7580,
      "minPrice": 7250,
      "maxPrice": 7820,
      "arrivalsQuintals": 1680,
      "unit": "₹/Quintal",
      "priceChange24h": 90,
      "priceChangePercent": 1.2,
      "trend": "up"
    }
  ]
}
```

### `GET /api/mandi/summary`
Returns aggregated market analytics, total district arrivals, top gainers, sentiment meter, and cross-mandi price arbitrage spread.

### `GET /api/mandi/directory`
Returns operational addresses, auction timings, and superintendent contact numbers for all 5 district APMC yards.

### `POST /api/mandi/sync`
Triggers real-time simulated auction updates and writes new records to MongoDB Atlas.

---

## 3. Multimodal Crop Vision Scanner (`/api/scan`)

### `POST /api/scan/upload`
Uploads a plant leaf photo (multipart/form-data) for clinical AI disease diagnosis.
- **Form Data**:
  - `image`: Binary image file (JPEG, PNG, WEBP).
  - `cropType` (string, optional): Expected crop category.
  - `notes` (string, optional): Farmer observation notes.
- **Response `200 OK`**:
```json
{
  "success": true,
  "diagnosis": {
    "isPlant": true,
    "cropName": "Cotton",
    "cropNameGu": "કપાસ",
    "condition": "Cotton Leaf Curl Virus (CLCuV)",
    "conditionGu": "કપાસનો કુકડવાહ વાયરસ",
    "pathogenType": "Viral",
    "severity": "Moderate",
    "confidenceScore": 94,
    "biologicalProtocol": [ ... ],
    "chemicalProtocol": [ ... ]
  }
}
```

---

## 4. Multi-User Authentication (`/api/auth`)

### `POST /api/auth/login`
Authenticates a farmer or agricultural officer.
- **Body**: `{ "email": "...", "password": "..." }`
- **Response `200 OK`**: Returns user profile payload and signed JWT token.

### `POST /api/auth/register`
Registers a new farmer profile (Name, Phone, Taluka, Village, Acreage, Primary Crops).
