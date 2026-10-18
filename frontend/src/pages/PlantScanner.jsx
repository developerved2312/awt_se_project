import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import {
  analyzePlantImage,
  SAMPLE_CROPS,
} from '../services/scanService';

export const PlantScanner = ({ currentLang = 'en', onNavigateHome }) => {
  const isGu = currentLang === 'gu';

  // Input & analysis state
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [cropHint, setCropHint] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('organic'); // 'organic' | 'chemical' | 'prevention'
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

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
  const handleSelectSample = async (sample) => {
    setErrorMessage('');
    setSelectedImage(sample.image);
    setSelectedFileName(`${sample.id}_sample.jpg`);
    setCropHint(sample.cropName);
    setIsAnalyzing(true);
    setScanResult(null);

    try {
      const response = await analyzePlantImage({
        imageBase64: sample.image,
        cropHint: sample.id,
      });

      if (response && response.scan) {
        setScanResult(response.scan);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      setErrorMessage(
        isGu
          ? 'વિશ્લેષણ કરવામાં મુશ્કેલી આવી. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Diagnostic analysis failed. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run AI Analysis on Selected Image
  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setErrorMessage('');

    try {
      const response = await analyzePlantImage({
        imageBase64: selectedImage,
        cropHint: cropHint || 'Cotton',
      });

      if (response && response.scan) {
        setScanResult(response.scan);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err) {
      setErrorMessage(
        isGu
          ? 'વિશ્લેષણમાં ખામી સર્જાઈ. કૃપા કરીને ફરી પ્રયાસ કરો.'
          : 'Failed to analyze leaf image. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
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

          <div
            className="badge badge-leaf"
            style={{ fontSize: '0.82rem', padding: '0.35rem 0.85rem' }}
          >
            <Sparkles size={14} />
            <span>{isGu ? 'ગુજરાત પાક નિષ્ણાત AI મોડલ' : 'Gujarat Agro-Pathology Vision AI'}</span>
          </div>
        </div>

        {/* Header Section */}
        <div style={{ marginBottom: '2.5rem', maxWidth: '820px' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--text-title)',
              marginBottom: '0.85rem',
              lineHeight: 1.25,
            }}
          >
            {isGu ? 'AI પાક રોગ સ્કેનર અને જૈવિક-વૈજ્ઞાનિક ઉપચાર' : 'Multimodal Crop Vision Diagnostics'}{' '}
            <span style={{ color: 'var(--green-primary)' }}>
              {isGu ? '— હરિત અયન' : '& Dual Remedies'}
            </span>
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-body)',
              lineHeight: 1.7,
            }}
          >
            {isGu
              ? 'કપાસ, દિવેલા, ટામેટા, તુવેર કે ભીંડાના પાંદડાનો ફોટો અપલોડ કરો. જેમિની AI પાનની નસો, ક્લોરોફિલ અને રોગચિહ્નો તપાસીને ત્વરિત સચોટ નિદાન અને દેશી-વૈજ્ઞાનિક ઉપાયો આપશે.'
              : 'Upload or photograph any crop leaf (Cotton, Castor, Tomato, Pigeon Pea, Okra). Gemini Multimodal AI detects cellular discoloration, identifies fungal or viral pathogens, and delivers organic and chemical remedies.'}
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
                {isGu ? '૧. પાંદડાનો ફોટો પસંદ કરો' : '1. Capture or Upload Leaf'}
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

            {/* Selected Image Preview */}
            {selectedImage && !cameraActive && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    border: '1px solid var(--border-medium)',
                    background: '#f8faf9',
                    maxHeight: '360px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={selectedImage}
                    alt="Selected leaf"
                    style={{ width: '100%', maxHeight: '360px', objectFit: 'contain' }}
                  />
                  {isAnalyzing && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(27, 67, 50, 0.45)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        gap: '0.75rem',
                      }}
                    >
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          border: '3px solid rgba(255,255,255,0.3)',
                          borderTopColor: '#ffffff',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                        {isGu ? 'જેમિની AI પાંદડું તપાસી રહ્યું છે...' : 'Gemini AI Vision Analyzing Leaf...'}
                      </span>
                    </div>
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

          {/* Right Column: One-Click Test Samples OR Live Scan Result */}
          {!scanResult ? (
            <div
              className="organic-card"
              style={{
                padding: '1.75rem',
                background: '#ffffff',
              }}
            >
              <div style={{ marginBottom: '1.25rem' }}>
                <div className="badge badge-leaf" style={{ marginBottom: '0.65rem' }}>
                  <Leaf size={14} />
                  <span>{isGu ? 'ત્વરિત ડેમો સેમ્પલ્સ' : 'One-Click Gujarat Crop Samples'}</span>
                </div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  {isGu ? 'અથવા નીચેના સેમ્પલમાંથી પસંદ કરો' : 'Test with Gujarat Agro Samples'}
                </h2>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                  {isGu
                    ? 'તમારી પાસે હાલ છોડનો ફોટો ન હોય તો નીચેનામાંથી કોઈપણ પાક પર ક્લિક કરીને AI નિદાન ચકાસી શકો છો.'
                    : 'Instantly preview the diagnostic pipeline across Gujarat cash crops and vegetables without uploading your own file.'}
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {SAMPLE_CROPS.map((sample) => (
                  <div
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.95rem 1.15rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-canvas)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--green-light)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-tint-green)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-canvas)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-title)' }}>
                          {isGu ? sample.cropName : sample.cropName.split('(')[0].trim()}
                        </span>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
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
                          {sample.severity === 'None'
                            ? isGu
                              ? 'તંદુરસ્ત'
                              : 'Healthy'
                            : sample.severity}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                        {isGu ? sample.diseaseNameGu : sample.diseaseName}
                      </p>
                    </div>

                    <div style={{ color: 'var(--green-primary)' }}>
                      <ArrowRight size={18} />
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
                }}
              >
                <div>
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

                {/* Confidence Score Pill */}
                <div
                  style={{
                    textAlign: 'center',
                    background: 'var(--bg-tint-green)',
                    padding: '0.65rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      color: 'var(--green-deep)',
                      lineHeight: 1,
                    }}
                  >
                    {scanResult.confidenceScore}%
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {isGu ? 'સચોટતા સ્તર' : 'Confidence'}
                  </span>
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
                  <span>{isGu ? 'ઓળખાયેલા લક્ષણો (Foliar Symptoms):' : 'Identified Foliar Symptoms:'}</span>
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
                    <span>{isGu ? 'જૈવિક અને દેશી ઉપચાર' : 'Organic & Bio Remedies'}</span>
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
                    <span>{isGu ? 'વૈજ્ઞાનિક રાસાયણિક ઉપચાર' : 'Scientific Treatments'}</span>
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
                    <span>{isGu ? 'આગોતરી કાળજી' : 'Cultural Prevention'}</span>
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
                      }}
                    >
                      🌿 {isGu ? 'કુદરતી જૈવિક ભલામણો (શૂન્ય રસાયણ):' : 'Eco-Friendly Bio-Pesticide Plan:'}
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
                      }}
                    >
                      🧪 {isGu ? 'રાસાયણિક દવાની માત્રા અને છંટકાવ:' : 'Targeted Active Formulations:'}
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
                      }}
                    >
                      🛡️ {isGu ? 'ખેત કાળજી અને રોગ અટકાવવાના પગલાં:' : 'Field Sanitation & Irrigation Safeguards:'}
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

                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <RotateCcw size={14} />
                  <span>{isGu ? 'બીજા પાકનું સ્કેન કરો' : 'Scan Another Leaf'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 900px) {
          .scanner-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PlantScanner;
