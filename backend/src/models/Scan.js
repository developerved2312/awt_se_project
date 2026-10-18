import mongoose from 'mongoose';

/**
 * Scan Schema - Stores plant disease diagnostic scans,
 * foliar visual analysis, Gemini AI outputs, and bilingual remedies.
 */
const scanSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
      default: 'Unknown Crop',
    },
    cropNameGu: {
      type: String,
      trim: true,
      default: 'અજ્ઞાત પાક',
    },
    diseaseName: {
      type: String,
      required: true,
      trim: true,
      default: 'Unknown Condition',
    },
    diseaseNameGu: {
      type: String,
      trim: true,
      default: 'અજ્ઞાત સ્થિતિ',
    },
    pathogenType: {
      type: String,
      enum: [
        'Fungal',
        'Viral',
        'Bacterial',
        'Pest Infestation',
        'Nutrient Deficiency',
        'Healthy',
        'Unknown',
      ],
      default: 'Unknown',
    },
    severity: {
      type: String,
      enum: ['None', 'Mild', 'Moderate', 'Severe'],
      default: 'Moderate',
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 85,
    },
    isPlant: {
      type: Boolean,
      default: true,
    },
    symptoms: {
      type: [String],
      default: [],
    },
    symptomsGu: {
      type: [String],
      default: [],
    },
    organicRemedies: {
      type: [String],
      default: [],
    },
    organicRemediesGu: {
      type: [String],
      default: [],
    },
    chemicalRemedies: {
      type: [String],
      default: [],
    },
    chemicalRemediesGu: {
      type: [String],
      default: [],
    },
    preventiveMeasures: {
      type: [String],
      default: [],
    },
    preventiveMeasuresGu: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    engineUsed: {
      type: String,
      enum: [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'offline-expert-knowledgebase',
      ],
      default: 'gemini-1.5-flash',
    },
    userNotes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast sorting by recent scans
scanSchema.index({ createdAt: -1 });

export const Scan = mongoose.model('Scan', scanSchema);
export default Scan;
