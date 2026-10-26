import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import scanRoutes from './routes/scanRoutes.js';
import authRoutes from './routes/authRoutes.js';
import queryRoutes from './routes/queryRoutes.js';
import mandiRoutes from './routes/mandiRoutes.js';
import heatRoutes from './routes/heatRoutes.js';
import irrigationRoutes from './routes/irrigationRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables: check backend/.env first, then root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Core Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve static leaf images from /uploads
const uploadsPath = path.resolve(__dirname, '../public/uploads');
app.use('/uploads', express.static(uploadsPath));

// Health Check API Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'HaritAyan Backend API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: {
      configured: !!(
        process.env.MONGODB_URI &&
        !process.env.MONGODB_URI.includes('<username>') &&
        !process.env.MONGODB_URI.includes('<password>')
      ),
    },
    timestamp: new Date().toISOString(),
  });
});

// Root API Welcome Route
app.get('/api', (req, res) => {
  res.json({
    name: 'HaritAyan API Grid',
    description: 'AI-Powered Smart Agriculture, Urban Heat Mitigation & Mandi Intelligence for Vadodara District',
    features: [
      'Urban Heat Mitigation & Tree Cooling Simulator',
      'Gemini AI Multimodal Crop Vision Scanner',
      'Real-Time APMC Mandi Price Engine',
      'Operations & Agro-climatic Early Warning System',
    ],
  });
});

// Plant Disease Scanner Routes
app.use('/api/scan', scanRoutes);

// Multi-User Authentication Routes (Farmers & Agricultural Officers)
app.use('/api/auth', authRoutes);

// Farmer Consultations & Officer Review Station Routes
app.use('/api/queries', queryRoutes);

// Real-Time APMC Mandi Market Prices Engine
app.use('/api/mandi', mandiRoutes);

// Urban Heat Mitigation & Tree Cooling Simulator
app.use('/api/heat', heatRoutes);

// Smart Precision Irrigation Timer & Water Conservation Advisory
app.use('/api/irrigation', irrigationRoutes);

// Agro-Meteorological Weather Intelligence & IMD Heatwave Alerts
app.use('/api/weather', weatherRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 HaritAyan Server running on port ${PORT}`);
  console.log(`📡 Local API Health: http://localhost:${PORT}/api/health`);
});

export default app;
