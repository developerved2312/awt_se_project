import mongoose from 'mongoose';

/**
 * MandiPrice Schema
 * Stores daily APMC market price intelligence for agricultural commodities
 * across Vadodara district market yards (Sayajiganj, Padra, Karjan, Dabhoi, Savli).
 */
const weeklyTrendItemSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    dayGu: { type: String, required: true },
    date: { type: String, required: true },
    modalPrice: { type: Number, required: true },
  },
  { _id: false }
);

const mandiPriceSchema = new mongoose.Schema(
  {
    commodity: {
      type: String,
      required: [true, 'Commodity name in English is required'],
      trim: true,
      index: true,
    },
    commodityGu: {
      type: String,
      required: [true, 'Commodity name in Gujarati is required'],
      trim: true,
    },
    variety: {
      type: String,
      required: true,
      trim: true,
      default: 'Standard / FAQ',
    },
    varietyGu: {
      type: String,
      trim: true,
      default: 'સામાન્ય / એફ.એ.ક્યુ',
    },
    category: {
      type: String,
      enum: ['Fiber', 'Oilseed', 'Pulse', 'Vegetable', 'Cereal', 'Spices'],
      default: 'Fiber',
      index: true,
    },
    categoryGu: {
      type: String,
      default: 'રેસા પાક',
    },
    mandi: {
      type: String,
      required: [true, 'APMC Mandi name in English is required'],
      trim: true,
      index: true,
    },
    mandiGu: {
      type: String,
      required: [true, 'APMC Mandi name in Gujarati is required'],
      trim: true,
    },
    district: {
      type: String,
      default: 'Vadodara',
      trim: true,
    },
    districtGu: {
      type: String,
      default: 'વડોદરા',
      trim: true,
    },
    minPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    maxPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    modalPrice: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    arrivalsQuintals: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    unit: {
      type: String,
      default: '₹/Quintal',
    },
    priceChange24h: {
      type: Number,
      default: 0,
    },
    priceChangePercent: {
      type: Number,
      default: 0,
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable',
    },
    weeklyTrend: {
      type: [weeklyTrendItemSchema],
      default: [],
    },
    qualityGrade: {
      type: String,
      enum: ['Super Grade', 'Standard FAQ', 'Medium', 'Fair'],
      default: 'Standard FAQ',
    },
    qualityGradeGu: {
      type: String,
      default: 'શ્રેષ્ઠ ગુણવત્તા',
    },
    priceDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for unique commodity per mandi on a given date
mandiPriceSchema.index({ mandi: 1, commodity: 1, priceDate: -1 });

const MandiPrice = mongoose.model('MandiPrice', mandiPriceSchema);

export default MandiPrice;
