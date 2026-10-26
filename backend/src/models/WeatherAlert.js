import mongoose from 'mongoose';

const weatherAlertSchema = new mongoose.Schema(
  {
    titleEn: {
      type: String,
      required: true,
      trim: true,
    },
    titleGu: {
      type: String,
      required: true,
      trim: true,
    },
    messageEn: {
      type: String,
      required: true,
    },
    messageGu: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'severe', 'critical'],
      default: 'warning',
    },
    alertType: {
      type: String,
      enum: ['heatwave', 'unseasonal_rain', 'pest_risk', 'wind_drift', 'advisory'],
      default: 'heatwave',
    },
    targetTalukas: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    broadcastBy: {
      type: String,
      default: 'District Agro-Meteorological Unit (DAMU), Vadodara',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 48 * 3600 * 1000), // Default 48h validity
    },
  },
  {
    timestamps: true,
  }
);

export const WeatherAlert = mongoose.model('WeatherAlert', weatherAlertSchema);
export default WeatherAlert;
