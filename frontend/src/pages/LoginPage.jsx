import React, { useState } from 'react';
import {
  Sprout,
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  MapPin,
  Compass,
} from 'lucide-react';
import {
  loginUser,
  demoLoginUser,
  registerFarmer,
  MOCK_DEMO_USERS,
} from '../services/authService';

export const LoginPage = ({
  currentLang = 'en',
  onLoginSuccess,
  onNavigateHome,
}) => {
  const isGu = currentLang === 'gu';

  // Form State
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register Fields
  const [regData, setRegData] = useState({
    name: '',
    nameGu: '',
    email: '',
    password: '',
    phone: '',
    district: 'Vadodara',
    districtGu: 'વડોદરા',
    taluka: 'Padra',
    talukaGu: 'પાદરા',
    village: 'Samiyala',
    farmSizeAcres: '5.0',
    primaryCrops: 'Cotton, Pigeon Pea',
  });

  // Handle Standard Login
  const handleStandardSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(isGu ? 'કૃપા કરીને ઇમેઇલ અને પાસવર્ડ બંને દાખલ કરો' : 'Please provide both email and password');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await loginUser(email, password);
      setSuccessMsg(
        isGu
          ? `${res.user.nameGu || res.user.name} તરીકે સફળતાપૂર્વક પ્રવેશ કર્યો!`
          : `Welcome back, ${res.user.name}!`
      );
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }, 500);
    } catch (err) {
      setError(err.message || (isGu ? 'ખોટો ઇમેઇલ અથવા પાસવર્ડ' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  // Handle Quick Autofill
  const handleAutofill = (user) => {
    setEmail(user.email);
    setPassword(user.password || 'Password@123');
    setError('');
    setSuccessMsg(
      isGu
        ? `${user.nameGu || user.name} ની વિગતો ફોર્મમાં ભરાઈ ગઈ છે.`
        : `Credentials filled for ${user.name}. Click 'Sign In' or use Instant Login.`
    );
  };

  // Handle 1-Click Instant Demo Login
  const handleInstantDemoLogin = async (user) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await demoLoginUser(user.email);
      setSuccessMsg(
        isGu
          ? `${user.nameGu || user.name} તરીકે સફળતાપૂર્વક પ્રવેશ કર્યો!`
          : `Signed in as ${user.name} (${user.role === 'officer' ? 'Agri Officer' : 'Farmer'})`
      );
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }, 500);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle New Farmer Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      setError(isGu ? 'નામ, ઇમેઇલ અને પાસવર્ડ જરૂરી છે' : 'Name, email, and password are required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const payload = {
        ...regData,
        farmSizeAcres: Number(regData.farmSizeAcres) || 0,
        primaryCrops: regData.primaryCrops.split(',').map((c) => c.trim()).filter(Boolean),
      };
      const res = await registerFarmer(payload);
      setSuccessMsg(isGu ? 'ખેડૂત ખાતું સફળતાપૂર્વક બન્યું!' : 'Farmer account created successfully!');
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(res.user);
      }, 600);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#f6f8f4',
        minHeight: '90vh',
        paddingTop: '2.5rem',
        paddingBottom: '4rem',
      }}
    >
      <div style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Top Breadcrumb & Brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                backgroundColor: 'var(--green-deep)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(27,67,50,0.2)',
              }}
            >
              <Sprout size={24} />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  color: 'var(--text-title)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {isGu ? 'હરિતઅયન કિસાન અને અધિકારી પ્રવેશ' : 'HaritAyan Portal Login'}
              </h1>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isGu
                  ? 'સ્માર્ટ ખેતી, પાક રોગ નિદાન અને કૃષિ સલાહકાર નેટવર્ક'
                  : 'Smart Agriculture, Foliar Vision Diagnostics & Agronomist Network'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
              backgroundColor: '#ffffff',
              color: 'var(--text-title)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Compass size={14} color="var(--green-primary)" />
            <span>{isGu ? 'મુખ્ય પૃષ્ઠ પર પાછા જાઓ' : 'Back to Home'}</span>
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#fde8e8',
              border: '1.5px solid #f8b4b4',
              color: '#9b1c1c',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              marginBottom: '1.5rem',
              padding: '0.85rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: '#def7ec',
              border: '1.5px solid #bcf0da',
              color: '#03543f',
              fontSize: '0.88rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
            }}
          >
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Two-Column Grid: Form on Left, 4 Quick-Select Demo Users on Right */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 460px) 1fr',
            gap: '1.75rem',
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN: The Formal Login / Register Form */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-medium)',
              padding: '1.75rem',
              boxShadow: '0 8px 24px rgba(27,67,50,0.08)',
            }}
          >
            {/* Mode Switch Tabs */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '1.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(false);
                  setError('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: !isRegisterMode ? '3px solid var(--green-primary)' : '3px solid transparent',
                  color: !isRegisterMode ? 'var(--green-deep)' : 'var(--text-muted)',
                  backgroundColor: !isRegisterMode ? 'var(--green-wash)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isGu ? 'પ્રવેશ કરો (Sign In)' : 'Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(true);
                  setError('');
                  setSuccessMsg('');
                }}
                style={{
                  flex: 1,
                  padding: '0.65rem 0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: 'none',
                  borderBottom: isRegisterMode ? '3px solid var(--green-primary)' : '3px solid transparent',
                  color: isRegisterMode ? 'var(--green-deep)' : 'var(--text-muted)',
                  backgroundColor: isRegisterMode ? 'var(--green-wash)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isGu ? 'નવી નોંધણી (Register)' : 'New Farmer'}
              </button>
            </div>

            {!isRegisterMode ? (
              /* STANDARD LOGIN FORM */
              <form onSubmit={handleStandardSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                      color: 'var(--text-title)',
                    }}
                  >
                    {isGu ? 'ઇમેઇલ અથવા યુઝરનેમ' : 'Email Address / Username'}
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid var(--border-medium)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Mail size={16} color="var(--text-muted)" style={{ marginRight: '0.6rem' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. ramesh.patel@haritayan.in"
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.9rem',
                        color: 'var(--text-title)',
                      }}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      marginBottom: '0.4rem',
                      color: 'var(--text-title)',
                    }}
                  >
                    {isGu ? 'પાસવર્ડ' : 'Password'}
                  </label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid var(--border-medium)',
                      borderRadius: '8px',
                      padding: '0.65rem 0.85rem',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <Lock size={16} color="var(--text-muted)" style={{ marginRight: '0.6rem' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      style={{
                        border: 'none',
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.9rem',
                        color: 'var(--text-title)',
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        padding: '0',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--green-primary)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 12px rgba(45,106,79,0.28)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>
                    {loading
                      ? isGu
                        ? 'પ્રવેશ થઈ રહ્યો છે...'
                        : 'Authenticating...'
                      : isGu
                      ? 'ખાતામાં પ્રવેશ કરો (Sign In)'
                      : 'Sign In to HaritAyan'}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>
            ) : (
              /* NEW FARMER REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'નામ (English)' : 'Name'}
                    </label>
                    <input
                      type="text"
                      value={regData.name}
                      onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                      placeholder="Dilipbhai Rathod"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'ગુજરાતી નામ' : 'Gujarati Name'}
                    </label>
                    <input
                      type="text"
                      value={regData.nameGu}
                      onChange={(e) => setRegData({ ...regData, nameGu: e.target.value })}
                      placeholder="દિલીપભાઈ રાઠોડ"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'ઇમેઇલ' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={regData.email}
                      onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                      placeholder="farmer@haritayan.in"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'પાસવર્ડ' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={regData.password}
                      onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'તાલુકો' : 'Taluka'}
                    </label>
                    <input
                      type="text"
                      value={regData.taluka}
                      onChange={(e) => setRegData({ ...regData, taluka: e.target.value })}
                      placeholder="Padra / Karjan"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'ગામ' : 'Village'}
                    </label>
                    <input
                      type="text"
                      value={regData.village}
                      onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                      placeholder="Samiyala"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'જમીન (એકર)' : 'Acres'}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={regData.farmSizeAcres}
                      onChange={(e) => setRegData({ ...regData, farmSizeAcres: e.target.value })}
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                      {isGu ? 'મુખ્ય પાક' : 'Crops'}
                    </label>
                    <input
                      type="text"
                      value={regData.primaryCrops}
                      onChange={(e) => setRegData({ ...regData, primaryCrops: e.target.value })}
                      placeholder="Cotton, Tomato"
                      style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--green-primary)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}
                >
                  {loading
                    ? isGu
                      ? 'નોંધણી થઈ રહી છે...'
                      : 'Registering...'
                    : isGu
                    ? 'ખેડૂત તરીકે નોંધણી પૂર્ણ કરો'
                    : 'Complete Registration'}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: The 4 Pre-Configured Users (3 Farmers + 1 Officer) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-medium)',
              padding: '1.75rem',
              boxShadow: '0 8px 24px rgba(27,67,50,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <Sparkles size={18} color="var(--green-primary)" />
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--text-title)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {isGu ? '૪ પ્રમાણિત ડેમો એકાઉન્ટ્સ (પરીક્ષણ માટે)' : '4 Pre-Configured Demo Personas'}
              </h2>
            </div>

            <p
              style={{
                margin: '0 0 1.25rem 0',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
              }}
            >
              {isGu
                ? 'કોઈપણ એકાઉન્ટ પસંદ કરો. તમે ફોર્મમાં વિગતો ભરી શકો છો અથવા ૧-ક્લિક વડે ત્વરિત પ્રવેશ કરી શકો છો.'
                : 'Select any profile below. You can autofill the login form with their credentials or log in instantly with 1 click.'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {MOCK_DEMO_USERS.map((user) => {
                const isOfficer = user.role === 'officer';

                return (
                  <div
                    key={user.id}
                    style={{
                      borderRadius: '12px',
                      border: isOfficer
                        ? '1.5px solid var(--green-primary)'
                        : '1px solid var(--border-medium)',
                      backgroundColor: isOfficer ? '#f0f9f3' : '#faf9f5',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor: isOfficer ? '#d8f3dc' : '#f2efe9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.6rem',
                          flexShrink: 0,
                        }}
                      >
                        {user.avatar}
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-title)' }}>
                            {isGu && user.nameGu ? user.nameGu : user.name}
                          </span>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '12px',
                              backgroundColor: isOfficer ? 'var(--green-deep)' : '#e5ebd8',
                              color: isOfficer ? '#ffffff' : '#2d6a4f',
                            }}
                          >
                            {isOfficer
                              ? isGu
                                ? 'કૃષિ અધિકારી'
                                : 'Agri Officer'
                              : isGu
                              ? 'ખેડૂત'
                              : 'Farmer'}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {isOfficer
                            ? `${user.badgeNumber} • ${user.department}`
                            : `${user.village}, ${user.taluka} (${user.farmSizeAcres} Acres) • ${user.primaryCrops?.join(', ')}`}
                        </div>

                        <div style={{ fontSize: '0.72rem', color: 'var(--green-deep)', fontWeight: 600, marginTop: '2px' }}>
                          <code>{user.email}</code> | <code>{user.password || 'Password@123'}</code>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      {/* Autofill Button */}
                      <button
                        type="button"
                        onClick={() => handleAutofill(user)}
                        title="Autofill email & password into the form"
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          border: '1px solid var(--border-medium)',
                          backgroundColor: '#ffffff',
                          color: 'var(--text-title)',
                          fontSize: '0.76rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        {isGu ? 'વિગતો ભરો' : 'Fill Form'}
                      </button>

                      {/* 1-Click Instant Login */}
                      <button
                        type="button"
                        onClick={() => handleInstantDemoLogin(user)}
                        disabled={loading}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isOfficer ? 'var(--green-primary)' : 'var(--green-deep)',
                          color: '#ffffff',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: loading ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>{isGu ? '૧-ક્લિક પ્રવેશ' : 'Instant Login'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
