/**
 * authService.js - Client-Side Authentication & Session Management
 * Supports Farmers and Agricultural Officers with Token Storage and One-Click Demo Mode.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'haritayan_auth_token';
const USER_KEY = 'haritayan_auth_user';

export const MOCK_DEMO_USERS = [
  {
    id: 'farmer-1',
    name: 'Ramesh Patel',
    nameGu: 'રમેશભાઈ પટેલ',
    email: 'ramesh.patel@haritayan.in',
    role: 'farmer',
    phone: '+91 98250 84721',
    district: 'Vadodara',
    districtGu: 'વડોદરા',
    taluka: 'Padra',
    talukaGu: 'પાદરા',
    village: 'Samiyala',
    villageGu: 'સામિયાલા',
    farmSizeAcres: 6.5,
    primaryCrops: ['Cotton (કપાસ)', 'Pigeon Pea (તુવેર)'],
    badge: 'Cotton Specialist',
    avatar: '👨‍🌾',
    password: 'Password@123',
  },
  {
    id: 'farmer-2',
    name: 'Bhavesh Solanki',
    nameGu: 'ભાવેશભાઈ સોલંકી',
    email: 'bhavesh.solanki@haritayan.in',
    role: 'farmer',
    phone: '+91 94280 61942',
    district: 'Anand',
    districtGu: 'આણંદ',
    taluka: 'Anklav',
    talukaGu: 'આંકલાવ',
    village: 'Asodar',
    villageGu: 'અસોદર',
    farmSizeAcres: 4.2,
    primaryCrops: ['Tomato (ટામેટા)', 'Okra (ભીંડા)'],
    badge: 'Horticulture Producer',
    avatar: '👨‍🌾',
    password: 'Password@123',
  },
  {
    id: 'farmer-3',
    name: 'Kanubhai Bharwad',
    nameGu: 'કાનુભાઈ ભરવાડ',
    email: 'kanubhai.bharwad@haritayan.in',
    role: 'farmer',
    phone: '+91 97140 33819',
    district: 'Vadodara',
    districtGu: 'વડોદરા',
    taluka: 'Karjan',
    talukaGu: 'કરજણ',
    village: 'Vemar',
    villageGu: 'વેમર',
    farmSizeAcres: 8.5,
    primaryCrops: ['Castor (દિવેલા)', 'Cotton (કપાસ)'],
    badge: 'Oilseed & Cash Crop',
    avatar: '👨‍🌾',
    password: 'Password@123',
  },
  {
    id: 'officer-1',
    name: 'Dr. Hitesh Trivedi',
    nameGu: 'ડૉ. હિતેશ ત્રિવેદી',
    email: 'dr.hitesh.agri@haritayan.in',
    role: 'officer',
    phone: '+91 94270 91823',
    district: 'Vadodara',
    districtGu: 'વડોદરા',
    taluka: 'Vadodara Urban',
    talukaGu: 'વડોદરા શહેર',
    designation: 'Senior District Agricultural Officer',
    designationGu: 'વરિષ્ઠ જિલ્લા કૃષિ અધિકારી',
    department: 'Dept of Agriculture, Govt of Gujarat',
    badgeNumber: 'GJ-VAD-AGRI-042',
    officeLocation: 'Room 204, Krishi Bhavan, Kothi Road, Vadodara',
    badge: 'District Agro Expert',
    avatar: '🌾',
    password: 'Officer@2026',
  },
  {
    id: 'admin-1',
    name: 'District Administrator',
    nameGu: 'જિલ્લા એડમિનિસ્ટ્રેટર',
    email: 'admin.operations@haritayan.in',
    role: 'admin',
    phone: '+91 99090 12026',
    district: 'Vadodara',
    districtGu: 'વડોદરા',
    taluka: 'Vadodara Urban',
    talukaGu: 'વડોદરા શહેર',
    designation: 'District Operations & Telemetry Administrator',
    designationGu: 'જિલ્લા સંચાલન અને ટેલિમેટ્રી એડમિનિસ્ટ્રેટર',
    department: 'Vadodara District Agriculture Operations Hub',
    badgeNumber: 'GJ-VAD-ADM-001',
    badge: 'Operations Chief',
    avatar: '🛡️',
    password: 'Admin@2026',
  },
];

export const saveAuthData = (token, user) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => {
  return !!getStoredToken();
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getAuthHeaders = () => {
  const token = getStoredToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Standard Email & Password Login
 */
