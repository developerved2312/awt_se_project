import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and password',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('⚠️ [Login Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during login',
    });
  }
};

/**
 * @desc    Quick 1-Click Demo Login (Safeguard for live demos)
 * @route   POST /api/auth/demo-login
 * @access  Public
 */
export const demoLogin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Please specify the demo user email',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Demo user not found. Please run the database seeder.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: `Logged in as ${user.name} (${user.role === 'officer' ? 'Agricultural Officer' : 'Farmer'})`,
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('⚠️ [Demo Login Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during demo login',
    });
  }
};

/**
 * @desc    Get Current User Profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('⚠️ [Get Current User Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error fetching user profile',
    });
  }
};

/**
 * @desc    Register a new Farmer (strictly role 'farmer')
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerFarmer = async (req, res) => {
  try {
    const {
      name,
      nameGu,
      email,
      password,
      role = 'farmer',
      phone,
      district,
      districtGu,
      taluka,
      talukaGu,
      village,
      villageGu,
      farmSizeAcres,
      primaryCrops,
      designation,
      department,
      badgeNumber,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required',
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const assignedRole = ['farmer', 'officer', 'admin'].includes(role) ? role : 'farmer';

    const user = await User.create({
      name,
      nameGu: nameGu || name,
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      phone: phone || '',
      district: district || 'Vadodara',
      districtGu: districtGu || 'વડોદરા',
      taluka: taluka || 'Padra',
      talukaGu: talukaGu || 'પાદરા',
      village: village || '',
      villageGu: villageGu || '',
      farmSizeAcres: Number(farmSizeAcres) || 0,
      primaryCrops: Array.isArray(primaryCrops) ? primaryCrops : [],
      designation: designation || (assignedRole === 'admin' ? 'District Agriculture Operations Administrator' : ''),
      department: department || (assignedRole === 'admin' ? 'Vadodara District Agriculture Operations Hub' : ''),
      badgeNumber: badgeNumber || (assignedRole === 'admin' ? `ADM-${Math.floor(1000 + Math.random() * 9000)}` : ''),
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: `${assignedRole === 'admin' ? 'Administrator' : assignedRole === 'officer' ? 'Agricultural Officer' : 'Farmer'} account registered successfully`,
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('⚠️ [Register Farmer Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Server error creating account',
    });
  }
};

/**
 * @desc    Get List of Available Demo Users for One-Click Switcher
 * @route   GET /api/auth/demo-users
 * @access  Public
 */
export const getDemoUsers = async (req, res) => {
  try {
    const users = await User.find({
      email: {
        $in: [
          'ramesh.patel@haritayan.in',
          'bhavesh.solanki@haritayan.in',
          'kanubhai.bharwad@haritayan.in',
          'dr.hitesh.agri@haritayan.in',
        ],
      },
    }).select('-password');

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error('⚠️ [Get Demo Users Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error fetching demo accounts',
    });
  }
};

/**
 * @desc    Update User Profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const {
      name,
      nameGu,
      phone,
      district,
      districtGu,
      taluka,
      talukaGu,
      village,
      villageGu,
      farmSizeAcres,
      primaryCrops,
    } = req.body;

    if (name) user.name = name;
    if (nameGu) user.nameGu = nameGu;
    if (phone) user.phone = phone;
    if (district) user.district = district;
    if (districtGu) user.districtGu = districtGu;
    if (taluka) user.taluka = taluka;
    if (talukaGu) user.talukaGu = talukaGu;
    if (village) user.village = village;
    if (villageGu) user.villageGu = villageGu;
    if (farmSizeAcres !== undefined) user.farmSizeAcres = Number(farmSizeAcres);
    if (primaryCrops) user.primaryCrops = primaryCrops;

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    console.error('⚠️ [Update Profile Error]:', error);
    return res.status(500).json({
      success: false,
      error: 'Error updating profile',
    });
  }
};
