import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  UploadCloud,
  Sparkles,
  Leaf,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Layers,
  ArrowRight,
  Droplets,
  HelpCircle,
  FileText,
  Clock,
  Database,
  Info,
  RefreshCw,
  Printer,
  Trash2,
  Flame,
  BarChart3,
  Shield,
  Activity,
  Sprout,
  Sun,
  Compass,
} from 'lucide-react';
import {
  analyzePlantImage,
  fetchScanHistory,
  deleteScanRecord,
  resolveImageUrl,
  SAMPLE_CROPS,
} from '../services/scanService';

const LOADING_STAGES = [
  {
    en: 'Examining leaf surface and colors...',
    gu: 'પાનની સપાટી અને રંગ તપાસાઈ રહ્યા છે...',
  },
  {
    en: 'Looking for spots and disease signs...',
    gu: 'ડાઘ અને રોગના લક્ષણો તપાસાઈ રહ્યા છે...',
  },
  {
    en: 'AI identifying crop health condition...',
    gu: 'AI દ્વારા પાકની સ્થિતિ ઓળખાઈ રહી છે...',
  },
  {
    en: 'Preparing simple and effective remedies...',
    gu: 'સરળ અને ઉપયોગી ઉપાયો તૈયાર થઈ રહ્યા છે...',
  },
];

