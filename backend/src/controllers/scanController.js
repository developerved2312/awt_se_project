import mongoose from 'mongoose';
import Scan from '../models/Scan.js';
import { analyzeLeafImage, getOfflineDiagnosticResult } from '../services/geminiService.js';

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

    // Check if image came as a file upload via Multer
    if (req.file) {
      base64Data = req.file.buffer.toString('base64');
      mimeType = req.file.mimetype || 'image/jpeg';
      imageUrl = `data:${mimeType};base64,${base64Data.substring(0, 500)}...`; // preview indicator
    } else if (req.body.image || req.body.imageBase64) {
      // Image passed as base64 string
      const rawImage = req.body.image || req.body.imageBase64;

      if (rawImage.startsWith('data:')) {
        const matches = rawImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          mimeType = matches[1];
          base64Data = matches[2];
        } else {
          base64Data = rawImage;
        }
      } else {
        base64Data = rawImage;
      }
      imageUrl = rawImage.length > 500000 ? `${rawImage.substring(0, 200)}...` : rawImage;
    }

    const cropHint = req.body.cropHint || req.body.cropName || '';
    const userNotes = req.body.userNotes || '';

    // If no image was sent, return clear validation error
    if (!base64Data) {
      return res.status(400).json({
        success: false,
        message: 'No plant leaf image provided. Please upload an image file or Base64 payload.',
      });
    }

    // Call the AI Vision diagnostic engine
    const diagnosticResult = await analyzeLeafImage({
      base64Data,
      mimeType,
      cropHint,
    });

    // Handle non-plant image rejection
    if (diagnosticResult.isPlant === false) {
      return res.status(200).json({
        success: true,
        isPlant: false,
        message: 'The submitted image does not appear to be an agricultural plant or leaf. Please take a clear photo of an infected or healthy crop leaf.',
        scan: {
          isPlant: false,
          cropName: 'Non-Plant Object',
          cropNameGu: 'વનસ્પતિ સિવાયનો ફોટો',
          diseaseName: 'Not a Recognized Agricultural Leaf',
          diseaseNameGu: 'કૃષિ પાંદડું ઓળખાયેલ નથી',
          confidenceScore: 0,
          symptoms: ['No foliar patterns, veins, or chlorophyll structures detected.'],
          symptomsGu: ['છોડના પાન કે નસો જેવી કોઈ રચના જોવા મળતી નથી.'],
          organicRemedies: ['Please capture a clear, close-up photo of the crop leaf.'],
          organicRemediesGu: ['કૃપા કરીને પાકના પાંદડાનો સ્પષ્ટ ફોટો પાડો.'],
          chemicalRemedies: [],
          chemicalRemediesGu: [],
          preventiveMeasures: [],
          preventiveMeasuresGu: [],
        },
      });
    }

    // If MongoDB Atlas is connected, save the scan to the database
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
          imageUrl: imageUrl,
          engineUsed: diagnosticResult.engineUsed,
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
        imageUrl,
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
      // If MongoDB is not connected yet, return sample history items
      return res.status(200).json({
        success: true,
        source: 'sample-memory',
        count: 2,
        scans: [
          {
            _id: 'sample_01',
            cropName: 'Cotton (કપાસ)',
            cropNameGu: 'કપાસ',
            diseaseName: 'Cotton Leaf Curl Virus',
            diseaseNameGu: 'કપાસનો પાન વળવાનો વાયરલ રોગ',
            severity: 'Moderate',
            confidenceScore: 94,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            _id: 'sample_02',
            cropName: 'Tomato (ટામેટા)',
            cropNameGu: 'ટામેટા',
            diseaseName: 'Early Blight (Alternaria solani)',
            diseaseNameGu: 'ટામેટાનો આગોતરો સુકારો',
            severity: 'Mild',
            confidenceScore: 91,
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

export default {
  analyzePlant,
  getScanHistory,
  getScanById,
};
