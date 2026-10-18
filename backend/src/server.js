import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import scanRoutes from './routes/scanRoutes.js';

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
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

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
    modules: [
      'Module 01: Urban Heat Mitigation & Tree Cooling Simulator',
      'Module 02: Gemini AI Multimodal Crop Vision Scanner',
      'Module 03: Real-Time APMC Mandi Price Engine',
      'Module 04: Operations & Agro-climatic Early Warning System',
    ],
  });
});

// AI Module 02 - Plant Disease Scanner Routes
app.use('/api/scan', scanRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 HaritAyan Server running on port ${PORT}`);
  console.log(`📡 Local API Health: http://localhost:${PORT}/api/health`);
});

export default app;
