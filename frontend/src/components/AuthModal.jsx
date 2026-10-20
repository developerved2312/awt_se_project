import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  Sprout,
  ArrowRight,
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  loginUser,
  demoLoginUser,
  registerFarmer,
  MOCK_DEMO_USERS,
} from '../services/authService';

export const AuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentLang = 'en',
}) => {
  const [tab, setTab] = useState('demo'); // 'demo' | 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Standard Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register Farmer State
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
    village: '',
    farmSizeAcres: '',
    primaryCrops: 'Cotton, Pigeon Pea',
  });

  const isGu = currentLang === 'gu';

  if (!isOpen) return null;

  const handleDemoSelect = async (demoUser) => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await demoLoginUser(demoUser.email);
      setSuccessMsg(
        isGu
          ? `${demoUser.nameGu || demoUser.name} તરીકે સફળતાપૂર્વક પ્રવેશ કર્યો!`
          : `Signed in as ${demoUser.name} (${demoUser.role === 'officer' ? 'Agri Officer' : 'Farmer'})`
      );
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
      }, 600);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStandardLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError(isGu ? 'ઇમેઇલ અને પાસવર્ડ બંને જરૂરી છે' : 'Email and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await loginUser(loginEmail, loginPassword);
      setSuccessMsg(isGu ? 'સફળ પ્રવેશ!' : 'Login successful!');
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
      }, 500);
    } catch (err) {
      setError(err.message || (isGu ? 'ખોટો ઇમેઇલ અથવા પાસવર્ડ' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regData.name || !regData.email || !regData.password) {
      setError(isGu ? 'નામ, ઇમેઇલ અને પાસવર્ડ આવશ્યક છે' : 'Name, email, and password are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...regData,
        farmSizeAcres: Number(regData.farmSizeAcres) || 0,
        primaryCrops: regData.primaryCrops
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
      };
      const res = await registerFarmer(payload);
      setSuccessMsg(isGu ? 'ખેડૂત ખાતું સફળતાપૂર્વક બન્યું!' : 'Farmer account created successfully!');
      setTimeout(() => {
        onSuccess(res.user);
        onClose();
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
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(18, 38, 28, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 24px 48px -12px rgba(27, 67, 50, 0.28)',
          border: '1px solid var(--border-medium)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'linear-gradient(135deg, #f7f9f5 0%, #eef3e8 100%)',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--green-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sprout size={20} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: 'var(--green-deep)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {isGu ? 'હરિતઅયન કિસાન અને અધિકારી પોર્ટલ' : 'HaritAyan Agrarian Portal'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isGu
                  ? 'ખેડૂતો અને કૃષિ અધિકારીઓ માટે બહુભૂમિકા સુરક્ષિત પ્લેટફોર્મ'
                  : 'Multi-User Workspace for Farmers & Agricultural Officers'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '6px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#ffffff',
          }}
        >
          <button
            type="button"
            onClick={() => {
              setTab('demo');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.85rem 0.5rem',
              fontSize: '0.86rem',
              fontWeight: 700,
              border: 'none',
              borderBottom: tab === 'demo' ? '3px solid var(--green-primary)' : '3px solid transparent',
              color: tab === 'demo' ? 'var(--green-deep)' : 'var(--text-muted)',
              backgroundColor: tab === 'demo' ? 'var(--green-wash)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Sparkles size={16} color="var(--green-primary)" />
            <span>{isGu ? '૧-ક્લિક લાઇવ ડેમો' : '1-Click Live Demo'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.85rem 0.5rem',
              fontSize: '0.86rem',
              fontWeight: 700,
              border: 'none',
              borderBottom: tab === 'login' ? '3px solid var(--green-primary)' : '3px solid transparent',
              color: tab === 'login' ? 'var(--green-deep)' : 'var(--text-muted)',
              backgroundColor: tab === 'login' ? 'var(--green-wash)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <Lock size={15} />
            <span>{isGu ? 'પ્રવેશ (Login)' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            style={{
              flex: 1,
              padding: '0.85rem 0.5rem',
              fontSize: '0.86rem',
              fontWeight: 700,
              border: 'none',
              borderBottom: tab === 'register' ? '3px solid var(--green-primary)' : '3px solid transparent',
              color: tab === 'register' ? 'var(--green-deep)' : 'var(--text-muted)',
              backgroundColor: tab === 'register' ? 'var(--green-wash)' : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            <UserCheck size={15} />
            <span>{isGu ? 'નવી નોંધણી' : 'New Farmer'}</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: '1.25rem 1.5rem', flex: 1 }}>
          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: '#fde8e8',
                border: '1px solid #f8b4b4',
                color: '#9b1c1c',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                backgroundColor: '#def7ec',
                border: '1px solid #bcf0da',
                color: '#03543f',
                fontSize: '0.84rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: 1-Click Live Demo Mode */}
          {tab === 'demo' && (
            <div>
              <p
                style={{
                  fontSize: '0.84rem',
                  color: 'var(--text-secondary)',
                  margin: '0 0 1rem 0',
                  lineHeight: 1.5,
                }}
              >
                {isGu
                  ? 'લાઈવ ડેમો અને પરીક્ષણ માટે નીચે આપેલ ચકાસાયેલા પ્રોફાઇલ્સમાંથી કોઈપણ એક પર ક્લિક કરો. પાસવર્ડ ટાઇપ કરવાની જરૂર નથી!'
                  : 'Select any pre-configured persona for instant one-click live demonstration. Stored directly in MongoDB Atlas.'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {MOCK_DEMO_USERS.map((user) => {
                  const isOfficer = user.role === 'officer';
                  return (
                    <div
                      key={user.id}
                      onClick={() => !loading && handleDemoSelect(user)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '10px',
                        border: isOfficer
                          ? '1.5px solid var(--green-primary)'
                          : '1px solid var(--border-medium)',
                        backgroundColor: isOfficer ? '#f0f9f3' : '#faf9f5',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.85rem',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(27,67,50,0.12)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div
                          style={{
                            fontSize: '1.5rem',
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            backgroundColor: isOfficer ? '#e0f2e9' : '#f2efe9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {user.avatar}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-title)' }}>
                              {isGu && user.nameGu ? user.nameGu : user.name}
                            </span>
                            <span
                              style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                padding: '2px 7px',
                                borderRadius: '12px',
                                backgroundColor: isOfficer ? 'var(--green-deep)' : '#e5ebd8',
                                color: isOfficer ? '#ffffff' : '#3d5a1b',
                              }}
                            >
                              {isOfficer
                                ? isGu
                                  ? 'જિલ્લા કૃષિ અધિકારી'
                                  : 'Agri Officer'
                                : isGu
                                ? 'ખેડૂત'
                                : 'Farmer'}
                            </span>
                          </div>

                          <p
                            style={{
                              margin: '2px 0 0 0',
                              fontSize: '0.76rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {isOfficer
                              ? `${user.badgeNumber} • ${user.district}`
                              : `${user.village}, ${user.taluka} • ${user.farmSizeAcres} Acres`}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={loading}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: isOfficer ? 'var(--green-primary)' : '#e6ede0',
                          color: isOfficer ? '#ffffff' : 'var(--green-deep)',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span>{isGu ? 'પ્રવેશ કરો' : 'Login'}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Standard Login */}
          {tab === 'login' && (
            <form onSubmit={handleStandardLogin}>
              <div style={{ marginBottom: '1rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    color: 'var(--text-title)',
                  }}
                >
                  {isGu ? 'ઇમેઇલ સરનામું' : 'Email Address'}
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Mail size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="e.g. ramesh.patel@haritayan.in"
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.88rem',
                      color: 'var(--text-title)',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    color: 'var(--text-title)',
                  }}
                >
                  {isGu ? 'પાસવર્ડ' : 'Password'}
                </label>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Lock size={16} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    style={{
                      border: 'none',
                      outline: 'none',
                      width: '100%',
                      fontSize: '0.88rem',
                      color: 'var(--text-title)',
                    }}
                    required
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
                  boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                }}
              >
                {loading
                  ? isGu
                    ? 'પ્રવેશ થઈ રહ્યો છે...'
                    : 'Signing in...'
                  : isGu
                  ? 'ખાતામાં પ્રવેશ કરો'
                  : 'Sign In to HaritAyan'}
              </button>
            </form>
          )}

          {/* TAB 3: New Farmer Registration */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {isGu ? 'ખેડૂતનું નામ (English)' : 'Farmer Name'}
                  </label>
                  <input
                    type="text"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="e.g. Dilipbhai Rathod"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                    {isGu ? 'ગુજરાતી નામ' : 'Name in Gujarati'}
                  </label>
                  <input
                    type="text"
                    value={regData.nameGu}
                    onChange={(e) => setRegData({ ...regData, nameGu: e.target.value })}
                    placeholder="દા.ત. દિલીપભાઈ રાઠોડ"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.25rem' }}>
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
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, marginBottom: '0.25rem' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {isGu ? 'જિલ્લો' : 'District'}
                  </label>
                  <select
                    value={regData.district}
                    onChange={(e) => setRegData({ ...regData, district: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  >
                    <option value="Vadodara">Vadodara (વડોદરા)</option>
                    <option value="Anand">Anand (આણંદ)</option>
                    <option value="Bharuch">Bharuch (ભરૂચ)</option>
                    <option value="Chhota Udepur">Chhota Udepur (છોટા ઉદેપુર)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {isGu ? 'તાલુકો' : 'Taluka'}
                  </label>
                  <input
                    type="text"
                    value={regData.taluka}
                    onChange={(e) => setRegData({ ...regData, taluka: e.target.value })}
                    placeholder="Padra / Karjan"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {isGu ? 'ગામ' : 'Village'}
                  </label>
                  <input
                    type="text"
                    value={regData.village}
                    onChange={(e) => setRegData({ ...regData, village: e.target.value })}
                    placeholder="Samiyala"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {isGu ? 'જમીન (એકર)' : 'Farm Size (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={regData.farmSizeAcres}
                    onChange={(e) => setRegData({ ...regData, farmSizeAcres: e.target.value })}
                    placeholder="e.g. 5.5"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                    {isGu ? 'મુખ્ય પાક' : 'Primary Crops'}
                  </label>
                  <input
                    type="text"
                    value={regData.primaryCrops}
                    onChange={(e) => setRegData({ ...regData, primaryCrops: e.target.value })}
                    placeholder="Cotton, Tomato, Okra"
                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
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
                  boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                }}
              >
                {loading
                  ? isGu
                    ? 'નોંધણી થઈ રહી છે...'
                    : 'Registering...'
                  : isGu
                  ? 'ખેડૂત તરીકે નોંધણી પૂર્ણ કરો'
                  : 'Register as Farmer'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
