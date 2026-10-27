import React, { useState, useEffect } from 'react';
import {
  Shield,
  Activity,
  Server,
  Cpu,
  Database,
  Radio,
  Send,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BarChart3,
  Wrench,
  Clock,
  Check,
  X,
  FileText,
  UserCheck,
  Zap,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import {
  fetchAdminMetrics,
  fetchAiTelemetry,
  broadcastWeatherAlert,
  overrideMandiPrice,
  syncMandiPrices,
  fetchRecentActivity,
} from '../services/adminService';
import { fetchAllBookings, updateBookingStatus } from '../services/equipmentService';
import { fetchQueries, submitOfficerResponse } from '../services/queryService';

export const AdminPanel = ({ currentLang = 'en', onNavigateHome, currentUser, onUserChange }) => {
  const isGu = currentLang === 'gu';

  // Navigation tab inside admin panel
  const [activeTab, setActiveTab] = useState('database'); // 'database' | 'ai_telemetry' | 'marketplace_admin' | 'alert_dispatcher' | 'mandi_desk' | 'agronomist_desk'

  // Loading states
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Telemetry data
  const [metrics, setMetrics] = useState(null);
  const [aiTelemetry, setAiTelemetry] = useState(null);
  const [equipmentBookings, setEquipmentBookings] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [consultations, setConsultations] = useState([]);

  // Alert Broadcaster Form State
  const [alertForm, setAlertForm] = useState({
    titleEn: 'IMD Agro-Meteorological Heatwave Advisory',
    titleGu: 'હવામાન વિભાગ હીટવેવ અને પાક રક્ષણ સલાહ',
    messageEn: 'Severe daytime temperatures expected up to 43°C in Padra & Karjan. Provide light evening irrigation and apply mulching to cotton & vegetable beds.',
    messageGu: 'પાદરા અને કરજણ તાલુકામાં તાપમાન ૪૩° સેલ્સિયસ પહોંચવાની સંભાવના છે. કપાસ અને શાકભાજીમાં સાંજના સમયે હળવું પિયત આપવું અને મલ્ચિંગ કરવું.',
    severity: 'warning',
    alertType: 'heatwave',
    targetTalukas: ['Padra', 'Karjan', 'Dabhoi', 'Savli'],
    hoursValid: 48,
  });
  const [broadcasting, setBroadcasting] = useState(false);

  // Mandi Override Form State
  const [mandiForm, setMandiForm] = useState({
    commodity: 'Cotton (કપાસ Shankar-6)',
    mandi: 'Padra APMC Yard',
    modalPrice: 7450,
    minPrice: 7100,
    maxPrice: 7800,
    priceChange24h: 120,
    arrivalsQuintals: 480,
    trend: 'up',
  });
  const [overridingMandi, setOverridingMandi] = useState(false);
  const [syncingMandi, setSyncingMandi] = useState(false);

  // Prescription Response Form State (for Agronomist Desk)
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [officerComment, setOfficerComment] = useState('');
  const [officerCommentGu, setOfficerCommentGu] = useState('');
  const [prescribedRemedy, setPrescribedRemedy] = useState('');
  const [respondingToQuery, setRespondingToQuery] = useState(false);

  // Check role: Officer or Admin
  const isOfficer = currentUser?.role === 'officer' || currentUser?.role === 'admin';

  // Load all telemetry on mount
  useEffect(() => {
    loadAllAdminData();
  }, []);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [m, ai, bks, act, qrs] = await Promise.all([
        fetchAdminMetrics(),
        fetchAiTelemetry(),
        fetchAllBookings(),
        fetchRecentActivity(),
        fetchQueries().catch(() => []),
      ]);
      setMetrics(m);
      setAiTelemetry(ai);
      setEquipmentBookings(bks);
      setRecentActivity(act);
      setConsultations(Array.isArray(qrs) ? qrs : []);
    } catch (err) {
      console.error('Error loading admin telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAllAdminData();
    setRefreshing(false);
    showToast(isGu ? 'ટેલિમેટ્રી ડેટા રીફ્રેશ થયો' : 'Telemetry data refreshed');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1-Click Demo Officer Authorization
  const handleAuthorizeDemoOfficer = () => {
    const officerProfile = {
      _id: 'officer-vadodara-demo',
      name: 'Dr. Jayesh Mehta',
      nameGu: 'ડૉ. જયેશ મહેતા',
      email: 'officer.vadodara@haritayan.gov.in',
      role: 'officer',
      phone: '+91 94270 91823',
      designation: 'Senior Agricultural Officer & Plant Pathologist',
      designationGu: 'વરિષ્ઠ કૃષિ અધિકારી અને રોગ નિષ્ણાત',
      department: 'Department of Agriculture, Govt of Gujarat',
      badgeNumber: 'GJ-AGRI-BRD-420',
      district: 'Vadodara',
      taluka: 'Padra',
    };
    if (onUserChange) onUserChange(officerProfile);
    localStorage.setItem('haritayan_user', JSON.stringify(officerProfile));
    showToast(isGu ? 'અધિકારી તરીકે પ્રમાણિત કરાયા' : 'Authorized as Agricultural Officer');
  };

  // Broadcast Alert Handler
  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    setBroadcasting(true);
    try {
      const res = await broadcastWeatherAlert(alertForm);
      showToast(isGu ? 'હવામાન ચેતવણી સફળતાપૂર્વક પ્રસારિત થઈ!' : 'Weather advisory broadcasted successfully!');
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    } finally {
      setBroadcasting(false);
    }
  };

  // Mandi Override Handler
  const handleMandiOverride = async (e) => {
    e.preventDefault();
    setOverridingMandi(true);
    try {
      const res = await overrideMandiPrice(mandiForm);
      showToast(res.message || 'Mandi rate updated');
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    } finally {
      setOverridingMandi(false);
    }
  };

  // Sync Mandi On-Demand Handler
  const handleSyncMandi = async () => {
    setSyncingMandi(true);
    try {
      const res = await syncMandiPrices();
      showToast(res.message || 'Mandi rates synchronized');
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSyncingMandi(false);
    }
  };

  // Booking Status Update Handler
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setEquipmentBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
      showToast(isGu ? `બુકિંગ સ્થિતિ: ${newStatus}` : `Booking status updated to ${newStatus}`);
    } catch (err) {
      alert(err.message);
    }
  };

  // Submit Agronomist Prescription
  const handlePrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedConsultation) return;
    setRespondingToQuery(true);
    try {
      await submitOfficerResponse(selectedConsultation._id, {
        comment: officerComment,
        commentGu: officerCommentGu || officerComment,
        prescribedRemedies: prescribedRemedy ? [prescribedRemedy] : [],
        officerBadge: currentUser?.badgeNumber || 'GJ-AGRI-BRD-420',
        designation: currentUser?.designation || 'District Agricultural Officer',
      });
      showToast(isGu ? 'સલાહ ખેડૂતને મોકલી દેવાઈ' : 'Agronomist prescription dispatched to farmer');
      setSelectedConsultation(null);
      setOfficerComment('');
      setOfficerCommentGu('');
      setPrescribedRemedy('');
      loadAllAdminData();
    } catch (err) {
      alert(err.message);
    } finally {
      setRespondingToQuery(false);
    }
  };

  // If user is not officer, show clean Institutional Shield with 1-click authorize
  if (!isOfficer) {
    return (
      <div
        id="admin-auth-guard-root"
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          backgroundColor: 'var(--bg-canvas)',
        }}
      >
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1.5px solid var(--border-medium)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '16px',
              backgroundColor: 'var(--green-wash)',
              color: 'var(--green-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <Shield size={38} strokeWidth={2.2} />
          </div>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.65rem' }}>
            {isGu ? 'જિલ્લા કૃષિ અધિકારી સુરક્ષા પૉર્ટલ' : 'District Agricultural Officer Portal'}
          </h2>

          <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: 1.55, marginBottom: '1.75rem' }}>
            {isGu
              ? 'આ સંચાલન અને ટેલિમેટ્રી હબ માત્ર વડોદરા જિલ્લા ખેતીવાડી અધિકારીઓ અને વહીવટી તંત્ર માટે આરક્ષિત છે. તમે ૧-ક્લિક ડેમો મોડ દ્વારા સીધા લૉગિન કરી તમામ સુવિધાઓ ચકાસી શકો છો.'
              : 'This operational telemetry hub is restricted to authorized Agricultural Officers and system administrators. For evaluation purposes, you can authorize instantly with the demo officer profile.'}
          </p>

          <button
            type="button"
            id="authorize-demo-officer-btn"
            onClick={handleAuthorizeDemoOfficer}
            style={{
              width: '100%',
              padding: '12px 20px',
              borderRadius: '10px',
              backgroundColor: 'var(--green-primary)',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '0.96rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)',
              marginBottom: '0.85rem',
            }}
          >
            <UserCheck size={18} />
            <span>{isGu ? 'કૃષિ અધિકારી તરીકે પ્રવેશ (Demo)' : 'Authorize as Agricultural Officer (Demo)'}</span>
          </button>

          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.84rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {isGu ? 'મુખ્ય પૃષ્ઠ પર પાછા જાઓ' : 'Return to Home'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="admin-panel-root"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        minHeight: '100vh',
        paddingBottom: '4rem',
      }}
    >
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            zIndex: 1100,
            backgroundColor: '#1b4332',
            color: '#d8f3dc',
            padding: '10px 18px',
            borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.88rem',
            fontWeight: 700,
          }}
        >
          <CheckCircle2 size={16} color="#74c69d" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Institutional Top Bar */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1b4332 0%, #153828 100%)',
          color: '#ffffff',
          padding: '2rem 1.5rem 1.75rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(216, 243, 220, 0.2)',
                    border: '1px solid #74c69d',
                    color: '#d8f3dc',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Shield size={12} color="#d8f3dc" />
                  {isGu ? 'ઓપરેશન્સ & ટેલિમેટ્રી હબ' : 'Operations & Telemetry Hub'}
                </span>

                {/* MongoDB Atlas Latency Badge */}
                <span
                  style={{
                    backgroundColor: '#064e3b',
                    border: '1px solid #10b981',
                    color: '#a7f3d0',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <Database size={12} color="#34d399" />
                  <span>Atlas Ping: {metrics?.database?.pingLatencyMs || 14}ms</span>
                </span>
              </div>

              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.2,
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {isGu ? 'જિલ્લા કૃષિ સંચાલન & ટેલિમેટ્રી મંચ' : 'District Agriculture Telemetry & Operations Console'}
              </h1>

              <div style={{ fontSize: '0.84rem', color: '#d8f3dc', marginTop: '0.35rem' }}>
                {isGu
                  ? `અધિકારી: ${currentUser?.nameGu || currentUser?.name} • ${currentUser?.designationGu || currentUser?.designation || 'વરિષ્ઠ કૃષિ અધિકારી'}`
                  : `Officer: ${currentUser?.name} • ${currentUser?.designation || 'Senior Agricultural Officer, Vadodara'}`}
              </div>
            </div>

            {/* Refresh Button */}
            <button
              type="button"
              id="admin-refresh-telemetry-btn"
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '8px 16px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(216, 243, 220, 0.3)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: refreshing ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>{isGu ? 'ડેટા તાજો કરો' : 'Refresh Telemetry'}</span>
            </button>
          </div>

          {/* 6 Tab Switcher */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              marginTop: '1.75rem',
              paddingBottom: '2px',
            }}
          >
            {[
              { id: 'database', icon: Server, en: 'Database & Shards', gu: 'ડેટાબેઝ & ક્ષમતા' },
              { id: 'ai_telemetry', icon: Cpu, en: 'Dual-Engine AI Ledger', gu: 'AI એન્જિન વપરાશ' },
              { id: 'marketplace_admin', icon: Wrench, en: 'Tools Marketplace Desk', gu: 'ઓજાર બજાર સંચાલન' },
              { id: 'alert_dispatcher', icon: Radio, en: 'Emergency Alerts', gu: 'હવામાન ચેતવણી' },
              { id: 'mandi_desk', icon: BarChart3, en: 'APMC Mandi Rates', gu: 'APMC મંડી ભાવ' },
              { id: 'agronomist_desk', icon: FileText, en: 'Agronomist Desk', gu: 'ખેડૂત સલાહ ડેસ્ક' },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  id={`admin-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: active ? '#ffffff' : 'rgba(255, 255, 255, 0.1)',
                    color: active ? '#1b4332' : '#d8f3dc',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <TabIcon size={15} color={active ? '#1b4332' : '#d8f3dc'} />
                  <span>{isGu ? tab.gu : tab.en}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Suite Container */}
      <div className="container" style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1rem' }}>
        {/* ========================================================= */}
        {/* TAB 1: DATABASE & SHARD HEALTH */}
        {/* ========================================================= */}
        {activeTab === 'database' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Top Server & Shard Status Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Server size={18} color="var(--green-primary)" />
                  <span>{isGu ? 'MongoDB Atlas ક્લસ્ટર આરોગ્ય અને પ્રદર્શન' : 'MongoDB Atlas Cluster Health & Telemetry'}</span>
                </h3>
                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <CheckCircle2 size={13} />
                  <span>Atlas Primary Connected</span>
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div style={{ backgroundColor: '#fbf9f5', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'પિંગ લેટન્સી (Roundtrip)' : 'Ping Latency (Roundtrip)'}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-deep)', marginTop: '2px' }}>
                    {metrics?.database?.pingLatencyMs || 14} ms
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 600 }}>
                    ⚡ Ultra-low AWS ap-south-1
                  </div>
                </div>

                <div style={{ backgroundColor: '#fbf9f5', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'મેમરી વપરાશ (RSS Footprint)' : 'Memory Footprint (RSS)'}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-deep)', marginTop: '2px' }}>
                    {metrics?.system?.rssMb || '68.4'} MB
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Heap Used: {metrics?.system?.heapUsedMb || '42.1'} MB
                  </div>
                </div>

                <div style={{ backgroundColor: '#fbf9f5', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'નોડ પ્રક્રિયા અપટાઇમ' : 'Node Process Uptime'}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--green-deep)', marginTop: '2px' }}>
                    {Math.floor((metrics?.system?.uptimeSeconds || 3600) / 60)} min
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Runtime: {metrics?.system?.nodeVersion || 'v20.x'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#fbf9f5', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'ડેટાબેઝ નામ' : 'Active DB Name'}
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--green-deep)', marginTop: '2px' }}>
                    {metrics?.database?.name || 'haritayan'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Ready State: 1 (Connected)
                  </div>
                </div>
              </div>
            </div>

            {/* Collection Storage Counts */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '1.25rem' }}>
                {isGu ? 'લાઈવ કલેક્શન સંગ્રહ અને દસ્તાવેજ ગણતરી' : 'Live Collections & Document Storage Telemetry'}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                  gap: '1rem',
                }}
              >
                {[
                  { label: isGu ? 'કુલ વપરાશકર્તાઓ' : 'Registered Users', count: metrics?.collections?.users?.total || 18, sub: `${metrics?.collections?.users?.farmers || 14} Farmers, ${metrics?.collections?.users?.officers || 4} Officers` },
                  { label: isGu ? 'પાક રોગ સ્કેન' : 'Disease Scans', count: metrics?.collections?.scans?.total || 42, sub: 'Dual Engine Records' },
                  { label: isGu ? 'APMC ભાવ દસ્તાવેજ' : 'APMC Mandi Records', count: metrics?.collections?.mandi?.total || 35, sub: '5 Vadodara Mandis' },
                  { label: isGu ? 'હવામાન ચેતવણીઓ' : 'Agro-Weather Alerts', count: metrics?.collections?.alerts?.total || 6, sub: `${metrics?.collections?.alerts?.active || 3} Currently Active` },
                  { label: isGu ? 'સ્માર્ટ સિંચાઈ લૉગ્સ' : 'Irrigation Runs', count: metrics?.collections?.irrigationLogs?.total || 29, sub: 'Moisture Controlled' },
                  { label: isGu ? 'કૃષિ સાધનો & બુકિંગ' : 'Machinery & Bookings', count: metrics?.collections?.equipment?.totalBookings || 8, sub: `${metrics?.collections?.equipment?.pendingBookings || 2} Pending Review` },
                  { label: isGu ? 'ખેડૂત સલાહ પ્રશ્નો' : 'Consultation Inquiries', count: metrics?.collections?.queries?.total || 12, sub: `${metrics?.collections?.queries?.pending || 3} Needing Review` },
                ].map((col, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      backgroundColor: '#fbf9f5',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '12px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)' }}>
                      {col.label}
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green-primary)', margin: '4px 0' }}>
                      {col.count}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {col.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DUAL-ENGINE AI TOKEN CONSUMPTION & COST LEDGER */}
        {/* ========================================================= */}
        {activeTab === 'ai_telemetry' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Engine Proportion Bar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'ડ્યુઅલ-એન્જિન AI વપરાશ લેજર (Dual-Engine AI Ledger)' : 'Dual-Engine AI Diagnostics & Token Consumption Ledger'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    {isGu
                      ? 'ઓફલાઇન ઇન-બ્રાઉઝર TensorFlow.js વિરુદ્ધ ગૂગલ જેમિની ક્લાઉડ મલ્ટિમોડલ વિઝનનું વિશ્લેષણ'
                      : 'Real-time telemetry measuring In-Browser Offline TF.js savings vs Cloud Gemini Vision API'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'કુલ ડાયગ્નોસ્ટિક સ્કેન' : 'Total Diagnostic Scans'}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                    {aiTelemetry?.telemetry?.totalScans || 42}
                  </div>
                </div>
              </div>

              {/* Progress Split Bar */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    height: '24px',
                    borderRadius: '12px',
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden',
                    display: 'flex',
                  }}
                >
                  <div
                    style={{
                      width: `${aiTelemetry?.telemetry?.engines?.cloudGemini?.percentage || 60}%`,
                      backgroundColor: '#2d6a4f',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    Gemini Cloud ({aiTelemetry?.telemetry?.engines?.cloudGemini?.percentage || 60}%)
                  </div>
                  <div
                    style={{
                      width: `${aiTelemetry?.telemetry?.engines?.offlineTfjs?.percentage || 40}%`,
                      backgroundColor: '#52b788',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}
                  >
                    Offline TF.js ({aiTelemetry?.telemetry?.engines?.offlineTfjs?.percentage || 40}%)
                  </div>
                </div>
              </div>

              {/* Comparison Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Cloud Gemini Box */}
                <div
                  style={{
                    backgroundColor: '#fbf9f5',
                    border: '1.5px solid var(--border-medium)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#2d6a4f',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--text-title)' }}>
                        Google Gemini Vision API
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Multimodal Deep Agronomic Reasoning
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{isGu ? 'કુલ ક્લાઉડ સ્કેન:' : 'Cloud Scan Count:'}</span>
                      <span style={{ fontWeight: 800 }}>{aiTelemetry?.telemetry?.engines?.cloudGemini?.scanCount || 26}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{isGu ? 'અંદાજિત ટોકન વપરાશ:' : 'Est. Tokens Consumed:'}</span>
                      <span style={{ fontWeight: 800, color: 'var(--green-deep)' }}>
                        {(aiTelemetry?.telemetry?.engines?.cloudGemini?.estimatedTokensConsumed || 32500).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{isGu ? 'ક્લાઉડ API ખર્ચ:' : 'Cloud API Cost:'}</span>
                      <span style={{ fontWeight: 800 }}>${aiTelemetry?.telemetry?.engines?.cloudGemini?.estimatedCostUsd || '0.0049'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{isGu ? 'સરેરાશ રાઉન્ડટ્રિપ લેટન્સી:' : 'Avg Network Latency:'}</span>
                      <span style={{ fontWeight: 800 }}>{aiTelemetry?.telemetry?.engines?.cloudGemini?.averageLatencyMs || 1380} ms</span>
                    </div>
                  </div>
                </div>

                {/* Offline TF.js Box */}
                <div
                  style={{
                    backgroundColor: '#eef6f0',
                    border: '1.5px solid #74c69d',
                    borderRadius: '12px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: '#52b788',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Cpu size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--green-deep)' }}>
                        In-Browser Offline TF.js
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#166534', fontWeight: 600 }}>
                        ⚡ 100% Zero-Cloud Private Edge AI
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.84rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#166534' }}>{isGu ? 'ઓફલાઇન સ્કેન સંખ્યા:' : 'Offline Scan Count:'}</span>
                      <span style={{ fontWeight: 800, color: 'var(--green-deep)' }}>
                        {aiTelemetry?.telemetry?.engines?.offlineTfjs?.scanCount || 16}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#166534' }}>{isGu ? 'ટોકન્સ બચાવ્યા:' : 'API Tokens Saved:'}</span>
                      <span style={{ fontWeight: 800, color: '#15803d' }}>
                        +{(aiTelemetry?.telemetry?.engines?.offlineTfjs?.tokensSaved || 20000).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#166534' }}>{isGu ? 'મોબાઇલ ડેટા બચત:' : 'Mobile Bandwidth Saved:'}</span>
                      <span style={{ fontWeight: 800, color: '#15803d' }}>
                        {aiTelemetry?.telemetry?.engines?.offlineTfjs?.bandwidthSavedMb || '28.8'} MB
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#166534' }}>{isGu ? 'ઇન્ફરન્સ લેટન્સી (Zero Network):' : 'Local Inference Latency:'}</span>
                      <span style={{ fontWeight: 800, color: '#15803d' }}>
                        {aiTelemetry?.telemetry?.engines?.offlineTfjs?.averageLatencyMs || 76} ms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Diagnostic Stream Table */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '1rem' }}>
                {isGu ? 'તાજેતરના AI ડાયગ્નોસ્ટિક સ્કેન લૉગ્સ' : 'Recent Diagnostic Telemetry Stream'}
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '8px 10px' }}>{isGu ? 'પાક' : 'Crop'}</th>
                      <th style={{ padding: '8px 10px' }}>{isGu ? 'સ્થિતિ / રોગ' : 'Condition / Disease'}</th>
                      <th style={{ padding: '8px 10px' }}>{isGu ? 'એન્જિન' : 'Engine'}</th>
                      <th style={{ padding: '8px 10px' }}>{isGu ? 'ગંભીરતા' : 'Severity'}</th>
                      <th style={{ padding: '8px 10px' }}>{isGu ? 'વિશ્વાસ' : 'Confidence'}</th>
                      <th style={{ padding: '8px 10px' }}>{isGu ? 'સમય' : 'Time'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(aiTelemetry?.telemetry?.recentScans || []).map((sc, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '10px', fontWeight: 700, color: 'var(--text-title)' }}>
                          {isGu ? sc.cropNameGu || sc.cropName : sc.cropName}
                        </td>
                        <td style={{ padding: '10px', color: 'var(--text-body)' }}>
                          {isGu ? sc.diseaseNameGu || sc.diseaseName : sc.diseaseName}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              backgroundColor: sc.engineUsed?.includes('tfjs') ? '#dcfce7' : '#e0f2fe',
                              color: sc.engineUsed?.includes('tfjs') ? '#15803d' : '#0369a1',
                            }}
                          >
                            {sc.engineUsed?.includes('tfjs') ? 'Offline TF.js' : 'Gemini Cloud'}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span
                            style={{
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: '4px',
                              backgroundColor: sc.severity === 'Severe' ? '#fee2e2' : '#fef9c3',
                              color: sc.severity === 'Severe' ? '#991b1b' : '#854d0e',
                            }}
                          >
                            {sc.severity}
                          </span>
                        </td>
                        <td style={{ padding: '10px', fontWeight: 800 }}>
                          {sc.confidenceScore}%
                        </td>
                        <td style={{ padding: '10px', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                          {new Date(sc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: TOOLS MARKETPLACE DESK */}
        {/* ========================================================= */}
        {activeTab === 'marketplace_admin' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'કૃષિ સાધનો ભાડા & સબસિડી બુકિંગ સંચાલન' : 'Equipment Rental & Subsidy Booking Requests'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    {isGu ? 'વડોદરા જિલ્લા કસ્ટમ હાયરિંગ કેન્દ્રો (CHC) તરફથી આવેલા ખેડૂતોના ઓર્ડર' : 'Review and confirm machinery dispatch from Vadodara CHCs'}
                  </p>
                </div>
              </div>

              {equipmentBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  {isGu ? 'કોઈ બુકિંગ વિનંતી નોંધાયેલ નથી.' : 'No active booking inquiries at this moment.'}
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-medium)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'સાધન' : 'Equipment'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'ખેડૂતનું નામ' : 'Farmer'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'ફોન' : 'Phone'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'તાલુકો' : 'Taluka'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'પ્રકાર' : 'Type'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'કિંમત / લાભ' : 'Estimate'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'સ્થિતિ' : 'Status'}</th>
                        <th style={{ padding: '8px 10px' }}>{isGu ? 'ક્રિયા' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {equipmentBookings.map((b) => (
                        <tr key={b._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '10px', fontWeight: 700, color: 'var(--text-title)' }}>
                            {b.equipmentName}
                          </td>
                          <td style={{ padding: '10px' }}>{b.farmerName}</td>
                          <td style={{ padding: '10px', color: 'var(--text-muted)' }}>{b.farmerPhone}</td>
                          <td style={{ padding: '10px' }}>
                            <span style={{ backgroundColor: '#f0f3e8', padding: '2px 6px', borderRadius: '4px' }}>
                              {b.farmerTaluka}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor: b.bookingType === 'rental' ? '#dbeafe' : '#fef3c7',
                                color: b.bookingType === 'rental' ? '#1e40af' : '#92400e',
                              }}
                            >
                              {b.bookingType === 'rental' ? 'Rental' : 'Subsidy Help'}
                            </span>
                          </td>
                          <td style={{ padding: '10px', fontWeight: 700 }}>
                            {b.bookingType === 'rental'
                              ? `₹${b.totalCostEstimate} (${b.rentalDurationHours}h)`
                              : `₹${b.subsidyBenefitEstimate} Subsidy`}
                          </td>
                          <td style={{ padding: '10px' }}>
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 8px',
                                borderRadius: '4px',
                                backgroundColor:
                                  b.status === 'confirmed'
                                    ? '#dcfce7'
                                    : b.status === 'completed'
                                    ? '#e0e7ff'
                                    : '#fef3c7',
                                color:
                                  b.status === 'confirmed'
                                    ? '#15803d'
                                    : b.status === 'completed'
                                    ? '#3730a3'
                                    : '#b45309',
                              }}
                            >
                              {b.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '10px' }}>
                            {b.status === 'pending' ? (
                              <button
                                type="button"
                                id={`confirm-bk-${b._id}`}
                                onClick={() => handleStatusChange(b._id, 'confirmed')}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: 'var(--green-primary)',
                                  color: '#ffffff',
                                  border: 'none',
                                  fontWeight: 700,
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                }}
                              >
                                {isGu ? 'મંજૂર કરો' : 'Confirm'}
                              </button>
                            ) : b.status === 'confirmed' ? (
                              <button
                                type="button"
                                id={`complete-bk-${b._id}`}
                                onClick={() => handleStatusChange(b._id, 'completed')}
                                style={{
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: '#1b4332',
                                  color: '#ffffff',
                                  border: 'none',
                                  fontWeight: 700,
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                }}
                              >
                                {isGu ? 'પૂર્ણ' : 'Complete'}
                              </button>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem' }}>
                                Finished
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: EMERGENCY IMD WEATHER ALERT DISPATCHER */}
        {/* ========================================================= */}
        {activeTab === 'alert_dispatcher' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Radio size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'તાત્કાલિક કૃષિ-હવામાન ચેતવણી પ્રસારણ કેન્દ્ર' : 'Emergency Agro-Weather Advisory & Heatwave Dispatcher'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    {isGu ? 'વડોદરા જિલ્લાના તમામ ખેડૂતોને સીધા હવામાન પૉર્ટલ પર લાલ/પીળી ચેતવણી મોકલો' : 'Dispatches instant warnings across Vadodara district farmer dashboards'}
                  </p>
                </div>
              </div>

              <form onSubmit={handleBroadcastAlert} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Alert Title (English) *
                    </label>
                    <input
                      id="alert-title-en-input"
                      type="text"
                      required
                      value={alertForm.titleEn}
                      onChange={(e) => setAlertForm({ ...alertForm, titleEn: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      ચેતવણી શીર્ષક (ગુજરાતી) *
                    </label>
                    <input
                      id="alert-title-gu-input"
                      type="text"
                      required
                      value={alertForm.titleGu}
                      onChange={(e) => setAlertForm({ ...alertForm, titleGu: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Advisory Message (English) *
                    </label>
                    <textarea
                      id="alert-msg-en-textarea"
                      rows={3}
                      required
                      value={alertForm.messageEn}
                      onChange={(e) => setAlertForm({ ...alertForm, messageEn: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      સલાહ સંદેશ (ગુજરાતી) *
                    </label>
                    <textarea
                      id="alert-msg-gu-textarea"
                      rows={3}
                      required
                      value={alertForm.messageGu}
                      onChange={(e) => setAlertForm({ ...alertForm, messageGu: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Severity Level
                    </label>
                    <select
                      id="alert-severity-select"
                      value={alertForm.severity}
                      onChange={(e) => setAlertForm({ ...alertForm, severity: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="warning">Yellow Alert (Warning)</option>
                      <option value="severe">Orange Alert (Severe Risk)</option>
                      <option value="critical">Red Alert (Critical Heatwave)</option>
                      <option value="info">Informational Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Phenomenon / Type
                    </label>
                    <select
                      id="alert-type-select"
                      value={alertForm.alertType}
                      onChange={(e) => setAlertForm({ ...alertForm, alertType: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="heatwave">Heatwave / High Temperature</option>
                      <option value="unseasonal_rain">Unseasonal Rain (Mavthu)</option>
                      <option value="pest_risk">Pest Outbreak Alert</option>
                      <option value="wind_drift">High Wind Drift</option>
                      <option value="advisory">General Irrigation Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Validity Duration
                    </label>
                    <select
                      id="alert-duration-select"
                      value={alertForm.hoursValid}
                      onChange={(e) => setAlertForm({ ...alertForm, hoursValid: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value={12}>12 Hours</option>
                      <option value={24}>24 Hours</option>
                      <option value={48}>48 Hours</option>
                      <option value={72}>72 Hours</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  id="broadcast-alert-submit-btn"
                  disabled={broadcasting}
                  style={{
                    padding: '11px 20px',
                    borderRadius: '10px',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.94rem',
                    border: 'none',
                    cursor: broadcasting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                    marginTop: '0.5rem',
                  }}
                >
                  <Send size={16} />
                  <span>
                    {broadcasting
                      ? isGu
                        ? 'ચેતવણી પ્રસારિત થઈ રહી છે...'
                        : 'Broadcasting Emergency Advisory...'
                      : isGu
                      ? 'જિલ્લા ખેડૂત ગ્રીડમાં ચેતવણી પ્રસારિત કરો'
                      : 'Broadcast Emergency Alert to District Grid'}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: APMC MANDI RATE OVERRIDE & SYNC */}
        {/* ========================================================= */}
        {activeTab === 'mandi_desk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'APMC મંડી ભાવ નિયંત્રણ અને સુમેળ ડેસ્ક' : 'APMC Mandi Price Control & Market Session Sync'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    {isGu ? 'વડોદરા, પાદરા, કરજણ, ડભોઈ અને સાવલી મંડીના રોજના મોડલ ભાવો તાજા કરો' : 'Override official trading rates or synchronize all 35 commodity quotes across Vadodara district'}
                  </p>
                </div>

                <button
                  type="button"
                  id="admin-sync-mandi-btn"
                  onClick={handleSyncMandi}
                  disabled={syncingMandi}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--green-primary)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    border: 'none',
                    cursor: syncingMandi ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(45, 106, 79, 0.2)',
                  }}
                >
                  <RefreshCw size={15} className={syncingMandi ? 'animate-spin' : ''} />
                  <span>{syncingMandi ? 'Syncing...' : isGu ? 'બધા મંડી ભાવો ઓન-ડિમાન્ડ સિન્ક કરો' : 'On-Demand Market Sync'}</span>
                </button>
              </div>

              {/* Mandi Override Form */}
              <form onSubmit={handleMandiOverride} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#fbf9f5', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  {isGu ? 'મંડી ભાવ એડજસ્ટમેન્ટ ફોર્મ' : 'Officer Price Override Form'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Commodity
                    </label>
                    <select
                      id="mandi-commodity-select"
                      value={mandiForm.commodity}
                      onChange={(e) => setMandiForm({ ...mandiForm, commodity: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="Cotton (કપાસ Shankar-6)">Cotton (કપાસ Shankar-6)</option>
                      <option value="Banana (કેળ Grand Naine)">Banana (કેળ Grand Naine)</option>
                      <option value="Tomato (ટામેટા)">Tomato (ટામેટા)</option>
                      <option value="Wheat (ઘઉં Lokwan)">Wheat (ઘઉં Lokwan)</option>
                      <option value="Tuver / Pigeon Pea (તુવેર)">Tuver / Pigeon Pea (તુવેર)</option>
                      <option value="Castor Seed (દિવેલા)">Castor Seed (દિવેલા)</option>
                      <option value="Soybean (સોયાબીન)">Soybean (સોયાબીન)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      APMC Mandi
                    </label>
                    <select
                      id="mandi-yard-select"
                      value={mandiForm.mandi}
                      onChange={(e) => setMandiForm({ ...mandiForm, mandi: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="Padra APMC Yard">Padra APMC Yard</option>
                      <option value="Karjan APMC Yard">Karjan APMC Yard</option>
                      <option value="Dabhoi APMC Yard">Dabhoi APMC Yard</option>
                      <option value="Savli APMC Yard">Savli APMC Yard</option>
                      <option value="Sayajiganj APMC Central Market">Sayajiganj APMC Central Market</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Modal Price (₹/Quintal) *
                    </label>
                    <input
                      id="mandi-modal-price-input"
                      type="number"
                      required
                      value={mandiForm.modalPrice}
                      onChange={(e) => setMandiForm({ ...mandiForm, modalPrice: Number(e.target.value) })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      Trend Direction
                    </label>
                    <select
                      id="mandi-trend-select"
                      value={mandiForm.trend}
                      onChange={(e) => setMandiForm({ ...mandiForm, trend: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      <option value="up">Up (Bullish ↑)</option>
                      <option value="down">Down (Bearish ↓)</option>
                      <option value="stable">Stable (→)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  id="submit-mandi-override-btn"
                  disabled={overridingMandi}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--green-deep)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.84rem',
                    border: 'none',
                    cursor: overridingMandi ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <TrendingUp size={15} />
                  <span>{overridingMandi ? 'Updating...' : isGu ? 'ભાવ અપડેટ કરો' : 'Apply Price Override'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: AGRONOMIST PRESCRIPTION & ESCALATION DESK */}
        {/* ========================================================= */}
        {activeTab === 'agronomist_desk' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                border: '1px solid var(--border-medium)',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'ખેડૂત સલાહ & નિષ્ણાત નિદાન ડેસ્ક' : 'Farmer Crop Inquiries & Agronomist Prescription Desk'}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                    {isGu ? 'પાક રોગ, ખાતર અથવા સિંચાઈ અંગે ખેડૂતોએ પૂછેલા પ્રશ્નો પર સત્તાવાર અધિકારી રિસ્પોન્સ' : 'Review escalated crop queries and provide verified recommendations'}
                  </p>
                </div>
              </div>

              {consultations.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  {isGu ? 'હાલમાં કોઈ પેન્ડિંગ પ્રશ્ન નથી.' : 'No pending farmer consultations at this time.'}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {consultations.map((q) => (
                    <div
                      key={q._id}
                      style={{
                        backgroundColor: '#fbf9f5',
                        border: '1px solid var(--border-medium)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-title)' }}>
                              {q.title}
                            </span>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '4px',
                                backgroundColor: q.urgency === 'Urgent' ? '#fee2e2' : '#fef3c7',
                                color: q.urgency === 'Urgent' ? '#991b1b' : '#92400e',
                              }}
                            >
                              {q.urgency}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Farmer: {q.farmerName} • Taluka: {q.taluka || 'Padra'} • Crop: {q.crop}
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            padding: '3px 9px',
                            borderRadius: '20px',
                            backgroundColor: q.status === 'Resolved' ? '#dcfce7' : '#f3efe6',
                            color: q.status === 'Resolved' ? '#15803d' : 'var(--text-body)',
                          }}
                        >
                          {q.status}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.86rem', color: 'var(--text-body)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                        {q.description}
                      </p>

                      {q.officerResponse?.comment ? (
                        <div
                          style={{
                            backgroundColor: '#eef6f0',
                            border: '1px solid var(--border-medium)',
                            borderRadius: '8px',
                            padding: '0.75rem 1rem',
                            marginTop: '0.5rem',
                          }}
                        >
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--green-deep)', textTransform: 'uppercase' }}>
                            ✓ Prescribed by: {q.officerResponse.officerName || 'Agricultural Officer'} ({q.officerResponse.officerBadge})
                          </div>
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-title)', marginTop: '2px' }}>
                            {q.officerResponse.comment}
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          id={`respond-query-btn-${q._id}`}
                          onClick={() => setSelectedConsultation(q)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--green-primary)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Send size={13} />
                          <span>{isGu ? 'સત્તાવાર નિદાન / સલાહ આપો' : 'Prescribe Agronomic Remedy'}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Prescription Modal */}
            {selectedConsultation && (
              <div
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 1000,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    maxWidth: '520px',
                    width: '100%',
                    padding: '1.5rem',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                      {isGu ? 'સત્તાવાર નિદાન નોંધણી' : 'Prescribe Agronomist Advisory'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setSelectedConsultation(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handlePrescriptionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                        Officer Recommendation (English) *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={officerComment}
                        onChange={(e) => setOfficerComment(e.target.value)}
                        placeholder="e.g. Spray Neem Oil 10,000 PPM (2ml/L) followed by Copper Oxychloride if fungal spots persist."
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid var(--border-medium)', fontSize: '0.84rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                        અધિકારી ભલામણ (ગુજરાતી)
                      </label>
                      <textarea
                        rows={2}
                        value={officerCommentGu}
                        onChange={(e) => setOfficerCommentGu(e.target.value)}
                        placeholder="દા.ત. લીંબોળીનું તેલ (૨ મિલી/લીટર) છંટકાવ કરવો..."
                        style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1.5px solid var(--border-medium)', fontSize: '0.84rem' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={respondingToQuery}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--green-primary)',
                        color: '#ffffff',
                        fontWeight: 800,
                        border: 'none',
                        cursor: respondingToQuery ? 'not-allowed' : 'pointer',
                        marginTop: '0.5rem',
                      }}
                    >
                      {respondingToQuery ? 'Submitting...' : 'Dispatch Verified Advisory'}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
