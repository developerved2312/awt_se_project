import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import Scan from '../models/Scan.js';
import { analyzeLeafImage, getOfflineDiagnosticResult } from '../services/geminiService.js';
import { saveBufferToUploads, saveBase64ToUploads, UPLOADS_DIR } from '../middleware/uploadMiddleware.js';

/**
 * Helper to check if MongoDB is active and connected
 */
const isMongoConnected = () => mongoose.connection.readyState === 1;

/**
 * Controller: Analyze plant leaf image using Gemini Vision / Offline Knowledgebase
 * POST /api/scan/analyze
 */
export const analyzePlant = async (req, res) => {
  try {
    let base64Data = '';
    let mimeType = 'image/jpeg';
    let imageUrl = '';

    // Case 1: Image sent as multipart file upload via Multer
    if (req.file) {
      base64Data = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype || 'image/jpeg';
      const ext = path.extname(req.file.originalname) || '.jpg';
      imageUrl = saveBufferToUploads(req.file.buffer, ext);
    } else if (req.body.image || req.body.imageBase64) {
      // Case 2: Image sent as Base64 payload or asset path
      const rawImage = req.body.image || req.body.imageBase64;

      if (rawImage.startsWith('data:') || rawImage.length > 500) {
        try {
          const saved = saveBase64ToUploads(rawImage);
          imageUrl = saved.relativeUrl;
          base64Data = saved.base64Data;
          mimeType = saved.mimeType;
        } catch (saveErr) {
          console.warn('⚠️ Could not write base64 to disk, using direct base64:', saveErr.message);
          base64Data = rawImage.replace(/^data:image\/\w+;base64,/, '');
          imageUrl = '/images/leaf-scanner.jpg';
        }
      } else {
        // Pre-bundled static asset reference (e.g., sample crops)
        imageUrl = rawImage;
        base64Data = ''; // will trigger offline knowledgebase if empty
      }
    }

    const cropHint = req.body.cropHint || req.body.cropName || '';
    const userNotes = req.body.userNotes || '';

    // If no image or sample specified, return validation error
    if (!base64Data && !imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'No plant leaf image provided. Please upload an image file or Base64 payload.',
      });
    }

    // Call the AI Vision diagnostic engine (or offline knowledgebase if base64Data is empty)
    let diagnosticResult;
    if (base64Data) {
      diagnosticResult = await analyzeLeafImage({
        base64Data,
        mimeType,
        cropHint,
      });
    } else {
      diagnosticResult = getOfflineDiagnosticResult(cropHint || 'cotton');
    }

    // Handle non-plant image rejection
    if (diagnosticResult.isPlant === false) {
      return res.status(200).json({
        success: true,
        isPlant: false,
        message:
          'The submitted image does not appear to be an agricultural plant or leaf. Please take a clear photo of an infected or healthy crop leaf.',
        scan: {
          isPlant: false,
          cropName: 'Non-Plant Object',
          cropNameGu: 'વનસ્પતિ સિવાયનો ફોટો',
          diseaseName: 'Not a Recognized Agricultural Leaf',
          diseaseNameGu: 'કૃષિ પાંદડું ઓળખાયેલ નથી',
          confidenceScore: 0,
          symptoms: ['No foliar patterns, leaf veins, or chlorophyll structures detected.'],
          symptomsGu: ['છોડના પાન કે નસો જેવી કોઈ રચના જોવા મળતી નથી.'],
          organicRemedies: ['Please capture a clear, close-up photo of a crop leaf.'],
          organicRemediesGu: ['કૃપા કરીને પાકના પાંદડાનો સ્પષ્ટ ફોટો પાડો.'],
          chemicalRemedies: [],
          chemicalRemediesGu: [],
          preventiveMeasures: [],
          preventiveMeasuresGu: [],
          imageUrl: imageUrl || '',
        },
      });
    }

    // Save scan to MongoDB Atlas if connected
    let savedScan = null;
    if (isMongoConnected()) {
      try {
        const newScan = new Scan({
          cropName: diagnosticResult.cropName,
          cropNameGu: diagnosticResult.cropNameGu,
          diseaseName: diagnosticResult.diseaseName,
          diseaseNameGu: diagnosticResult.diseaseNameGu,
          pathogenType: diagnosticResult.pathogenType || 'Unknown',
          severity: diagnosticResult.severity || 'Moderate',
          confidenceScore: diagnosticResult.confidenceScore || 85,
          isPlant: true,
          symptoms: diagnosticResult.symptoms || [],
          symptomsGu: diagnosticResult.symptomsGu || [],
          organicRemedies: diagnosticResult.organicRemedies || [],
          organicRemediesGu: diagnosticResult.organicRemediesGu || [],
          chemicalRemedies: diagnosticResult.chemicalRemedies || [],
          chemicalRemediesGu: diagnosticResult.chemicalRemediesGu || [],
          preventiveMeasures: diagnosticResult.preventiveMeasures || [],
          preventiveMeasuresGu: diagnosticResult.preventiveMeasuresGu || [],
          imageUrl: imageUrl || '',
          engineUsed: diagnosticResult.engineUsed,
          userId: req.user ? req.user._id : null,
          farmerName: req.user ? req.user.name : (req.body.farmerName || ''),
          farmerLocation: req.user ? `${req.user.village ? req.user.village + ', ' : ''}${req.user.taluka || ''}, ${req.user.district || 'Vadodara'}` : '',
          userNotes: userNotes,
        });

        savedScan = await newScan.save();
      } catch (dbErr) {
        console.warn(`⚠️ [Database Save Notice] Failed to save scan to MongoDB: ${dbErr.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      isPlant: true,
      scan: savedScan || {
        ...diagnosticResult,
        _id: `temp_${Date.now()}`,
        imageUrl: imageUrl || '',
        userNotes,
        createdAt: new Date().toISOString(),
      },
      databaseSaved: !!savedScan,
    });
  } catch (error) {
    console.error(`❌ [analyzePlant Controller Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete plant leaf analysis. Please try again.',
      error: error.message,
    });
  }
};

