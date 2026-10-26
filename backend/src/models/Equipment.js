import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    nameGu: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['sprayers', 'land_prep', 'harvesting', 'irrigation_solar', 'drone_tech', 'post_harvest'],
      default: 'sprayers',
    },
    categoryLabel: {
      type: String,
      default: 'Spraying Equipment',
    },
    categoryLabelGu: {
      type: String,
      default: 'છંટકાવ સાધનો',
    },
    rentalRatePerHour: {
      type: Number,
      required: true,
      default: 0,
    },
    rentalRatePerDay: {
      type: Number,
      required: true,
      default: 0,
    },
    salePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    subsidyPercentage: {
      type: Number,
      default: 0, // e.g. 50% under i-Khedut portal
    },
    ikhedutScheme: {
      type: String,
      default: 'SMAM - Sub-Mission on Agricultural Mechanization (Gujarat)',
    },
    ikhedutSchemeGu: {
      type: String,
      default: 'કૃષિ યાંત્રિકીકરણ સબ-મિશન (i-ખેડૂત પોર્ટલ સહાય)',
    },
    effectiveFarmerPrice: {
      type: Number,
      default: 0,
    },
    talukaAvailability: [
      {
        type: String,
      },
    ],
    imageUrl: {
      type: String,
      default: '/images/tractor-rotavator.jpg',
    },
    specs: [
      {
        type: String,
      },
    ],
    specsGu: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['available', 'in_field', 'maintenance'],
      default: 'available',
    },
    totalUnits: {
      type: Number,
      default: 5,
    },
    availableUnits: {
      type: Number,
      default: 5,
    },
    vendorContact: {
      name: { type: String, default: 'Vadodara Agro Machinery Center' },
      phone: { type: String, default: '+91 98250 84721' },
      address: { type: String, default: 'Opposite APMC Yard, Padra Road, Vadodara' },
      verified: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate effective farmer price after subsidy
equipmentSchema.pre('save', function (next) {
  if (this.salePrice && this.subsidyPercentage) {
    this.effectiveFarmerPrice = Math.round(
      this.salePrice * (1 - this.subsidyPercentage / 100)
    );
  } else {
    this.effectiveFarmerPrice = this.salePrice;
  }
  next();
});

export const Equipment = mongoose.model('Equipment', equipmentSchema);
export default Equipment;
