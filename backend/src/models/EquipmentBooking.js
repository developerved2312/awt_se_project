import mongoose from 'mongoose';

const equipmentBookingSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: false,
    },
    equipmentName: {
      type: String,
      required: true,
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    farmerName: {
      type: String,
      required: true,
      trim: true,
    },
    farmerPhone: {
      type: String,
      required: true,
      trim: true,
    },
    farmerTaluka: {
      type: String,
      required: true,
      default: 'Padra',
    },
    farmerVillage: {
      type: String,
      default: '',
    },
    bookingType: {
      type: String,
      enum: ['rental', 'subsidy_guidance', 'purchase_inquiry', 'custom_request'],
      default: 'rental',
    },
    rentalDurationHours: {
      type: Number,
      default: 8,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    totalCostEstimate: {
      type: Number,
      default: 0,
    },
    subsidyBenefitEstimate: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const EquipmentBooking = mongoose.model('EquipmentBooking', equipmentBookingSchema);
export default EquipmentBooking;
