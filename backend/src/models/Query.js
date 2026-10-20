import mongoose from 'mongoose';

/**
 * Farmer Query / Agronomist Advisory Consultation Schema
 * Allows farmers to post crop field issues, symptoms, and photos
 * for official Agricultural Officer review and diagnosis.
 */
const querySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Query title is required'],
      trim: true,
    },
    titleGu: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Query description is required'],
      trim: true,
    },
    descriptionGu: {
      type: String,
      trim: true,
      default: '',
    },
    crop: {
      type: String,
      required: true,
      default: 'Cotton',
    },
    cropGu: {
      type: String,
      default: 'કપાસ',
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Reviewed', 'Resolved'],
      default: 'Pending Review',
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerNameGu: {
      type: String,
      default: '',
    },
    farmerPhone: {
      type: String,
      default: '',
    },
    village: {
      type: String,
      default: '',
    },
    taluka: {
      type: String,
      default: '',
    },
    district: {
      type: String,
      default: 'Vadodara',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scan',
    },
    // Officer response and verified agronomic recommendation
    officerResponse: {
      officerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      officerName: {
        type: String,
        default: '',
      },
      officerBadge: {
        type: String,
        default: '',
      },
      designation: {
        type: String,
        default: '',
      },
      comment: {
        type: String,
        default: '',
      },
      commentGu: {
        type: String,
        default: '',
      },
      prescribedRemedies: {
        type: [String],
        default: [],
      },
      prescribedRemediesGu: {
        type: [String],
        default: [],
      },
      respondedAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

querySchema.index({ farmerId: 1, createdAt: -1 });
querySchema.index({ status: 1, createdAt: -1 });

export const Query = mongoose.model('Query', querySchema);
export default Query;