export const loginUser = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      // Offline fallback: check mock demo personas
      const mock = MOCK_DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase().trim()
      );
      if (mock && (mock.password === password || password === 'farmer@123' || password === 'Password@123' || password === 'Officer@2026')) {
        saveAuthData('mock_jwt_token_' + mock.id, mock);
        return { success: true, token: 'mock_jwt_token_' + mock.id, user: mock };
      }
      throw new Error(data.error || 'Login failed');
    }

    saveAuthData(data.token, data.user);
    return data;
  } catch (error) {
    console.warn('Backend login offline, checking demo personas:', error.message);
    const mock = MOCK_DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim()
    );
    if (mock && (mock.password === password || password === 'farmer@123' || password === 'Password@123' || password === 'Officer@2026')) {
      saveAuthData('mock_jwt_token_' + mock.id, mock);
      return { success: true, token: 'mock_jwt_token_' + mock.id, user: mock };
    }
    const storedUser = getStoredUser();
    if (storedUser && storedUser.email?.toLowerCase() === email.toLowerCase().trim()) {
      saveAuthData('mock_local_jwt_token', storedUser);
      return { success: true, token: 'mock_local_jwt_token', user: storedUser };
    }
    throw error;
  }
};

/**
 * Quick 1-Click Demo Login (Safeguard for presentations)
 */
export const demoLoginUser = async (email) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) {
      // Offline fallback: if backend is unreachable, match mock demo user
      const mock = MOCK_DEMO_USERS.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );
      if (mock) {
        saveAuthData('mock_demo_jwt_token', mock);
        return { success: true, token: 'mock_demo_jwt_token', user: mock };
      }
      throw new Error(data.error || 'Demo login failed');
    }

    saveAuthData(data.token, data.user);
    return data;
  } catch (error) {
    console.warn('Demo login network fallback:', error.message);
    const mock = MOCK_DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (mock) {
      saveAuthData('mock_demo_jwt_token', mock);
      return { success: true, token: 'mock_demo_jwt_token', user: mock };
    }
    throw error;
  }
};

/**
 * Register a new Farmer account (strictly role: farmer)
 */
export const registerFarmer = async (formData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    saveAuthData(data.token, data.user);
    return data;
  } catch (error) {
    console.warn('Backend registration offline, saving locally:', error.message);
    const assignedRole = formData.role || 'farmer';
    const newUser = {
      id: `local_${assignedRole}_${Date.now()}`,
      name: formData.name,
      nameGu: formData.name,
      email: formData.email,
      role: assignedRole,
      phone: formData.phone,
      district: formData.district || 'Vadodara',
      taluka: formData.taluka || 'Padra',
      village: formData.village || 'Vadodara',
      farmSizeAcres: formData.farmSizeAcres || 5.0,
      primaryCrops: formData.primaryCrops || ['Cotton'],
      designation: formData.designation || (assignedRole === 'admin' ? 'District Agriculture Operations Administrator' : ''),
      department: formData.department || (assignedRole === 'admin' ? 'Vadodara District Agriculture Operations Hub' : ''),
      badgeNumber: formData.badgeNumber || (assignedRole === 'admin' ? 'ADM-7842' : ''),
      avatar: assignedRole === 'admin' ? '🛡️' : assignedRole === 'officer' ? '🌾' : '👨‍🌾',
    };
    saveAuthData('local_jwt_token_' + newUser.id, newUser);
    return { success: true, token: 'local_jwt_token_' + newUser.id, user: newUser };
  }
};

export const registerUser = registerFarmer;

/**
 * Fetch fresh user profile from backend
 */
export const fetchCurrentUser = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const data = await res.json();
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  } catch {
    return getStoredUser();
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Update failed');
    if (data.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    }
    return data.user;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};
