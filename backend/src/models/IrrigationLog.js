import mongoose from 'mongoose';

const irrigationLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    cropKey: {
      type: String,
      required: true,
      trim: true,
    },
    cropName: {
      type: String,
      required: true,
    },
    areaVigha: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ['drip', 'sprinkler', 'flood'],
      default: 'drip',
    },
    durationMinutes: {
      type: Number,
      required: true,
    },
    waterDeliveredLiters: {
      type: Number,
      required: true,
    },
    waterSavedLiters: {
      type: Number,
      default: 0,
    },
    taluka: {
      type: String,
      default: 'Padra',
    },
    status: {
      type: String,
      enum: ['Completed', 'Running', 'Interrupted'],
      default: 'Completed',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const IrrigationLog = mongoose.model('IrrigationLog', irrigationLogSchema);
export default IrrigationLog;
