import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Sprout,
  MapPin,
  Phone,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PlusCircle,
  Send,
  Trash2,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Camera,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  getStoredUser,
  demoLoginUser,
  MOCK_DEMO_USERS,
  logout,
} from '../services/authService';
import {
  fetchQueries,
  createQuery,
  respondToQuery,
  deleteQuery,
} from '../services/queryService';
import { resolveImageUrl } from '../services/scanService';

export const UserProfile = ({
  currentUser,
  onUserChange,
  currentLang = 'en',
  onNavigateToScanner,
  onNavigateHome,
}) => {
  const isGu = currentLang === 'gu';
  const user = currentUser || getStoredUser() || MOCK_DEMO_USERS[0];

  const isOfficer = user?.role === 'officer';

  // State
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('queries'); // 'queries' | 'scans' | 'officer_desk'
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'Pending Review' | 'Reviewed'
  const [expandedQueryId, setExpandedQueryId] = useState(null);

  // New Query Modal Form State
  const [showNewQueryModal, setShowNewQueryModal] = useState(false);
  const [newQuery, setNewQuery] = useState({
    title: '',
    titleGu: '',
    crop: 'Cotton',
    cropGu: 'કપાસ',
    urgency: 'High',
    description: '',
    imageUrl: '/images/cotton.jpeg',
  });
  const [submittingQuery, setSubmittingQuery] = useState(false);

  // Officer Response Form State
  const [respondingToId, setRespondingToId] = useState(null);
  const [officerAdvice, setOfficerAdvice] = useState({
    comment: '',
    prescribedRemedy1: '',
    prescribedRemedy2: '',
  });
  const [submittingResponse, setSubmittingResponse] = useState(false);

  // Notification message
  const [bannerNotice, setBannerNotice] = useState('');

  const loadQueries = async () => {
    setLoading(true);
    try {
      const data = await fetchQueries();
      setQueries(data);
    } catch (err) {
      console.warn('Failed to fetch queries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueries();
  }, [user]);

  // Handle instant demo profile switch
  const handleSwitchUser = async (demoUser) => {
    try {
      const res = await demoLoginUser(demoUser.email);
      if (onUserChange) onUserChange(res.user);
      setBannerNotice(
        isGu
          ? `${demoUser.nameGu || demoUser.name} તરીકે સફળતાપૂર્વક સ્વિચ થયા!`
          : `Switched session to ${demoUser.name} (${demoUser.role === 'officer' ? 'Agri Officer' : 'Farmer'})`
      );
      setTimeout(() => setBannerNotice(''), 3500);
    } catch (err) {
      console.error('Switch user error:', err);
    }
  };

  // Submit a new farmer query
  const handleCreateQuery = async (e) => {
    e.preventDefault();
    if (!newQuery.title || !newQuery.description) return;
    setSubmittingQuery(true);
    try {
      await createQuery({
        ...newQuery,
        cropGu: newQuery.crop === 'Cotton' ? 'કપાસ' : newQuery.crop === 'Tomato' ? 'ટામેટા' : newQuery.crop === 'Castor' ? 'દિવેલા' : 'પાક',
      });
      setShowNewQueryModal(false);
      setNewQuery({
        title: '',
        titleGu: '',
        crop: 'Cotton',
        cropGu: 'કપાસ',
        urgency: 'High',
        description: '',
        imageUrl: '/images/cotton.jpeg',
      });
      setBannerNotice(
        isGu
          ? 'તમારો પ્રશ્ન સફળતાપૂર્વક જિલ્લા કૃષિ અધિકારી ડેસ્ક પર મોકલાઈ ગયો છે!'
          : 'Query submitted successfully to District Agronomist Desk!'
      );
      setTimeout(() => setBannerNotice(''), 4000);
      loadQueries();
    } catch (err) {
      alert(err.message || 'Failed to submit query');
    } finally {
      setSubmittingQuery(false);
    }
  };

  // Officer submits verified advice
  const handleOfficerRespond = async (queryId) => {
    if (!officerAdvice.comment) return;
    setSubmittingResponse(true);
    try {
      const prescribedRemedies = [
        officerAdvice.prescribedRemedy1,
        officerAdvice.prescribedRemedy2,
      ].filter(Boolean);

      await respondToQuery(queryId, {
        comment: officerAdvice.comment,
        prescribedRemedies,
        status: 'Reviewed',
      });

      setRespondingToId(null);
      setOfficerAdvice({ comment: '', prescribedRemedy1: '', prescribedRemedy2: '' });
      setBannerNotice(
        isGu
          ? 'સત્તાવાર કૃષિ માર્ગદર્શન અને દવાઓની ભલામણ સફળતાપૂર્વક ખેડૂત સુધી પહોંચાડવામાં આવી!'
          : 'Official agronomic advisory & prescription dispatched to farmer!'
      );
      setTimeout(() => setBannerNotice(''), 4000);
      loadQueries();
    } catch (err) {
      alert(err.message || 'Failed to submit response');
    } finally {
      setSubmittingResponse(false);
    }
  };

  // Farmer / Officer deletes query
  const handleDeleteQuery = async (queryId, e) => {
    e.stopPropagation();
    if (!window.confirm(isGu ? 'શું તમે આ પ્રશ્ન રદ કરવા માંગો છો?' : 'Are you sure you want to remove this query?')) return;
    try {
      await deleteQuery(queryId);
      setQueries((prev) => prev.filter((q) => q._id !== queryId));
    } catch (err) {
      alert(err.message || 'Failed to delete query');
    }
  };

  // Filter queries based on status
  const filteredQueries = queries.filter((q) => {
    if (filterStatus === 'all') return true;
    return q.status === filterStatus;
  });

  return (
    <div
      style={{
        backgroundColor: '#f5f7f2',
        minHeight: '100vh',
        paddingBottom: '3.5rem',
      }}
    >
      {/* 1. PERSISTENT LIVE DEMO QUICK SWITCHER BAR */}
      <div
        style={{
          background: 'linear-gradient(90deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff',
          padding: '0.65rem 1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="#d8f3dc" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              {isGu ? 'લાઇવ ડેમો સ્વિચર (પરીક્ષણ):' : 'Live Demo Switcher (Instant Multi-User):'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
            {MOCK_DEMO_USERS.map((demo) => {
              const isActive = user?.email === demo.email;
              const isDemoOfficer = demo.role === 'officer';
              return (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleSwitchUser(demo)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    border: isActive ? '1.5px solid #ffffff' : '1px solid rgba(255,255,255,0.25)',
                    backgroundColor: isActive
                      ? '#ffffff'
                      : isDemoOfficer
                      ? 'rgba(216, 243, 220, 0.18)'
                      : 'rgba(255,255,255,0.08)',
                    color: isActive ? 'var(--green-deep)' : '#ffffff',
                  }}
                >
                  <span>{demo.avatar}</span>
                  <span>{demo.name.split(' ')[0]}</span>
                  <span
                    style={{
                      fontSize: '0.65rem',
                      opacity: isActive ? 0.85 : 0.65,
                      textTransform: 'uppercase',
                    }}
                  >
                    ({isDemoOfficer ? 'Officer' : demo.primaryCrops?.[0]?.split(' ')?.[0] || 'Farmer'})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Temporary Banner Notice */}
      {bannerNotice && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '1rem auto 0 auto',
            padding: '0.75rem 1.25rem',
            borderRadius: '8px',
            backgroundColor: '#def7ec',
            border: '1px solid #bcf0da',
            color: '#03543f',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          }}
        >
          <CheckCircle2 size={18} color="#0e9f6e" />
          <span>{bannerNotice}</span>
        </div>
      )}

      {/* Main Container */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '1.5rem auto 0 auto',
          padding: '0 1rem',
        }}
      >
        {/* 2. USER IDENTITY CARD (Farmer vs Agricultural Officer) */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-medium)',
            padding: '1.5rem',
            boxShadow: '0 4px 16px rgba(27,67,50,0.06)',
            marginBottom: '1.5rem',
            background: isOfficer
              ? 'linear-gradient(135deg, #ffffff 0%, #f0f7f2 100%)'
              : '#ffffff',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.25rem',
            }}
          >
            {/* Identity Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  backgroundColor: isOfficer ? '#d8f3dc' : '#f2efe9',
                  border: isOfficer ? '2px solid var(--green-primary)' : '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.2rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                }}
              >
                {isOfficer ? '🌾' : '👨‍🌾'}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: 'var(--text-title)',
                      fontFamily: 'var(--font-heading)',
                    }}
                  >
                    {isGu && user?.nameGu ? user.nameGu : user?.name || 'Farmer Profile'}
                  </h1>

                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      padding: '3px 10px',
                      borderRadius: '20px',
                      backgroundColor: isOfficer ? 'var(--green-deep)' : '#e5ebd8',
                      color: isOfficer ? '#ffffff' : '#2d6a4f',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                    }}
                  >
                    {isOfficer ? <Shield size={12} /> : <Sprout size={12} />}
                    <span>
                      {isOfficer
                        ? isGu
                          ? 'સરકારી કૃષિ અધિકારી'
                          : 'Agricultural Officer'
                        : isGu
                        ? 'પ્રમાણિત ખેડૂત'
                        : 'Verified Farmer'}
                    </span>
                  </span>
                </div>

                <p
                  style={{
                    margin: '4px 0 0 0',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500,
                  }}
                >
                  {isOfficer
                    ? `${user?.designation || 'District Agricultural Officer'} • ${user?.badgeNumber || 'GJ-VAD-AGRI-042'}`
                    : `${user?.village || 'Samiyala'}, ${user?.taluka || 'Padra'}, ${user?.district || 'Vadodara'} District`}
                </p>

                <p
                  style={{
                    margin: '3px 0 0 0',
                    fontSize: '0.78rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  {isOfficer
                    ? user?.officeLocation || 'Room 204, Krishi Bhavan, Vadodara'
                    : `Contact: ${user?.phone || '+91 98250 84721'} • Email: ${user?.email}`}
                </p>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              {isOfficer ? (
                <>
                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid var(--border-medium)',
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                      {queries.length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isGu ? 'કુલ પ્રશ્નો' : 'Total Inquiries'}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #f8b4b4',
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c81e1e' }}>
                      {queries.filter((q) => q.status === 'Pending Review').length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#c81e1e', fontWeight: 600 }}>
                      {isGu ? 'બાકી સમીક્ષા' : 'Awaiting Review'}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #bcf0da',
                      textAlign: 'center',
                      minWidth: '100px',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0e9f6e' }}>
                      {queries.filter((q) => q.status === 'Reviewed').length}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#0e9f6e', fontWeight: 600 }}>
                      {isGu ? 'સલાહ અપાઈ' : 'Advisories Issued'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-medium)',
                      textAlign: 'center',
                      minWidth: '95px',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                      {user?.farmSizeAcres || 6.5}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isGu ? 'એકર જમીન' : 'Acres Land'}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-medium)',
                      textAlign: 'center',
                      minWidth: '120px',
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-title)' }}>
                      {Array.isArray(user?.primaryCrops)
                        ? user.primaryCrops.join(', ')
                        : 'Cotton, Tur'}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isGu ? 'વાવેતર પાક' : 'Primary Crops'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewQueryModal(true)}
                    style={{
                      padding: '0.65rem 1.15rem',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'var(--green-primary)',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                    }}
                  >
                    <PlusCircle size={16} />
                    <span>{isGu ? 'નવો કૃષિ પ્રશ્ન પૂછો' : 'Ask Agronomist'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 3. SECTION TABS & FILTER BAR */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--text-title)',
              }}
            >
              {isOfficer
                ? isGu
                  ? 'જિલ્લા ખેડૂત પ્રશ્ન નિકાલ ડેસ્ક'
                  : 'District Agronomist Advisory Desk'
                : isGu
                ? 'મારી કૃષિ પ્રશ્નોત્તરી અને માર્ગદર્શન'
                : 'My Farm Consultations & Agronomic Advice'}
            </h2>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '12px',
                backgroundColor: 'var(--green-wash)',
                color: 'var(--green-deep)',
              }}
            >
              {filteredQueries.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: filterStatus === 'all' ? '1px solid var(--green-primary)' : '1px solid var(--border-medium)',
                backgroundColor: filterStatus === 'all' ? 'var(--green-primary)' : '#ffffff',
                color: filterStatus === 'all' ? '#ffffff' : 'var(--text-title)',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isGu ? 'બધા' : 'All'}
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('Pending Review')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: filterStatus === 'Pending Review' ? '1px solid #e02424' : '1px solid var(--border-medium)',
                backgroundColor: filterStatus === 'Pending Review' ? '#e02424' : '#ffffff',
                color: filterStatus === 'Pending Review' ? '#ffffff' : 'var(--text-title)',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isGu ? 'બાકી સમીક્ષા' : 'Awaiting Review'}
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('Reviewed')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: filterStatus === 'Reviewed' ? '1px solid #0e9f6e' : '1px solid var(--border-medium)',
                backgroundColor: filterStatus === 'Reviewed' ? '#0e9f6e' : '#ffffff',
                color: filterStatus === 'Reviewed' ? '#ffffff' : 'var(--text-title)',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isGu ? 'સલાહ અપાયેલ' : 'Advisory Issued'}
            </button>
          </div>
        </div>

        {/* 4. QUERIES LISTING */}
        {loading ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--border-medium)',
            }}
          >
            <RefreshCw size={24} className="spin" color="var(--green-primary)" />
            <p style={{ marginTop: '0.75rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isGu ? 'પ્રશ્નો લોડ થઈ રહ્યા છે...' : 'Loading queries from MongoDB Atlas...'}
            </p>
          </div>
        ) : filteredQueries.length === 0 ? (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Sprout size={36} color="var(--green-primary)" style={{ opacity: 0.6 }} />
            <p style={{ margin: '0.5rem 0 0 0', fontWeight: 700, color: 'var(--text-title)' }}>
              {isGu ? 'કોઈ પ્રશ્નો મળ્યા નથી' : 'No consultations found in this category'}
            </p>
            <p style={{ margin: '4px 0 1rem 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isOfficer
                ? 'All district farmer queries have been reviewed and answered.'
                : 'Ask our agricultural officers for verified diagnostic support.'}
            </p>
            {!isOfficer && (
              <button
                type="button"
                onClick={() => setShowNewQueryModal(true)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--green-primary)',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {isGu ? 'પ્રશ્ન ઉમેરો' : 'Ask Question Now'}
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredQueries.map((item) => {
              const isReviewed = item.status === 'Reviewed';
              const isExpanded = expandedQueryId === item._id;

              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: isReviewed ? '1px solid #bcf0da' : '1px solid #f8b4b4',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Card Header / Summary */}
                  <div
                    onClick={() => setExpandedQueryId(isExpanded ? null : item._id)}
                    style={{
                      padding: '1.1rem 1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.85rem',
                      background: isReviewed
                        ? 'linear-gradient(to right, #ffffff, #fafdf9)'
                        : 'linear-gradient(to right, #ffffff, #fffdf8)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      {/* Leaf Photo Thumbnail */}
                      <img
                        src={resolveImageUrl(item.imageUrl) || '/images/cotton.jpeg'}
                        alt={item.crop}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          border: '1px solid var(--border-medium)',
                          flexShrink: 0,
                        }}
                      />

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: 'var(--green-wash)',
                              color: 'var(--green-deep)',
                            }}
                          >
                            {isGu && item.cropGu ? item.cropGu : item.crop}
                          </span>

                          <span
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              padding: '2px 7px',
                              borderRadius: '4px',
                              backgroundColor: isReviewed ? '#def7ec' : '#fde8e8',
                              color: isReviewed ? '#03543f' : '#9b1c1c',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            {isReviewed ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                            <span>
                              {isReviewed
                                ? isGu
                                  ? 'સત્તાવાર સલાહ ઉપલબ્ધ'
                                  : 'Advisory Issued'
                                : isGu
                                ? 'સમીક્ષા હેઠળ'
                                : 'Awaiting Review'}
                            </span>
                          </span>

                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {item.village ? `${item.village}, ${item.taluka || 'Padra'}` : 'Vadodara'}
                          </span>
                        </div>

                        <h3
                          style={{
                            margin: '4px 0 0 0',
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            color: 'var(--text-title)',
                          }}
                        >
                          {isGu && item.titleGu ? item.titleGu : item.title}
                        </h3>

                        <p
                          style={{
                            margin: '3px 0 0 0',
                            fontSize: '0.78rem',
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <span>By: <strong>{item.farmerName}</strong></span>
                          <span>•</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {/* Officer Quick Action Button */}
                      {isOfficer && !isReviewed && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRespondingToId(item._id);
                            setOfficerAdvice({
                              comment: '',
                              prescribedRemedy1: '',
                              prescribedRemedy2: '',
                            });
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--green-primary)',
                            color: '#ffffff',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                          }}
                        >
                          <Send size={12} />
                          <span>{isGu ? 'સલાહ આપો' : 'Write Advisory'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleDeleteQuery(item._id, e)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#9ca3af',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                        title="Delete query"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div style={{ color: 'var(--text-muted)' }}>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '1.25rem',
                        borderTop: '1px solid var(--border-subtle)',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {/* Farmer's Observation */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h4
                          style={{
                            margin: '0 0 0.35rem 0',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: 'var(--text-title)',
                          }}
                        >
                          {isGu ? 'ખેડૂતનું ખેતરીય નિરીક્ષણ:' : 'Farmer Field Observation:'}
                        </h4>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.86rem',
                            color: 'var(--text-secondary)',
                            lineHeight: 1.55,
                            backgroundColor: 'var(--bg-canvas)',
                            padding: '0.75rem',
                            borderRadius: '8px',
                          }}
                        >
                          {isGu && item.descriptionGu ? item.descriptionGu : item.description}
                        </p>
                      </div>

                      {/* Official Officer Response (If Reviewed) */}
                      {isReviewed && item.officerResponse && (
                        <div
                          style={{
                            borderRadius: '10px',
                            backgroundColor: '#f3faf5',
                            border: '1.5px solid #a7f3d0',
                            padding: '1rem',
                            marginTop: '0.85rem',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.65rem',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Shield size={18} color="var(--green-deep)" />
                              <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--green-deep)' }}>
                                {item.officerResponse.officerName || 'Dr. Hitesh Trivedi'}
                              </span>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '1px 6px',
                                  borderRadius: '3px',
                                  backgroundColor: '#d1fae5',
                                  color: '#065f46',
                                  fontWeight: 600,
                                }}
                              >
                                {item.officerResponse.officerBadge || 'GJ-VAD-AGRI-042'}
                              </span>
                            </div>

                            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                              {new Date(item.officerResponse.respondedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <p
                            style={{
                              margin: '0 0 0.75rem 0',
                              fontSize: '0.86rem',
                              color: '#1f2937',
                              lineHeight: 1.5,
                            }}
                          >
                            {isGu && item.officerResponse.commentGu
                              ? item.officerResponse.commentGu
                              : item.officerResponse.comment}
                          </p>

                          {item.officerResponse.prescribedRemedies?.length > 0 && (
                            <div>
                              <strong style={{ fontSize: '0.78rem', color: 'var(--green-deep)', textTransform: 'uppercase' }}>
                                {isGu ? 'ભલામણ કરેલ દવાઓ અને માત્રા:' : 'Prescribed Chemical / Organic Protocol:'}
                              </strong>
                              <ul
                                style={{
                                  margin: '0.35rem 0 0 0',
                                  paddingLeft: '1.25rem',
                                  fontSize: '0.84rem',
                                  color: '#374151',
                                }}
                              >
                                {item.officerResponse.prescribedRemedies.map((remedy, idx) => (
                                  <li key={idx} style={{ marginBottom: '3px' }}>
                                    {remedy}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* If Officer is viewing an unreviewed query, show response input inline */}
                      {isOfficer && respondingToId === item._id && (
                        <div
                          style={{
                            marginTop: '1rem',
                            padding: '1rem',
                            borderRadius: '10px',
                            backgroundColor: '#f7faf7',
                            border: '1.5px solid var(--green-primary)',
                          }}
                        >
                          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.88rem', color: 'var(--green-deep)', fontWeight: 800 }}>
                            {isGu ? 'સત્તાવાર કૃષિ સલાહ અને દવાઓની ભલામણ લખો' : 'Issue Official Government Agronomic Advisory'}
                          </h4>

                          <textarea
                            value={officerAdvice.comment}
                            onChange={(e) => setOfficerAdvice({ ...officerAdvice, comment: e.target.value })}
                            placeholder="Enter official diagnosis and instructions for the farmer..."
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '0.65rem',
                              borderRadius: '6px',
                              border: '1px solid var(--border-medium)',
                              fontSize: '0.85rem',
                              marginBottom: '0.65rem',
                              fontFamily: 'inherit',
                            }}
                            required
                          />

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <input
                              type="text"
                              value={officerAdvice.prescribedRemedy1}
                              onChange={(e) => setOfficerAdvice({ ...officerAdvice, prescribedRemedy1: e.target.value })}
                              placeholder="Remedy 1: e.g. Flonicamid 50 WG @ 3.5g/15L"
                              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                            />
                            <input
                              type="text"
                              value={officerAdvice.prescribedRemedy2}
                              onChange={(e) => setOfficerAdvice({ ...officerAdvice, prescribedRemedy2: e.target.value })}
                              placeholder="Remedy 2: e.g. Neem Oil 1500 ppm @ 30ml/15L"
                              style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.82rem' }}
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOfficerRespond(item._id)}
                              disabled={submittingResponse || !officerAdvice.comment}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: 'var(--green-primary)',
                                color: '#ffffff',
                                fontSize: '0.82rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              {submittingResponse ? 'Dispatching...' : 'Approve & Dispatch Advisory'}
                            </button>

                            <button
                              type="button"
                              onClick={() => setRespondingToId(null)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid var(--border-medium)',
                                backgroundColor: '#ffffff',
                                color: 'var(--text-muted)',
                                fontSize: '0.82rem',
                                cursor: 'pointer',
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. NEW QUERY MODAL (FOR FARMERS) */}
      {showNewQueryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(18, 38, 28, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 2200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowNewQueryModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)',
              border: '1px solid var(--border-medium)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(to right, #f7f9f5, #eef3e8)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sprout size={20} color="var(--green-primary)" />
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                  {isGu ? 'કૃષિ અધિકારીને નવો પ્રશ્ન પૂછો' : 'Consult District Agricultural Officer'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowNewQueryModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateQuery} style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {isGu ? 'મુખ્ય પાક' : 'Crop Type'}
                </label>
                <select
                  value={newQuery.crop}
                  onChange={(e) => setNewQuery({ ...newQuery, crop: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem' }}
                >
                  <option value="Cotton">Cotton (કપાસ)</option>
                  <option value="Tomato">Tomato (ટામેટા)</option>
                  <option value="Castor">Castor (દિવેલા/એરંડા)</option>
                  <option value="Pigeon Pea">Pigeon Pea (તુવેર)</option>
                  <option value="Okra">Okra (ભીંડા)</option>
                </select>
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {isGu ? 'પ્રશ્નનું શીર્ષક' : 'Inquiry Headline'}
                </label>
                <input
                  type="text"
                  value={newQuery.title}
                  onChange={(e) => setNewQuery({ ...newQuery, title: e.target.value })}
                  placeholder="e.g. Leaf yellowing and sudden curling after rain"
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid var(--border-medium)', fontSize: '0.86rem' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '0.85rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {isGu ? 'પાંદડાનો ફોટો પસંદ કરો' : 'Attach Leaf Sample Photo'}
                </label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[
                    { id: 'cotton', label: 'Cotton', img: '/images/cotton.jpeg' },
                    { id: 'tomato', label: 'Tomato', img: '/images/tomato.jpg' },
                    { id: 'castor', label: 'Castor', img: '/images/castor.png' },
                    { id: 'pigeon_pea', label: 'Pigeon Pea', img: '/images/pigeon_pea.jpg' },
                    { id: 'okra', label: 'Okra', img: '/images/okra.png' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setNewQuery({ ...newQuery, imageUrl: s.img, crop: s.label })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: newQuery.imageUrl === s.img ? '2px solid var(--green-primary)' : '1px solid var(--border-medium)',
                        backgroundColor: newQuery.imageUrl === s.img ? 'var(--green-wash)' : '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      <img src={s.img} alt={s.label} style={{ width: '20px', height: '20px', borderRadius: '4px', objectFit: 'cover' }} />
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  {isGu ? 'વિગતવાર લક્ષણો અને અવલોકન' : 'Field Symptoms & Observations'}
                </label>
                <textarea
                  value={newQuery.description}
                  onChange={(e) => setNewQuery({ ...newQuery, description: e.target.value })}
                  placeholder="Describe leaf symptoms, pest activity, soil moisture, and duration..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.86rem',
                    fontFamily: 'inherit',
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingQuery}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--green-primary)',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  cursor: submittingQuery ? 'not-allowed' : 'pointer',
                }}
              >
                {submittingQuery
                  ? isGu
                    ? 'મોકલાઈ રહ્યું છે...'
                    : 'Submitting...'
                  : isGu
                  ? 'કૃષિ અધિકારીને મોકલો'
                  : 'Submit to District Officer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