/**
 * Controller: Get recent scans history
 * GET /api/scan/history
 */
export const getScanHistory = async (req, res) => {
  try {
    if (!isMongoConnected()) {
      return res.status(200).json({
        success: true,
        source: 'sample-memory',
        count: 2,
        scans: [
          {
            _id: 'sample_01',
            cropName: 'Cotton (Gossypium hirsutum)',
            cropNameGu: 'કપાસ',
            diseaseName: 'Cotton Leaf Curl Virus',
            diseaseNameGu: 'કપાસનો પાન વળવાનો વાયરલ રોગ',
            severity: 'Moderate',
            confidenceScore: 94,
            imageUrl: '/images/leaf-scanner.jpg',
            engineUsed: 'offline-expert-knowledgebase',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: 'sample_02',
            cropName: 'Tomato (Solanum lycopersicum)',
            cropNameGu: 'ટામેટા',
            diseaseName: 'Early Blight (Alternaria solani)',
            diseaseNameGu: 'ટામેટાનો આગોતરો સુકારો',
            severity: 'Moderate',
            confidenceScore: 91,
            imageUrl: '/images/leaf-scanner.jpg',
            engineUsed: 'offline-expert-knowledgebase',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      });
    }

    const { limit = 20, crop } = req.query;
    const filter = {};
    if (crop) {
      filter.cropName = new RegExp(crop, 'i');
    }

    const scans = await Scan.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      source: 'mongodb-atlas',
      count: scans.length,
      scans,
    });
  } catch (error) {
    console.error(`❌ [getScanHistory Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve scan history.',
    });
  }
};

/**
 * Controller: Get single scan by ID
 * GET /api/scan/:id
 */
export const getScanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isMongoConnected()) {
      return res.status(200).json({
        success: true,
        scan: getOfflineDiagnosticResult('cotton'),
      });
    }

    const scan = await Scan.findById(id);
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found with the provided ID.',
      });
    }

    return res.status(200).json({
      success: true,
      scan,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching scan details.',
      error: error.message,
    });
  }
};

/**
 * Controller: Delete scan by ID
 * DELETE /api/scan/:id
 */
export const deleteScan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isMongoConnected()) {
      return res.status(200).json({
        success: true,
        message: 'Scan removed from view (offline mode).',
        deletedId: id,
      });
    }

    const scan = await Scan.findById(id);
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found in database.',
      });
    }

    // Try deleting image file if stored in /uploads
    if (scan.imageUrl && scan.imageUrl.startsWith('/uploads/')) {
      const filename = path.basename(scan.imageUrl);
      const filePath = path.join(UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (unlinkErr) {
          console.warn('Notice: Could not remove disk file:', unlinkErr.message);
        }
      }
    }

    await Scan.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Scan deleted successfully from MongoDB Atlas.',
      deletedId: id,
    });
  } catch (error) {
    console.error(`❌ [deleteScan Error] ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete scan.',
      error: error.message,
    });
  }
};

export default {
  analyzePlant,
  getScanHistory,
  getScanById,
  deleteScan,
};