export const PlantScanner = ({
  currentLang = 'en',
  onNavigateHome,
  currentUser,
  onNavigateProfile,
  onNavigate,
}) => {
  const isGu = currentLang === 'gu';

  // Input & analysis state
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [cropHint, setCropHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(15);
  const [activeTab, setActiveTab] = useState('organic'); // 'organic' | 'chemical' | 'prevention'
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  // Live Feed History State (MongoDB Atlas integration)
  const [recentScans, setRecentScans] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await fetchScanHistory();
      if (res && res.scans) {
        setRecentScans(res.scans);
      }
    } catch (err) {
      console.warn('Failed to load recent scans:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSelectHistoryScan = (scan) => {
    setScanResult(scan);
    if (scan.imageUrl) {
      setSelectedImage(resolveImageUrl(scan.imageUrl));
      setSelectedFileName(`${scan.cropName || 'scan'}_history.jpg`);
    }
    const reportElem = document.getElementById('diagnostic-report-card');
    if (reportElem) {
      reportElem.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleDeleteHistoryScan = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteScanRecord(id);
      setRecentScans((prev) => prev.filter((s) => s._id !== id));
      if (scanResult && scanResult._id === id) {
        setScanResult(null);
      }
    } catch (err) {
      console.warn('Failed to delete scan:', err);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // Progressive analysis with multi-stage telemetry
  const runProgressiveAnalysis = async (actionFn) => {
    setIsAnalyzing(true);
    setLoadingStage(0);
    setLoadingProgress(18);

    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % LOADING_STAGES.length);
      setLoadingProgress((prev) => (prev < 90 ? prev + 22 : 93));
    }, 750);

    try {
      await actionFn();
      setLoadingProgress(100);
    } finally {
      clearInterval(interval);
      setIsAnalyzing(false);
    }
  };

  // Start Camera
  const startCamera = async () => {
    try {
      setErrorMessage('');
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setErrorMessage(
        isGu
          ? 'કેમેરો શરૂ કરવામાં સમસ્યા: કૃપા કરીને બ્રાઉઝર પરમિશન ચકાસો અથવા ફાઈલ અપલોડ વાપરો.'
          : 'Unable to access camera. Please check camera permissions or upload an image file.'
      );
      setCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Capture Photo from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    stopCamera();
    setSelectedImage(dataUrl);
    setSelectedFileName('camera_snapshot.jpg');
    setScanResult(null);
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        isGu
          ? 'કૃપા કરીને માત્ર ફોટો ફાઇલ (JPG, PNG, WebP) પસંદ કરો.'
          : 'Please select a valid image file (JPG, PNG, or WebP).'
      );
      return;
    }

    setErrorMessage('');
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setScanResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setErrorMessage('');
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setScanResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle One-Click Sample Trigger
  const handleSelectSample = (sample) => {
    setErrorMessage('');
    setSelectedImage(sample.image);
    setSelectedFileName(`${sample.id}_sample.jpg`);
    setCropHint(sample.cropName);
    setScanResult(null);

    runProgressiveAnalysis(async () => {
      const response = await analyzePlantImage({
        imageBase64: sample.image,
        cropHint: sample.id,
      });

      if (response && response.scan) {
        setScanResult(response.scan);
        loadHistory();
      } else {
        throw new Error('Invalid response structure');
      }
    }).catch(() => {
      setErrorMessage(
        isGu
          ? 'વિશ્લેષણ કરવામાં મુશ્કેલી આવી. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Diagnostic analysis failed. Please try again.'
      );
    });
  };

  // Run AI Analysis on Selected Image
  const handleAnalyze = () => {
    if (!selectedImage) return;
    setErrorMessage('');

    runProgressiveAnalysis(async () => {
      const response = await analyzePlantImage({
        imageBase64: selectedImage,
        cropHint: cropHint || 'Cotton',
      });

      if (response && response.scan) {
        setScanResult(response.scan);
        loadHistory();
      } else {
        throw new Error('Analysis failed');
      }
    }).catch(() => {
      setErrorMessage(
        isGu
          ? 'વિશ્લેષણમાં ખામી સર્જાઈ. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Failed to analyze leaf image. Please try again.'
      );
    });
  };

  // Reset Scanner
  const handleReset = () => {
    setSelectedImage(null);
    setSelectedFileName('');
    setScanResult(null);
    setErrorMessage('');
    stopCamera();
  };

  return (
    <div
      id="plant-scanner-page"
      style={{
        paddingTop: '2.5rem',
        paddingBottom: '4rem',
        minHeight: '85vh',
      }}
    >
      <div className="container">
        {/* Breadcrumb / Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.75rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--green-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
            >
              {isGu ? '← મુખ્ય પૃષ્ઠ' : '← Home'}
            </button>
            <span style={{ color: 'var(--border-medium)' }}>/</span>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--green-deep)' }}>
              {isGu ? 'જેમિની AI પાક રોગ નિદાન' : 'Gemini AI Vision Scanner'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => {
                setScanResult(null);
                const kbCard = document.getElementById('crop-knowledge-base-card');
                if (kbCard) kbCard.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--dry-leaf-soft)',
                color: 'var(--dry-leaf-dark)',
                border: '1px solid var(--border-medium)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              title="View Curated Knowledge Base"
            >
              <Database size={13} />
              <span>{isGu ? 'કૃષિ જ્ઞાનકોશ' : 'Knowledge Base'}</span>
            </button>

            {onNavigateProfile && (
              <button
                type="button"
                onClick={onNavigateProfile}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--green-wash)',
                  color: 'var(--green-deep)',
                  border: '1px solid var(--border-medium)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s ease',
                }}
              >
                <Shield size={13} />
                <span>{isGu ? 'કિસાન-અધિકારી ડેસ્ક' : 'Farmer & Officer Desk'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                const feed = document.getElementById('live-scans-feed-section');
                if (feed) feed.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: '#e8f5e9',
                color: 'var(--green-deep)',
                border: '1px solid rgba(45, 106, 79, 0.3)',
                cursor: 'pointer',
                fontWeight: 700,
                transition: 'all 0.2s ease',
              }}
              title="Jump to Live Database Feed"
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#2d6a4f',
                }}
              />
              <span>{isGu ? 'લાઈવ ફીડ' : 'Live Feed'}</span>
            </button>

            <div
              className="badge badge-leaf"
              style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            >
              <Sparkles size={13} />
              <span>{isGu ? 'જેમિની વિઝન AI' : 'Gemini Vision AI'}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            SCANNER TWO-COLUMN SHELL: LEFT PANE (MODULES & ABOUT) + RIGHT INTERACTION
            ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '320px 1fr',
            gap: '2.25rem',
            alignItems: 'start',
          }}
          className="scanner-shell-grid"
        >
          {/* =========================================================================
              LEFT PANE: MODULES DIRECTORY + ABOUT HARITAYAN PLATFORM
              ========================================================================= */}
          <aside
            className="scanner-left-pane"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {/* Card 1: Platform Modules Directory */}
            <div
              className="organic-card"
              style={{
                padding: '1.4rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <Layers size={18} color="var(--green-primary)" />
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'હરિતઅયન મોડ્યુલ્સ' : 'Platform Modules'}
                  </h3>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#e8f5e9',
                    color: 'var(--green-deep)',
                    letterSpacing: '0.04em',
                  }}
                >
                  5 SUITES
                </span>
              </div>

              {/* Modules List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {/* Module 1: Foliar Scanner (ACTIVE) */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-tint-green)',
                    border: '1.5px solid var(--green-primary)',
                    cursor: 'default',
                    boxShadow: '0 2px 6px rgba(45, 106, 79, 0.08)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--green-primary)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Activity size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                        {isGu ? 'પાક રોગ સ્કેનર' : 'Leaf Disease Scanner'}
                      </span>
                      <span
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: '#166534',
                          backgroundColor: '#dcfce7',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor: '#16a34a',
                            animation: 'pulseDot 1.6s infinite',
                          }}
                        />
                        {isGu ? 'સક્રિય' : 'Active'}
                      </span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {isGu ? 'જેમિની 3.8 વિઝન AI દ્વારા પાન રોગ અને ઉપાયો' : 'Gemini 3.8 Vision leaf diagnosis & remedies'}
                    </p>
                  </div>
                </div>

                {/* Module 2: AgroWeather */}
                <div
                  onClick={() => {
                    if (onNavigate) onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('hero-top');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                  className="scanner-module-item"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--dry-leaf-soft)',
                      color: 'var(--dry-leaf-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Sun size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-title)' }}>
                        {isGu ? 'હવામાન અને સિંચાઈ' : 'AgroWeather & Soil'}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        IMD Live
                      </span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {isGu ? 'વડોદરા માઇક્રોક્લાઈમેટ અને પિયત સલાહ' : 'Vadodara microclimate & irrigation schedule'}
                    </p>
                  </div>
                </div>

                {/* Module 3: Urban Heat Map */}
                <div
                  onClick={() => {
                    if (onNavigate) onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('module-01');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                  className="scanner-module-item"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Flame size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-title)' }}>
                        {isGu ? 'શહેર ગરમી & કૂલિંગ નકશો' : 'Urban Heat & Tree Map'}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#dc2626', fontWeight: 700 }}>
                        GIS
                      </span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {isGu ? 'વૃક્ષારોપણથી તાપમાન ઘટાડાનો અંદાજ' : 'Canopy cover & surface cooling benefits'}
                    </p>
                  </div>
                </div>

                {/* Module 4: APMC Mandi Prices */}
                <div
                  onClick={() => {
                    if (onNavigate) onNavigate('home');
                    setTimeout(() => {
                      const el = document.getElementById('module-03');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 120);
                  }}
                  className="scanner-module-item"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#fef3c7',
                      color: '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <BarChart3 size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-title)' }}>
                        {isGu ? 'APMC મંડી બજાર ભાવ' : 'Mandi Crop Prices'}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: '#b45309', fontWeight: 700 }}>
                        Daily
                      </span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {isGu ? 'સયાજીગંજ & પાદરા મંડી રોજના ભાવ' : 'Sayajiganj & Padra commodity rates'}
                    </p>
                  </div>
                </div>

                {/* Module 5: Agronomist & Officer Desk */}
                <div
                  onClick={() => {
                    if (onNavigateProfile) {
                      onNavigateProfile();
                    } else if (onNavigate) {
                      onNavigate('profile');
                    }
                  }}
                  className="scanner-module-item"
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    padding: '0.7rem 0.85rem',
                    borderRadius: '10px',
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--olive-wash)',
                      color: 'var(--olive-sage)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    <Shield size={17} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-title)' }}>
                        {isGu ? 'કિસાન-અધિકારી ડેસ્ક' : 'Agronomist Desk'}
                      </span>
                      <span style={{ fontSize: '0.66rem', color: 'var(--green-deep)', fontWeight: 700 }}>
                        Gov Desk
                      </span>
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                      {isGu ? 'કૃષિ ભવન નિષ્ણાત સમીક્ષા & ટિકિટ્સ' : 'Krishi Bhavan officer review & field tickets'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: General About HaritAyan Platform */}
            <div
              className="organic-card"
              style={{
                padding: '1.4rem',
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-medium)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  paddingBottom: '0.85rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '0.9rem',
                }}
              >
                <Sprout size={18} color="var(--green-primary)" />
                <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  {isGu ? 'હરિતઅયન વિશે' : 'About HaritAyan'}
                </h3>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.6, margin: '0 0 1rem' }}>
                {isGu
                  ? 'હરિતઅયન એ વડોદરા જિલ્લા માટે રચાયેલ સ્માર્ટ એગ્રી-ઇન્ટેલિજન્સ પ્લેટફોર્મ છે. આ પ્લેટફોર્મ આધુનિક મલ્ટિમોડલ જેમિની AI વિઝન અને આણંદ કૃષિ યુનિવર્સિટી (AAU) ની પરંપરાગત તથા વૈજ્ઞાનિક પદ્ધતિઓનો સમન્વય કરે છે.'
                  : 'HaritAyan is Vadodara district\'s premier agricultural & ecological intelligence platform. It merges Gemini 3.8 Multimodal AI with Anand Agricultural University (AAU) agronomical standards.'}
              </p>

              {/* Dual Advisory Protocol Badge */}
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--dry-leaf-soft)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '1rem',
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--dry-leaf-dark)', textTransform: 'uppercase', marginBottom: '0.25rem', letterSpacing: '0.04em' }}>
                  {isGu ? 'દ્વિસ્તરીય સલાહ પદ્ધતિ' : 'Dual Advisory Standard'}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-body)', lineHeight: 1.45 }}>
                  {isGu
                    ? '૧. દેશી પ્રાકૃતિક ઉપાયો (જીવામૃત, નીમ ઓઈલ, ખાટી છાશ)'
                    : '1. Organic Controls (Jiv Amrut, NSKE Neem, Buttermilk)'}
                  <br />
                  {isGu
                    ? '૨. ચોક્કસ માત્રા સાથે ભલામણ કરેલ વૈજ્ઞાનિક દવાઓ'
                    : '2. Precision ICAR chemical sprays with safe harvest waiting intervals'}
                </div>
              </div>

              {/* System Telemetry Specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Engine:</span>
                  <strong style={{ color: 'var(--green-deep)' }}>Gemini 3.8 Flash Vision</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Failover:</span>
                  <strong style={{ color: 'var(--green-deep)' }}>Curated Offline KB (Ready)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>District:</span>
                  <strong>Vadodara (22.30° N, 73.18° E)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Language:</span>
                  <strong>English & ગુજરાતી</strong>
                </div>
              </div>
            </div>
          </aside>

          {/* =========================================================================
              RIGHT CONTENT AREA: TITLE, SCANNER INTERACTION, REPORT & FEEDS
              ========================================================================= */}
          <div className="scanner-main-content-column" style={{ minWidth: 0 }}>
            {/* Header Section */}
            <div style={{ marginBottom: '2.25rem', maxWidth: '820px' }}>
              <h1
                style={{
                  fontSize: 'clamp(2rem, 3.5vw, 2.7rem)',
                  fontWeight: 800,
                  color: 'var(--text-title)',
                  marginBottom: '0.85rem',
                  lineHeight: 1.25,
                }}
              >
                {isGu ? 'AI પાક રોગ સ્કેનર' : 'Plant Disease Scanner'}{' '}
                <span style={{ color: 'var(--green-primary)' }}>
                  {isGu ? '— સરળ પાક તપાસ અને ઉપાયો' : '& Leaf Health Check'}
                </span>
              </h1>
              <p
                style={{
                  fontSize: '1.02rem',
                  color: 'var(--text-body)',
                  lineHeight: 1.7,
                }}
              >
                {isGu
                  ? 'કપાસ, દિવેલા, ટામેટા કે શાકભાજીના પાનનો ફોટો અપલોડ કરો અથવા પાડો. AI ત્વરિત રોગ ઓળખીને સરળ દેશી અને યોગ્ય દવાઓની સલાહ આપશે.'
                  : 'Take or upload a photo of any crop leaf (Cotton, Castor, Tomato, Tuver, or Vegetables). Our AI quickly checks the leaf, identifies any disease, and suggests simple organic and recommended remedies.'}
              </p>
            </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.92rem',
            }}
          >
            <AlertTriangle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            SCANNER INPUT & INTERACTION GRID
            ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: scanResult ? '1fr 1.35fr' : '1.35fr 1fr',
            gap: '2rem',
            alignItems: 'start',
          }}
          className="scanner-main-grid"
        >
          {/* Left Column: Upload / Camera / Image Preview Card */}
          <div
            className="organic-card"
            style={{
              padding: '1.75rem',
              background: '#ffffff',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-title)' }}>
                {isGu ? 'પાનનો ફોટો પસંદ કરો અથવા પાડો' : 'Take or Upload Leaf Photo'}
              </h2>
              {selectedImage && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                >
                  <RotateCcw size={14} />
                  <span>{isGu ? 'રીસેટ' : 'Reset'}</span>
                </button>
              )}
            </div>

            {/* Hidden native file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {/* Video Camera View */}
            {cameraActive && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: '#000000',
                    aspectRatio: '4/3',
                  }}
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: '2px dashed rgba(255,255,255,0.6)',
                      margin: '1.5rem',
                      borderRadius: '8px',
                      pointerEvents: 'none',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                  >
                    <Camera size={16} />
                    <span>{isGu ? 'ફોટો પાડો' : 'Take Snapshot'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="btn btn-secondary"
                  >
                    {isGu ? 'બંધ કરો' : 'Cancel'}
                  </button>
                </div>
              </div>
            )}

            {/* Selected Image Preview with High-Tech Laser & Telemetry */}
            {selectedImage && !cameraActive && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1.5px solid var(--border-medium)',
                    background: '#1a2a22',
                    maxHeight: '380px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={selectedImage}
                    alt="Selected leaf"
                    style={{
                      width: '100%',
                      maxHeight: '380px',
                      objectFit: 'contain',
                      filter: isAnalyzing ? 'brightness(0.85) contrast(1.1)' : 'none',
                      transition: 'filter 0.3s ease',
                    }}
                  />

                  {/* High-Tech Botanical Laser Scanner Overlay */}
                  {isAnalyzing && (
                    <>
                      {/* Sweeping Laser Beam */}
                      <div className="scan-laser-line" />

                      {/* 4 Corner Targeting Reticles */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 14,
                          left: 14,
                          width: 24,
                          height: 24,
                          borderTop: '3px solid var(--green-light)',
                          borderLeft: '3px solid var(--green-light)',
                          pointerEvents: 'none',
                          boxShadow: '0 0 10px rgba(82,183,136,0.6)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: 14,
                          right: 14,
                          width: 24,
                          height: 24,
                          borderTop: '3px solid var(--green-light)',
                          borderRight: '3px solid var(--green-light)',
                          pointerEvents: 'none',
                          boxShadow: '0 0 10px rgba(82,183,136,0.6)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 58,
                          left: 14,
                          width: 24,
                          height: 24,
                          borderBottom: '3px solid var(--green-light)',
                          borderLeft: '3px solid var(--green-light)',
                          pointerEvents: 'none',
                          boxShadow: '0 0 10px rgba(82,183,136,0.6)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 58,
                          right: 14,
                          width: 24,
                          height: 24,
                          borderBottom: '3px solid var(--green-light)',
                          borderRight: '3px solid var(--green-light)',
                          pointerEvents: 'none',
                          boxShadow: '0 0 10px rgba(82,183,136,0.6)',
                        }}
                      />

                      {/* Bottom Live Telemetry Overlay */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '1rem 1.25rem 0.85rem',
                          background: 'linear-gradient(to top, rgba(20, 45, 34, 0.96) 0%, rgba(20, 45, 34, 0.78) 75%, transparent 100%)',
                          color: '#ffffff',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.45rem',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Sparkles
                              size={15}
                              color="#52b788"
                              style={{ animation: 'spin 2.5s linear infinite' }}
                            />
                            <span>{LOADING_STAGES[loadingStage][isGu ? 'gu' : 'en']}</span>
                          </span>
                          <span style={{ color: '#74c69d', fontFamily: 'monospace', fontSize: '0.88rem' }}>
                            {loadingProgress}%
                          </span>
                        </div>

                        {/* Animated Progress Track */}
                        <div
                          style={{
                            width: '100%',
                            height: '5px',
                            backgroundColor: 'rgba(255, 255, 255, 0.22)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${loadingProgress}%`,
                              height: '100%',
                              backgroundColor: 'var(--green-light)',
                              transition: 'width 0.4s ease',
                              boxShadow: '0 0 10px #52b788',
                            }}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span>{selectedFileName || 'leaf_image.jpg'}</span>
                  {!isAnalyzing && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--green-primary)',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      {isGu ? 'બીજો ફોટો પસંદ કરો' : 'Change Image'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Drop Zone Area (when no image selected and camera not active) */}
            {!selectedImage && !cameraActive && (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                  background: 'var(--bg-tint-green)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginBottom: '1.25rem',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--green-primary)';
                  e.currentTarget.style.backgroundColor = '#e5f3e9';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-medium)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    color: 'var(--green-primary)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <UploadCloud size={28} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {isGu ? 'ફોટો અહીં ખેંચો અથવા બ્રાઉઝ કરો' : 'Click to Upload or Drag & Drop'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {isGu
                    ? 'JPG, PNG, અથવા WebP ફોર્મેટ (મહત્તમ 10MB)'
                    : 'Clear close-up photo of leaf surface (Max 10MB)'}
                </p>
              </div>
            )}

            {/* Action Buttons: Camera & Crop Hint Input */}
            {!cameraActive && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {!selectedImage && (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="btn btn-secondary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Camera size={18} />
                    <span>{isGu ? 'કેમેરાથી સીધો ફોટો પાડો' : 'Take Live Camera Snapshot'}</span>
                  </button>
                )}

                {/* Optional Crop Hint Field */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      marginBottom: '0.35rem',
                      color: 'var(--text-title)',
                    }}
                  >
                    {isGu ? 'પાકનું નામ (વૈકલ્પિક માર્ગદર્શન):' : 'Crop Species Hint (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={cropHint}
                    onChange={(e) => setCropHint(e.target.value)}
                    placeholder={isGu ? 'દા.ત. કપાસ, ટામેટા, તુવેર' : 'e.g. Cotton, Tomato, Castor'}
                    disabled={isAnalyzing}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.9rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.9rem',
                      backgroundColor: '#ffffff',
                    }}
                  />
                </div>

                {/* Primary Analyze Action Button */}
                {selectedImage && (
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="btn btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.85rem',
                      fontSize: '1rem',
                      boxShadow: 'var(--shadow-md)',
                      opacity: isAnalyzing ? 0.8 : 1,
                    }}
                  >
                    <Sparkles size={18} />
                    <span>
                      {isAnalyzing
                        ? isGu
                          ? 'વિશ્લેષણ ચાલુ છે...'
                          : 'Diagnosing Foliar Health...'
                        : isGu
                        ? 'જેમિની AI દ્વારા રોગનું નિદાન કરો'
                        : 'Run Gemini AI Diagnosis'}
                    </span>
                    {!isAnalyzing && <ArrowRight size={17} />}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Skeleton Shimmer (while analyzing) OR Samples OR Result Card */}
          {isAnalyzing && !scanResult ? (
            <div
              className="organic-card"
              style={{
                padding: '2rem',
                background: '#ffffff',
                border: '1.5px solid var(--border-medium)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '68%' }}>
                  <div className="skeleton-shimmer" style={{ width: '100px', height: '22px' }} />
                  <div className="skeleton-shimmer" style={{ width: '85%', height: '30px' }} />
                  <div className="skeleton-shimmer" style={{ width: '55%', height: '18px' }} />
                </div>
                <div
                  className="skeleton-shimmer"
                  style={{ width: '74px', height: '64px', borderRadius: '12px' }}
                />
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                <div className="skeleton-shimmer" style={{ width: '45%', height: '18px' }} />
                <div className="skeleton-shimmer" style={{ width: '96%', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '88%', height: '14px' }} />
                <div className="skeleton-shimmer" style={{ width: '92%', height: '14px' }} />
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <div className="skeleton-shimmer" style={{ width: '120px', height: '32px' }} />
                  <div className="skeleton-shimmer" style={{ width: '120px', height: '32px' }} />
                </div>
                <div
                  className="skeleton-shimmer"
                  style={{ width: '100%', height: '95px', borderRadius: '10px' }}
                />
              </div>
            </div>
          ) : !scanResult ? (
            <div
              id="crop-knowledge-base-card"
              className="organic-card"
              style={{
                padding: '1.75rem',
                background: '#ffffff',
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  className="badge"
                  style={{
                    marginBottom: '0.65rem',
                    backgroundColor: 'var(--dry-leaf-soft)',
                    color: 'var(--dry-leaf-dark)',
                    border: '1px solid var(--border-medium)',
                  }}
                >
                  <Database size={13} />
                  <span>{isGu ? 'ચકાસાયેલ કૃષિ જ્ઞાનકોશ' : 'Curated Knowledge Base'}</span>
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  {isGu ? 'પાક રોગ જ્ઞાનકોશ અને સેમ્પલ' : 'Crop Knowledge Base & Verified Samples'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  {isGu
                    ? 'ગુજરાતના મુખ્ય પાકો (કપાસ, દિવેલા, ટામેટા, તુવેર, ભીંડા) માટે ચકાસાયેલ માહિતી. કોઈપણ પાક પર ક્લિક કરીને તેનો રોગ, લક્ષણો અને ઉપાયો તુરંત જુઓ.'
                    : 'Verified agro-diagnostic records for major regional crops. Click any staple crop to instantly load verified diseases and remedies.'}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                  gap: '1rem',
                }}
              >
                {SAMPLE_CROPS.map((sample) => (
                  <div
                    key={sample.id}
                    className="sample-query-card"
                    onClick={() => handleSelectSample(sample)}
                    style={{
                      backgroundColor: 'var(--bg-canvas)',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-medium)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--green-primary)';
                      e.currentTarget.style.backgroundColor = '#ffffff';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(45, 106, 79, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-medium)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.03)';
                    }}
                  >
                    {/* Leaf Image Preview Header */}
                    <div
                      style={{
                        position: 'relative',
                        height: '135px',
                        backgroundColor: '#e8f5e9',
                        overflow: 'hidden',
                      }}
                    >
                      <img
                        src={sample.image}
                        alt={sample.cropName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      {/* Severity Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor:
                            sample.severity === 'Severe'
                              ? '#fee2e2'
                              : sample.severity === 'None'
                              ? '#dcfce7'
                              : '#fef3c7',
                          color:
                            sample.severity === 'Severe'
                              ? '#991b1b'
                              : sample.severity === 'None'
                              ? '#166534'
                              : '#92400e',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        }}
                      >
                        {sample.severity === 'None'
                          ? isGu ? 'તંદુરસ્ત' : 'Healthy'
                          : sample.severity}
                      </span>

                      {/* Tag Badge */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '8px',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          backgroundColor: 'rgba(255, 255, 255, 0.92)',
                          backdropFilter: 'blur(4px)',
                          color: 'var(--green-deep)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                        }}
                      >
                        {sample.tag}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div
                        style={{
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          color: 'var(--green-primary)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          marginBottom: '0.2rem',
                        }}
                      >
                        {isGu ? sample.cropName : sample.cropName.split('(')[0].trim()}
                      </div>

                      <h4
                        style={{
                          fontSize: '0.94rem',
                          fontWeight: 800,
                          color: 'var(--text-title)',
                          margin: '0 0 0.35rem',
                          lineHeight: 1.3,
                        }}
                      >
                        {isGu ? sample.diseaseNameGu : sample.diseaseName}
                      </h4>

                      <p
                        style={{
                          fontSize: '0.78rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                          margin: '0 0 0.85rem',
                          flex: 1,
                        }}
                      >
                        {sample.description}
                      </p>

                      {/* Action CTA Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectSample(sample);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          width: '100%',
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: 'var(--bg-tint-green)',
                          color: 'var(--green-deep)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--green-primary)';
                          e.currentTarget.style.color = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
                          e.currentTarget.style.color = 'var(--green-deep)';
                        }}
                      >
                        <Sparkles size={13} />
                        <span>{isGu ? 'નિદાન શરૂ કરો →' : 'Run AI Diagnosis →'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* =========================================================================
               DIAGNOSTIC REPORT CARD (WHEN SCAN SUCCEEDS)
               ========================================================================= */
            <div
              id="diagnostic-report-card"
              className="organic-card"
              style={{
                padding: '2rem',
                background: '#ffffff',
                border: '1.5px solid var(--border-medium)',
              }}
            >
              {/* Diagnosis Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: '1.25rem',
                  marginBottom: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <FileText size={13} color="var(--green-primary)" />
                      <span>{isGu ? 'પાક સ્વાસ્થ્ય રિપોર્ટ' : 'Plant Health Report'}</span>
                    </div>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '1px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: scanResult.engineUsed && !scanResult.engineUsed.includes('offline') ? '#e8f5e9' : 'var(--dry-leaf-soft)',
                        color: scanResult.engineUsed && !scanResult.engineUsed.includes('offline') ? 'var(--green-deep)' : 'var(--dry-leaf-dark)',
                        border: '1px solid currentColor',
                      }}
                    >
                      {scanResult.engineUsed && !scanResult.engineUsed.includes('offline') ? (
                        <>
                          <Sparkles size={11} />
                          <span>{isGu ? 'લાઈવ જેમિની AI વિઝન' : 'Live Gemini Vision AI'}</span>
                        </>
                      ) : (
                        <>
                          <Database size={11} />
                          <span>{isGu ? 'ચકાસાયેલ કૃષિ જ્ઞાનકોશ' : 'Curated Knowledge Base'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '3px 9px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      backgroundColor:
                        scanResult.severity === 'Severe'
                          ? '#fee2e2'
                          : scanResult.severity === 'None'
                          ? '#dcfce7'
                          : 'var(--dry-leaf-soft)',
                      color:
                        scanResult.severity === 'Severe'
                          ? '#991b1b'
                          : scanResult.severity === 'None'
                          ? '#166534'
                          : 'var(--dry-leaf-dark)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {scanResult.severity === 'None' ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <AlertTriangle size={13} />
                    )}
                    <span>
                      {scanResult.severity === 'None'
                        ? isGu
                          ? 'તંદુરસ્ત પાક'
                          : 'Healthy Crop'
                        : `${isGu ? 'જોખમ સ્તર:' : 'Severity:'} ${scanResult.severity}`}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: 'var(--text-title)',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {isGu && scanResult.diseaseNameGu
                      ? scanResult.diseaseNameGu
                      : scanResult.diseaseName}
                  </h3>
                  <div
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--green-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {isGu && scanResult.cropNameGu ? scanResult.cropNameGu : scanResult.cropName} •{' '}
                    <span style={{ color: 'var(--text-muted)' }}>{scanResult.pathogenType}</span>
                  </div>
                </div>

                {/* Confidence Score Pill & Knowledge Base Quick Access */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.45rem', flexShrink: 0 }}>
                  <div
                    style={{
                      textAlign: 'center',
                      background: 'var(--bg-tint-green)',
                      padding: '0.5rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '1.4rem',
                        fontWeight: 800,
                        color: 'var(--green-deep)',
                        lineHeight: 1,
                      }}
                    >
                      {scanResult.confidenceScore}%
                    </div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isGu ? 'સચોટતા સ્તર' : 'Confidence'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setScanResult(null);
                      setSelectedImage(null);
                      setSelectedFileName('');
                      const kbCard = document.getElementById('crop-knowledge-base-card');
                      if (kbCard) kbCard.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.3rem 0.65rem',
                      fontSize: '0.74rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                    title="Browse Curated Knowledge Base"
                  >
                    <Database size={12} />
                    <span>{isGu ? 'જ્ઞાનકોશ જુઓ' : 'Knowledge Base'}</span>
                  </button>
                </div>
              </div>

              {/* Foliar Symptoms */}
              <div style={{ marginBottom: '1.5rem' }}>
                <h4
                  style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: 'var(--text-title)',
                    marginBottom: '0.6rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                  }}
                >
                  <Info size={16} color="var(--green-primary)" />
                  <span>{isGu ? 'જોવા મળેલા લક્ષણો:' : 'Symptoms Found on Leaf:'}</span>
                </h4>
                <ul
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    paddingLeft: '0.25rem',
                  }}
                >
                  {(isGu && scanResult.symptomsGu?.length
                    ? scanResult.symptomsGu
                    : scanResult.symptoms || []
                  ).map((symptom, idx) => (
                    <li
                      key={idx}
                      style={{
                        fontSize: '0.88rem',
                        color: 'var(--text-body)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.55rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <span style={{ color: 'var(--dry-leaf)', marginTop: '3px' }}>•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actionable Remedies Tabs */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.4rem',
                    borderBottom: '1px solid var(--border-medium)',
                    marginBottom: '1rem',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveTab('organic')}
                    style={{
                      padding: '0.55rem 0.95rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      borderBottom:
                        activeTab === 'organic'
                          ? '2.5px solid var(--green-primary)'
                          : '2.5px solid transparent',
                      color:
                        activeTab === 'organic' ? 'var(--green-deep)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Leaf size={15} />
                    <span>{isGu ? 'દેશી અને કુદરતી ઉપાયો' : 'Organic Remedies'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('chemical')}
                    style={{
                      padding: '0.55rem 0.95rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      borderBottom:
                        activeTab === 'chemical'
                          ? '2.5px solid var(--dry-leaf)'
                          : '2.5px solid transparent',
                      color: activeTab === 'chemical' ? 'var(--dry-leaf-dark)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <Droplets size={15} />
                    <span>{isGu ? 'દવાઓ અને છંટકાવ' : 'Medicines & Sprays'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('prevention')}
                    style={{
                      padding: '0.55rem 0.95rem',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      background: 'none',
                      border: 'none',
                      borderBottom:
                        activeTab === 'prevention'
                          ? '2.5px solid var(--olive-sage)'
                          : '2.5px solid transparent',
                      color:
                        activeTab === 'prevention' ? 'var(--olive-sage)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                    }}
                  >
                    <ShieldCheck size={15} />
                    <span>{isGu ? 'ખેત કાળજી અને બચાવ' : 'Farm Care & Prevention'}</span>
                  </button>
                </div>

                {/* Tab 1: Organic Remedies */}
                {activeTab === 'organic' && (
                  <div
                    style={{
                      backgroundColor: 'var(--bg-tint-green)',
                      padding: '1.15rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--green-deep)',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <Leaf size={14} color="var(--green-primary)" />
                      <span>{isGu ? 'કુદરતી અને દેશી ઉપાયો (કેમિકલ વગર):' : 'Natural & Organic Remedies (Chemical-Free):'}</span>
                    </p>
                    <ul
                      style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        padding: 0,
                      }}
                    >
                      {(isGu && scanResult.organicRemediesGu?.length
                        ? scanResult.organicRemediesGu
                        : scanResult.organicRemedies || []
                      ).map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-body)',
                            display: 'flex',
                            gap: '0.55rem',
                            lineHeight: 1.55,
                          }}
                        >
                          <CheckCircle2 size={16} color="var(--green-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tab 2: Chemical Remedies */}
                {activeTab === 'chemical' && (
                  <div
                    style={{
                      backgroundColor: 'var(--dry-leaf-soft)',
                      padding: '1.15rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--dry-leaf-border)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--dry-leaf-dark)',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <Droplets size={14} color="var(--dry-leaf)" />
                      <span>{isGu ? 'જરૂરી દવાઓ અને છંટકાવની માત્રા:' : 'Recommended Medicines & Spray Dosages:'}</span>
                    </p>
                    <ul
                      style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        padding: 0,
                      }}
                    >
                      {(isGu && scanResult.chemicalRemediesGu?.length
                        ? scanResult.chemicalRemediesGu
                        : scanResult.chemicalRemedies || []
                      ).map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-body)',
                            display: 'flex',
                            gap: '0.55rem',
                            lineHeight: 1.55,
                          }}
                        >
                          <Droplets size={16} color="var(--dry-leaf)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tab 3: Cultural Prevention */}
                {activeTab === 'prevention' && (
                  <div
                    style={{
                      backgroundColor: 'var(--olive-wash)',
                      padding: '1.15rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--olive-sage)',
                        marginBottom: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                      }}
                    >
                      <ShieldCheck size={14} color="var(--olive-sage)" />
                      <span>{isGu ? 'ખેતરની કાળજી અને ભવિષ્યમાં રોગ અટકાવવા:' : 'Helpful Farm Care & Prevention Tips:'}</span>
                    </p>
                    <ul
                      style={{
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.65rem',
                        padding: 0,
                      }}
                    >
                      {(isGu && scanResult.preventiveMeasuresGu?.length
                        ? scanResult.preventiveMeasuresGu
                        : scanResult.preventiveMeasures || []
                      ).map((item, idx) => (
                        <li
                          key={idx}
                          style={{
                            fontSize: '0.88rem',
                            color: 'var(--text-body)',
                            display: 'flex',
                            gap: '0.55rem',
                            lineHeight: 1.55,
                          }}
                        >
                          <ShieldCheck size={16} color="var(--olive-sage)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Report Footer Metadata */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '1rem',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Database size={14} color="var(--green-primary)" />
                  <span>
                    {scanResult.engineUsed === 'offline-expert-knowledgebase'
                      ? 'HaritAyan Agro-Knowledgebase (Offline Verified)'
                      : `Engine: ${scanResult.engineUsed}`}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handlePrintReport}
                    className="btn btn-secondary"
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                    title="Print or export diagnosis dossier"
                  >
                    <Printer size={14} />
                    <span>{isGu ? 'રિપોર્ટ પ્રિન્ટ / સેવ કરો' : 'Print / Export Report'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn btn-primary"
                    style={{
                      padding: '0.4rem 0.85rem',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <RotateCcw size={14} />
                    <span>{isGu ? 'બીજા પાકનું સ્કેન કરો' : 'Scan Another Leaf'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            SAMPLE DEMO QUERIES SECTION (WHEN SCAN RESULT IS ACTIVE)
            ========================================================================= */}
        {scanResult && (
          <section
            id="sample-demo-queries-section"
            style={{
              marginTop: '3rem',
              paddingTop: '2.5rem',
              borderTop: '1px solid var(--border-medium)',
            }}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <div
                className="badge"
                style={{
                  marginBottom: '0.5rem',
                  backgroundColor: 'var(--dry-leaf-soft)',
                  color: 'var(--dry-leaf-dark)',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <Database size={13} />
                <span>{isGu ? 'ચકાસાયેલ સેમ્પલ પાક પ્રશ્નો' : 'Sample Demo Queries'}</span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)', margin: '0 0 0.35rem' }}>
                {isGu ? 'અન્ય પાકોનું AI નિદાન ચકાસો' : 'Try Other Crop Sample Diagnoses'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
                {isGu
                  ? 'નીચે આપેલા કોઈપણ સેમ્પલ કાર્ડ પર ક્લિક કરીને ત્વરિત AI રોગ પરીક્ષણ અને ઉપાયો ચકાસો.'
                  : 'Click any verified crop leaf sample card below to test instant Gemini AI pathology diagnosis.'}
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
                gap: '1rem',
              }}
            >
              {SAMPLE_CROPS.map((sample) => (
                <div
                  key={sample.id}
                  className="sample-query-card"
                  onClick={() => handleSelectSample(sample)}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-subtle)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--green-primary)';
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  <div style={{ position: 'relative', height: '130px', backgroundColor: '#e8f5e9' }}>
                    <img
                      src={sample.image}
                      alt={sample.cropName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor:
                          sample.severity === 'Severe'
                            ? '#fee2e2'
                            : sample.severity === 'None'
                            ? '#dcfce7'
                            : '#fef3c7',
                        color:
                          sample.severity === 'Severe'
                            ? '#991b1b'
                            : sample.severity === 'None'
                            ? '#166534'
                            : '#92400e',
                      }}
                    >
                      {sample.severity === 'None' ? (isGu ? 'તંદુરસ્ત' : 'Healthy') : sample.severity}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        fontSize: '0.66rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        color: 'var(--green-deep)',
                      }}
                    >
                      {sample.tag}
                    </span>
                  </div>
                  <div style={{ padding: '0.85rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--green-primary)', marginBottom: '0.2rem' }}>
                      {isGu ? sample.cropName : sample.cropName.split('(')[0].trim()}
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-title)', margin: '0 0 0.3rem' }}>
                      {isGu ? sample.diseaseNameGu : sample.diseaseName}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4, margin: '0 0 0.8rem', flex: 1 }}>
                      {sample.description}
                    </p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectSample(sample);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        width: '100%',
                        padding: '0.45rem',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: 'var(--bg-tint-green)',
                        color: 'var(--green-deep)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <Sparkles size={13} />
                      <span>{isGu ? 'આ સેમ્પલ ચકાસો →' : 'Test This Sample →'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* =========================================================================
            LIVE FEED OF RECENT SCANS (MONGODB ATLAS INTEGRATION)
            ========================================================================= */}
        <section
          id="live-scans-feed-section"
          style={{
            marginTop: '3.5rem',
            paddingTop: '2.5rem',
            borderTop: '1px solid var(--border-medium)',
          }}
        >
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.75rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '3px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: '#e8f5e9',
                    border: '1px solid rgba(45, 106, 79, 0.25)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: 'var(--green-deep)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: '#2d6a4f',
                      boxShadow: '0 0 8px #52b788',
                      animation: 'pulseDot 1.8s ease-in-out infinite',
                    }}
                  />
                  <span>{isGu ? 'લાઈવ ક્લાઉડ ફીડ' : 'Live Database Feed'}</span>
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  • MongoDB Atlas
                </span>
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                {isGu ? 'તાજા પાક નિદાન લાઈવ ફીડ' : 'Recent Plant Health Scans'}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: '0.3rem 0 0' }}>
                {isGu
                  ? 'તમારા ડેટાબેઝમાં સાચવેલા તાજા સ્કેન રિપોર્ટ. વિગતવાર ઉપાયો જોવા માટે કોઈપણ કાર્ડ પર ક્લિક કરો.'
                  : 'Real-time crop diagnoses recorded in your database. Click any card to inspect full remedies.'}
              </p>
            </div>

            <button
              type="button"
              onClick={loadHistory}
              disabled={isLoadingHistory}
              className="btn btn-secondary"
              style={{
                padding: '0.45rem 0.95rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
              title="Refresh live feed from database"
            >
              <RefreshCw
                size={14}
                style={{
                  animation: isLoadingHistory ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isGu ? 'ફીડ રિફ્રેશ કરો' : 'Refresh Feed'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          {recentScans && recentScans.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.15rem',
              }}
            >
              {recentScans.map((scan, idx) => {
                const isSevere = scan.severity === 'Severe';
                const isHealthy = scan.severity === 'None';
                const isGeminiLive = scan.engineUsed && !scan.engineUsed.includes('offline');

                return (
                  <div
                    key={scan._id || idx}
                    onClick={() => handleSelectHistoryScan(scan)}
                    className="organic-card"
                    style={{
                      padding: '1.15rem',
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.borderColor = 'var(--green-primary)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Top Row: Engine badge, Severity & Delete option */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                        gap: '0.5rem',
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '4px',
                          background: isGeminiLive ? '#e8f5e9' : 'var(--dry-leaf-soft)',
                          color: isGeminiLive ? 'var(--green-deep)' : 'var(--dry-leaf-dark)',
                        }}
                      >
                        {isGeminiLive ? <Sparkles size={11} /> : <Database size={11} />}
                        <span>{isGeminiLive ? 'Live Gemini AI' : 'Knowledge Base'}</span>
                      </span>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 7px',
                            borderRadius: '4px',
                            backgroundColor: isSevere ? '#fee2e2' : isHealthy ? '#dcfce7' : '#fef3c7',
                            color: isSevere ? '#991b1b' : isHealthy ? '#166534' : '#92400e',
                          }}
                        >
                          {isHealthy ? (isGu ? 'તંદુરસ્ત' : 'Healthy') : scan.severity || 'Moderate'}
                        </span>

                        {scan._id && !scan._id.startsWith('mock_') && !scan._id.startsWith('sample_') && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistoryScan(scan._id, e)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center',
                              borderRadius: '4px',
                              transition: 'color 0.2s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                            title="Delete scan from database"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Middle Section: Thumbnail + Crop & Condition */}
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div
                        style={{
                          width: '58px',
                          height: '58px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flexShrink: 0,
                          backgroundColor: 'var(--bg-tint-green)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {scan.imageUrl ? (
                          <img
                            src={resolveImageUrl(scan.imageUrl)}
                            alt={scan.cropName || 'Leaf Scan'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Leaf size={22} color="var(--green-primary)" />
                        )}
                      </div>

                      <div style={{ minWidth: 0, flex: 1 }}>
                        <h4
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            color: 'var(--text-title)',
                            margin: '0 0 0.2rem',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {isGu && scan.cropNameGu ? scan.cropNameGu : scan.cropName}
                        </h4>

                        <p
                          style={{
                            fontSize: '0.82rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {isGu && scan.diseaseNameGu ? scan.diseaseNameGu : scan.diseaseName}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Row: Score, Date & Inspect prompt */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.65rem',
                        fontSize: '0.76rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={12} />
                        <span>
                          {scan.createdAt
                            ? new Date(scan.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : 'Recent'}
                        </span>
                      </div>

                      <span
                        style={{
                          fontWeight: 700,
                          color: 'var(--green-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <span>{isGu ? 'રિપોર્ટ જુઓ' : 'View Report'}</span>
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              style={{
                padding: '2.5rem',
                textAlign: 'center',
                background: '#ffffff',
                borderRadius: 'var(--radius-md)',
                border: '1px dashed var(--border-medium)',
                color: 'var(--text-muted)',
              }}
            >
              <Database size={24} color="var(--green-primary)" style={{ marginBottom: '0.5rem' }} />
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>
                {isGu
                  ? 'હાલ કોઈ સ્કેન સંગ્રહિત નથી. ઉપરથી ફોટો અપલોડ કરો અથવા સેમ્પલ પાક પસંદ કરીને તમારું પ્રથમ નિદાન સાચવો!'
                  : 'No scans saved in the database yet. Capture or upload a leaf photo above to record your first diagnosis!'}
              </p>
            </div>
          )}
        </section>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.3); }
        }
        @media (max-width: 1024px) {
          .scanner-shell-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
          .scanner-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
        .scanner-module-item:hover {
          border-color: var(--green-primary) !important;
          background-color: var(--bg-tint-green) !important;
          transform: translateX(3px);
        }
        .sample-query-card:hover {
          transform: translateY(-3px);
          border-color: var(--green-primary) !important;
        }
        @media print {
          body {
            background: #ffffff !important;
          }
          #main-navbar, #live-scans-feed-section, .scanner-left-pane, .btn, .badge, #nav-brand-logo, header, footer {
            display: none !important;
          }
          #diagnostic-report-card {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .scanner-shell-grid, .scanner-main-grid {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlantScanner;
