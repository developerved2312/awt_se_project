import React, { useState } from 'react';
import {
  Sprout,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Compass,
} from 'lucide-react';
import {
  loginUser,
  registerFarmer,
} from '../services/authService';

export const LoginPage = ({
  currentLang = 'en',
  onLoginSuccess,
  onNavigateHome,
  loginPromptReason = '',
}) => {
  const isGu = currentLang === 'gu';

  // Mode: 'signin' | 'signup'
  const [activeTab, setActiveTab] = useState('signin');

  // Sign In Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign Up Form State
  const [regData, setRegData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    taluka: 'Padra',
    village: '',
    farmSizeAcres: '5.0',
    primaryCrops: 'Cotton, Pigeon Pea',
  });
  const [showRegPassword, setShowRegPassword] = useState(false);

  const vadodaraTalukas = [
    { en: 'Padra', gu: 'પાદરા' },
    { en: 'Vadodara Rural', gu: 'વડોદરા ગ્રામ્ય' },
    { en: 'Karjan', gu: 'કરજણ' },
    { en: 'Dabhoi', gu: 'ડભોઇ' },
    { en: 'Savli', gu: 'સાવલી' },
    { en: 'Waghodia', gu: 'વાઘોડિયા' },
    { en: 'Shinor', gu: 'શિનોર' },
    { en: 'Anklav (Anand Border)', gu: 'આંકલાવ' },
  ];

  // Handle Standard Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError(
        isGu
          ? 'કૃપા કરીને ઇમેઇલ અને પાસવર્ડ બંને દાખલ કરો.'
          : 'Please enter both your email/username and password.'
      );
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await loginUser(email.trim(), password);
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

  // Handle New Farmer Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      setError(
        isGu
          ? 'કૃપા કરીને નામ, ઇમેઇલ અને પાસવર્ડ દાખલ કરો.'
          : 'Please provide full name, email, and password.'
      );
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const cropsArray = regData.primaryCrops
        ? regData.primaryCrops.split(',').map((c) => c.trim())
        : ['Cotton'];

      const res = await registerFarmer({
        name: regData.name.trim(),
        email: regData.email.trim(),
        password: regData.password,
        phone: regData.phone.trim(),
        district: 'Vadodara',
        taluka: regData.taluka,
        village: regData.village.trim() || 'Vadodara',
        farmSizeAcres: parseFloat(regData.farmSizeAcres) || 5.0,
        primaryCrops: cropsArray,
      });

      setSuccessMsg(
        isGu
          ? 'નવું ખાતું સફળતાપૂર્વક બની ગયું! આપનું સ્વાગત છે.'
          : 'Farmer account created successfully! Signing in...'
      );

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
      id="login-page-container"
      style={{
        minHeight: '85vh',
        background: 'linear-gradient(135deg, #f3f7f2 0%, #e8f2e9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2.5rem 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid rgba(45, 106, 79, 0.18)',
          boxShadow: '0 20px 45px rgba(27, 67, 50, 0.08), 0 4px 12px rgba(0, 0, 0, 0.03)',
          overflow: 'hidden',
          transition: 'all 0.25s ease',
        }}
      >
        {/* Brand Banner Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--green-deep) 0%, var(--green-primary) 100%)',
            color: '#ffffff',
            padding: '2rem 2rem 1.75rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Sprout size={28} color="#d8f3dc" strokeWidth={2.4} />
          </div>

          <h1
            style={{
              margin: '0 0 0.35rem 0',
              fontSize: '1.65rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.01em',
              color: '#ffffff',
            }}
          >
            HaritAyan • {isGu ? 'હરિતઅયન' : 'Smart Agriculture'}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '0.86rem',
              color: '#d8f3dc',
              fontWeight: 500,
            }}
          >
            {isGu
              ? 'વડોદરા સ્માર્ટ ખેતી અને પાક રોગ નિદાન પોર્ટલ'
              : 'Vadodara Smart Farming & Foliar Health Portal'}
          </p>

          {/* Home Link in Corner */}
          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                borderRadius: '8px',
                padding: '4px 8px',
                fontSize: '0.74rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
              title="Return to Home"
            >
              <Compass size={13} />
              <span>{isGu ? 'હોમ' : 'Home'}</span>
            </button>
          )}
        </div>

        {/* Informative Scanner Access Notice (If redirected from Scanner) */}
        {loginPromptReason === 'scanner' && (
          <div
            style={{
              backgroundColor: '#e8f5e9',
              borderBottom: '1px solid #c8e6c9',
              padding: '0.85rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--green-deep)',
              fontSize: '0.86rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={17} color="var(--green-primary)" />
            <span>
              {isGu
                ? 'પાક રોગ સ્કેનર વાપરવા માટે કૃપા કરીને પ્રવેશ કરો અથવા ખાતું બનાવો.'
                : 'Please sign in or create an account to access the AI Plant Disease Scanner.'}
            </span>
          </div>
        )}

        <div style={{ padding: '1.75rem 2rem 2.25rem' }}>
          {/* Tab Switcher: Sign In vs Sign Up */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--bg-canvas)',
              borderRadius: '12px',
              padding: '4px',
              border: '1px solid var(--border-medium)',
              marginBottom: '1.75rem',
            }}
          >
            <button
              type="button"
              id="tab-signin-btn"
              onClick={() => {
                setActiveTab('signin');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0',
                border: 'none',
                borderRadius: '9px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: activeTab === 'signin' ? 'var(--green-deep)' : 'transparent',
                color: activeTab === 'signin' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeTab === 'signin' ? '0 2px 8px rgba(27, 67, 50, 0.18)' : 'none',
              }}
            >
              {isGu ? 'પ્રવેશ કરો (Sign In)' : 'Sign In'}
            </button>

            <button
              type="button"
              id="tab-signup-btn"
              onClick={() => {
                setActiveTab('signup');
                setError('');
                setSuccessMsg('');
              }}
              style={{
                flex: 1,
                padding: '0.65rem 0',
                border: 'none',
                borderRadius: '9px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backgroundColor: activeTab === 'signup' ? 'var(--green-deep)' : 'transparent',
                color: activeTab === 'signup' ? '#ffffff' : 'var(--text-muted)',
                boxShadow: activeTab === 'signup' ? '0 2px 8px rgba(27, 67, 50, 0.18)' : 'none',
              }}
            >
              {isGu ? 'નવું ખાતું (Sign Up)' : 'New Account'}
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#fff5f5',
                border: '1px solid #f8b4b4',
                color: '#c81e1e',
                fontSize: '0.86rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#def7ec',
                border: '1px solid #bcf0da',
                color: '#03543f',
                fontSize: '0.86rem',
                fontWeight: 600,
                marginBottom: '1.25rem',
              }}
            >
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* =========================================================================
              SIGN IN FORM
              ========================================================================= */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--green-deep)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {isGu ? 'ઇમેઇલ અથવા યુઝરનેમ' : 'Email or Username'}
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="text"
                    id="signin-email-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isGu ? 'તમારો ઇમેઇલ દાખલ કરો' : 'Enter your email or username'}
                    disabled={loading}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.92rem',
                      backgroundColor: '#ffffff',
                      color: 'var(--green-deep)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--green-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--green-deep)',
                    }}
                  >
                    {isGu ? 'પાસવર્ડ' : 'Password'}
                  </label>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="signin-password-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isGu ? 'તમારો પાસવર્ડ લખો' : 'Enter your password'}
                    disabled={loading}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.92rem',
                      backgroundColor: '#ffffff',
                      color: 'var(--green-deep)',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--green-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--border-medium)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                id="signin-submit-btn"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--green-primary)',
                  color: '#ffffff',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)',
                  marginTop: '0.5rem',
                  transition: 'background-color 0.15s ease',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                <span>
                  {loading
                    ? isGu
                      ? 'ચકાસણી ચાલુ છે...'
                      : 'Signing In...'
                    : isGu
                    ? 'પ્રવેશ કરો (Sign In)'
                    : 'Sign In to HaritAyan'}
                </span>
                {!loading && <ArrowRight size={17} />}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {isGu ? 'ખાતું નથી?' : "Don't have an account?"}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setError('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--green-primary)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {isGu ? 'નવું ખાતું બનાવો' : 'Sign up here'}
                </button>
              </div>
            </form>
          )}

          {/* =========================================================================
              SIGN UP (NEW ACCOUNT) FORM
              ========================================================================= */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--green-deep)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {isGu ? 'ખેડૂતનું પૂરું નામ' : 'Full Name'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="text"
                    id="signup-name-input"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder={isGu ? 'દા.ત. રમેશભાઈ પટેલ' : 'e.g. Ramesh Patel'}
                    disabled={loading}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.9rem',
                      color: 'var(--green-deep)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--green-deep)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {isGu ? 'ઇમેઇલ એડ્રેસ' : 'Email Address'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type="email"
                    id="signup-email-input"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    placeholder={isGu ? 'તમારો ઇમેઇલ' : 'farmer@example.com'}
                    disabled={loading}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.9rem',
                      color: 'var(--green-deep)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--green-deep)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {isGu ? 'પાસવર્ડ' : 'Password'} *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={17}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-muted)',
                    }}
                  />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    id="signup-password-input"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    placeholder={isGu ? 'નવો પાસવર્ડ બનાવો' : 'Create strong password'}
                    disabled={loading}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem 2.75rem 0.75rem 2.5rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.9rem',
                      color: 'var(--green-deep)',
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '4px',
                    }}
                  >
                    {showRegPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {/* Grid: Phone & Taluka */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--green-deep)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {isGu ? 'મોબાઇલ નંબર' : 'Phone'}
                  </label>
                  <input
                    type="tel"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    placeholder="+91 98250..."
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.88rem',
                      color: 'var(--green-deep)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--green-deep)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {isGu ? 'તાલુકો' : 'Taluka'}
                  </label>
                  <select
                    value={regData.taluka}
                    onChange={(e) => setRegData({ ...regData, taluka: e.target.value })}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.88rem',
                      color: 'var(--green-deep)',
                      backgroundColor: '#ffffff',
                      boxSizing: 'border-box',
                    }}
                  >
                    {vadodaraTalukas.map((t) => (
                      <option key={t.en} value={t.en}>
                        {isGu ? t.gu : t.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Grid: Village & Farm Size */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--green-deep)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {isGu ? 'ગામનું નામ' : 'Village'}
                  </label>
                  <input
                    type="text"
                    value={regData.village}
                    onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                    placeholder={isGu ? 'દા.ત. સામિયાલા' : 'e.g. Samiyala'}
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.88rem',
                      color: 'var(--green-deep)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      color: 'var(--green-deep)',
                      marginBottom: '0.35rem',
                    }}
                  >
                    {isGu ? 'એકર જમીન' : 'Acres Land'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={regData.farmSizeAcres}
                    onChange={(e) => setRegData({ ...regData, farmSizeAcres: e.target.value })}
                    placeholder="5.0"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.88rem',
                      color: 'var(--green-deep)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    color: 'var(--green-deep)',
                    marginBottom: '0.35rem',
                  }}
                >
                  {isGu ? 'વાવેતર કરેલ મુખ્ય પાક' : 'Primary Crops'}
                </label>
                <input
                  type="text"
                  value={regData.primaryCrops}
                  onChange={(e) => setRegData({ ...regData, primaryCrops: e.target.value })}
                  placeholder={isGu ? 'દા.ત. કપાસ, તુવેર, દિવેલા' : 'e.g. Cotton, Tomato, Pigeon Pea'}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.88rem',
                    color: 'var(--green-deep)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="submit"
                id="signup-submit-btn"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'var(--green-primary)',
                  color: '#ffffff',
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)',
                  marginTop: '0.5rem',
                  transition: 'background-color 0.15s ease',
                  opacity: loading ? 0.75 : 1,
                }}
              >
                <span>
                  {loading
                    ? isGu
                      ? 'ખાતું બની રહ્યું છે...'
                      : 'Creating Account...'
                    : isGu
                    ? 'નવું ખાતું બનાવો (Create Account)'
                    : 'Register as New Farmer'}
                </span>
                {!loading && <ArrowRight size={17} />}
              </button>

              <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                <span style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  {isGu ? 'પહેલેથી ખાતું છે?' : 'Already registered?'}{' '}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setError('');
                    setSuccessMsg('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--green-primary)',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                  }}
                >
                  {isGu ? 'પ્રવેશ કરો (Sign In)' : 'Sign In here'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
