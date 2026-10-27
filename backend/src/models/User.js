import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema - Supports Farmers and Agricultural Officers.
 * Note: Admin role is omitted as per specification (handled separately).
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    nameGu: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: {
        values: ['farmer', 'officer', 'admin'],
        message: 'Role must be farmer, officer, or admin',
      },
      default: 'farmer',
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      trim: true,
      default: 'Vadodara',
    },
    districtGu: {
      type: String,
      trim: true,
      default: 'વડોદરા',
    },
    taluka: {
      type: String,
      trim: true,
      default: 'Padra',
    },
    talukaGu: {
      type: String,
      trim: true,
      default: 'પાદરા',
    },
    village: {
      type: String,
      trim: true,
      default: '',
    },
    villageGu: {
      type: String,
      trim: true,
      default: '',
    },
    // Farmer-specific attributes
    farmSizeAcres: {
      type: Number,
      default: 0,
    },
    primaryCrops: {
      type: [String],
      default: [],
    },
    primaryCropsGu: {
      type: [String],
      default: [],
    },
    // Agricultural Officer-specific attributes
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    designationGu: {
      type: String,
      trim: true,
      default: '',
    },
    department: {
      type: String,
      trim: true,
      default: '',
    },
    badgeNumber: {
      type: String,
      trim: true,
      default: '',
    },
    officeLocation: {
      type: String,
      trim: true,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcryptjs before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare user entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return sanitized user object (without password)
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model('User', userSchema);
export default User;
