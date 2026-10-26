import React, { useState, useEffect, useRef } from 'react';
import {
  Droplets,
  Timer,
  Play,
  Pause,
  RotateCcw,
  CloudRain,
  Sun,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Award,
  ChevronRight,
  TrendingDown,
  Sparkles,
  Layers,
  ArrowRight,
  Compass,
  Calendar,
  Clock,
  Save,
  Volume2,
  VolumeX,
} from 'lucide-react';

export const IrrigationTimer = ({ currentLang = 'en', onNavigateHome }) => {
  const isGu = currentLang === 'gu';

  // Calculator Parameters
  const [selectedCrop, setSelectedCrop] = useState('cotton');
  const [selectedStage, setSelectedStage] = useState('flowering');
  const [selectedSoil, setSelectedSoil] = useState('medium_black');
  const [selectedMethod, setSelectedMethod] = useState('drip');
  const [area, setArea] = useState(2.0);
  const [areaUnit, setAreaUnit] = useState('vigha'); // 'vigha' | 'acre'
  const [moisture, setMoisture] = useState('moderate'); // 'dry' | 'moderate' | 'wet'

  // Server Data & Calculations
  const [metadata, setMetadata] = useState(null);
  const [calcResult, setCalcResult] = useState(null);
  const [powerSchedule, setPowerSchedule] = useState(null);
  const [weatherAdvisory, setWeatherAdvisory] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Live Timer State
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(105 * 60); // Default 105 mins in seconds
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(105 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [waterDeliveredSoFar, setWaterDeliveredSoFar] = useState(0);
  const [timerFinished, setTimerFinished] = useState(false);
  const [logSuccessMessage, setLogSuccessMessage] = useState('');

  // Audio tone synthesizer for timer alarm
  const audioContextRef = useRef(null);

  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = audioContextRef.current || new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Fetch initial metadata, power schedule, and weather advisory
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [metaRes, powerRes, weatherRes, logsRes] = await Promise.all([
          fetch('http://localhost:5000/api/irrigation/metadata').catch(() => null),
          fetch('http://localhost:5000/api/irrigation/power-schedule').catch(() => null),
          fetch('http://localhost:5000/api/irrigation/weather-advisory').catch(() => null),
          fetch('http://localhost:5000/api/irrigation/logs').catch(() => null),
        ]);

        if (metaRes && metaRes.ok) {
          const d = await metaRes.json();
          if (d.success) setMetadata(d);
        }
        if (powerRes && powerRes.ok) {
          const d = await powerRes.json();
          if (d.success) setPowerSchedule(d);
        }
        if (weatherRes && weatherRes.ok) {
          const d = await weatherRes.json();
          if (d.success) setWeatherAdvisory(d.data);
        }
        if (logsRes && logsRes.ok) {
          const d = await logsRes.json();
          if (d.success) setLogs(d.data);
        }
      } catch (err) {
        console.warn('Irrigation API fetch fallback:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Recalculate runtime whenever inputs change
  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:5000/api/irrigation/calculate?crop=${selectedCrop}&stage=${selectedStage}&soil=${selectedSoil}&method=${selectedMethod}&area=${area}&unit=${areaUnit}&moisture=${moisture}`;
        const res = await fetch(url).catch(() => null);

        if (res && res.ok) {
          const d = await res.json();
          if (d.success) {
            setCalcResult(d.calculation);
            // If timer is not currently running, sync timer total with calculation
            if (!timerActive) {
              const secs = d.calculation.runtime.totalMinutes * 60;
              setTimerTotalSeconds(secs);
              setTimerSecondsLeft(secs);
              setWaterDeliveredSoFar(0);
              setTimerFinished(false);
            }
            return;
          }
        }
      } catch (err) {
        console.warn('Calculation error, fallback applied:', err);
      } finally {
        setLoading(false);
      }

      // Client-side fallback calculation if backend is unreachable
      const fallbackMinutes = Math.round(area * 50 * (selectedMethod === 'drip' ? 1.0 : selectedMethod === 'sprinkler' ? 0.7 : 1.8));
      const fallbackLiters = Math.round(fallbackMinutes * (selectedMethod === 'drip' ? 140 : 280));
      const fallbackSaved = Math.round(fallbackLiters * 0.52);

      const fallbackCalc = {
        cropName: selectedCrop === 'cotton' ? 'Cotton (Kapas)' : 'Crop',
        cropNameGu: selectedCrop === 'cotton' ? 'કપાસ' : 'પાક',
        runtime: {
          totalMinutes: fallbackMinutes,
          hours: Math.floor(fallbackMinutes / 60),
          minutes: fallbackMinutes % 60,
          formatted: `${Math.floor(fallbackMinutes / 60)}h ${fallbackMinutes % 60}m`,
          formattedGu: `${Math.floor(fallbackMinutes / 60)} કલાક ${fallbackMinutes % 60} મિનિટ`,
        },
        waterMetrics: {
          totalLiters: fallbackLiters,
          waterSavedLiters: fallbackSaved,
          savingsPercent: 52,
        },
        energyMetrics: {
          unitsSavedKwh: Math.round(fallbackSaved / 2800),
          billSavingsInr: Math.round((fallbackSaved / 2800) * 4.8),
        },
        flowRateLpm: Math.round(fallbackLiters / fallbackMinutes),
      };

      setCalcResult(fallbackCalc);
      if (!timerActive) {
        const secs = fallbackMinutes * 60;
        setTimerTotalSeconds(secs);
        setTimerSecondsLeft(secs);
      }
    };

    fetchCalculation();
  }, [selectedCrop, selectedStage, selectedSoil, selectedMethod, area, areaUnit, moisture]);

  // Timer Tick Interval
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimerFinished(true);
            playChime();
            return 0;
          }
          return prev - 1;
        });

        // Flow rate tick: accumulate liters in real-time
        if (calcResult?.waterMetrics?.totalLiters && timerTotalSeconds > 0) {
          const litersPerSec = calcResult.waterMetrics.totalLiters / timerTotalSeconds;
          setWaterDeliveredSoFar((prev) => Math.min(calcResult.waterMetrics.totalLiters, Math.round(prev + litersPerSec)));
        }
      }, 1000);
    } else if (timerSecondsLeft === 0 && timerActive) {
      setTimerActive(false);
      setTimerFinished(true);
      playChime();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timerSecondsLeft, calcResult, timerTotalSeconds, soundEnabled]);

  // Save session log
  const handleSaveLog = async () => {
    if (!calcResult) return;
    const minutesCompleted = Math.round((timerTotalSeconds - timerSecondsLeft) / 60) || calcResult.runtime.totalMinutes;
    const litersDelivered = waterDeliveredSoFar || calcResult.waterMetrics.totalLiters;

    const payload = {
      cropKey: selectedCrop,
      cropName: calcResult.cropName,
      areaVigha: areaUnit === 'vigha' ? area : parseFloat((area * 2.4).toFixed(1)),
      method: selectedMethod,
      durationMinutes: minutesCompleted,
      waterDeliveredLiters: litersDelivered,
      waterSavedLiters: calcResult.waterMetrics.waterSavedLiters,
    };

    try {
      const res = await fetch('http://localhost:5000/api/irrigation/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const d = await res.json();
        if (d.success) {
          setLogs((prev) => [d.log, ...prev.slice(0, 9)]);
          setLogSuccessMessage(isGu ? 'સિંચાઈ સત્ર સફળતાપૂર્વક સાચવવામાં આવ્યું!' : 'Irrigation session logged successfully!');
          setTimeout(() => setLogSuccessMessage(''), 4000);
          return;
        }
      }
    } catch (err) {
      console.warn('Logging fallback:', err);
    }

    // Client-side fallback log update
    const fallbackLog = {
      id: `log-${Date.now()}`,
      cropName: calcResult.cropName,
      areaVigha: area,
      method: selectedMethod,
      durationMinutes: minutesCompleted,
      waterDeliveredLiters: litersDelivered,
      waterSavedLiters: calcResult.waterMetrics.waterSavedLiters,
      timestamp: new Date().toISOString(),
      status: 'Completed',
    };
    setLogs((prev) => [fallbackLog, ...prev]);
    setLogSuccessMessage(isGu ? 'સિંચાઈ સત્ર સફળતાપૂર્વક સાચવવામાં આવ્યું!' : 'Irrigation session logged successfully!');
    setTimeout(() => setLogSuccessMessage(''), 4000);
  };

  // Format seconds to HH:MM:SS
  const formatTime = (totalSecs) => {
    const h = Math.floor(totalSecs / 3600);
    const m = Math.floor((totalSecs % 3600) / 60);
    const s = totalSecs % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPercent = timerTotalSeconds > 0
    ? Math.min(100, Math.round(((timerTotalSeconds - timerSecondsLeft) / timerTotalSeconds) * 100))
    : 0;

  // Crops list
  const cropsList = [
    { key: 'cotton', nameEn: 'Cotton (Kapas)', nameGu: 'કપાસ', badge: '550-650 mm' },
    { key: 'banana', nameEn: 'Banana (Keli - Padra)', nameGu: 'કેળ (પાદરા સ્પેશ્યલ)', badge: '1500+ mm' },
    { key: 'tomato', nameEn: 'Tomato (Tameta)', nameGu: 'ટામેટા', badge: 'Drip Sensitive' },
    { key: 'tuver', nameEn: 'Pigeon Pea (Tuver)', nameGu: 'તુવેર / અરહર', badge: 'Low Water' },
    { key: 'wheat', nameEn: 'Wheat (Ghau)', nameGu: 'ઘઉં (શિયાળુ પાક)', badge: '450 mm' },
    { key: 'castor', nameEn: 'Castor (Divela)', nameGu: 'દિવેલા / એરંડા', badge: 'Drought Hardy' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '2rem 1.5rem 4rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* =========================================================================
            HEADER TITLE & BREADCRUMB
            ========================================================================= */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                }}
              >
                <Droplets size={24} color="#ffffff" />
              </div>
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '1.75rem',
                    fontWeight: 800,
                    color: 'var(--green-deep)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {isGu ? 'સ્માર્ટ સિંચાઈ ટાઈમર અને જળ વ્યવસ્થાપન' : 'Smart Irrigation Timer & Precision Water Advisory'}
                </h1>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
                  {isGu
                    ? 'વડોદરા જિલ્લાના પાક, જમીન અને વીજળી શેડ્યૂલ મુજબ ચોક્કસ પાણી ગણતરી અને ઓટો-ટાઈમર'
                    : 'Crop-specific root zone moisture balancing, live runtime countdown, and MGVCL 3-phase power scheduler'}
                </p>
              </div>
            </div>
          </div>

          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                color: 'var(--green-deep)',
                fontSize: '0.86rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <Compass size={16} />
              <span>{isGu ? 'હોમ પેજ' : 'Return Home'}</span>
            </button>
          )}
        </div>

        {/* =========================================================================
            TOP ALERT: WEATHER-AWARE RAIN-SKIP ADVISORY
            ========================================================================= */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)',
            border: '1px solid #bbf7d0',
            borderRadius: '16px',
            padding: '1.15rem 1.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: '0 2px 8px rgba(22, 163, 74, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <CloudRain size={24} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2px' }}>
                <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, color: '#15803d' }}>
                  {isGu ? 'હવામાન અને સિંચાઈ સલાહ (વડોદરા એગ્રો-હવામાન)' : 'VADODARA AGRO-WEATHER WATER ADVISORY'}
                </span>
                <span
                  style={{
                    backgroundColor: weatherAdvisory?.skipIrrigation ? '#fee2e2' : '#dcfce7',
                    color: weatherAdvisory?.skipIrrigation ? '#dc2626' : '#15803d',
                    padding: '2px 8px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}
                >
                  {weatherAdvisory?.skipIrrigation
                    ? isGu ? 'સિંચાઈ ટાળો (વરસાદ)' : 'SKIP TODAY (Rain Alert)'
                    : isGu ? 'સિંચાઈ અનુકૂળ' : 'FAVORABLE (Zero Rain)'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#166534', fontWeight: 600 }}>
                {isGu
                  ? (weatherAdvisory?.reasonGu || 'આકાશ ચોખ્ખું છે (તાપમાન 34.2°C). સવારે ૦૬:૩૦ થી ૦૯:૩૦ વચ્ચે ટપક સિંચાઈ કરવી સૌથી ઉત્તમ.')
                  : (weatherAdvisory?.reasonEn || 'Clear skies in Vadodara (34.2°C, ET₀: 5.2 mm/day). Ideal watering window: Early Morning (06:30 - 09:30 AM).')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>ET₀ RATE</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>5.2 mm/day</span>
            </div>
            <div style={{ width: '1px', height: '28px', backgroundColor: '#cbd5e1' }} />
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>RAIN CHANCE</span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0284c7' }}>12%</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN 2-COLUMN GRID: CONFIGURATION (LEFT) + LIVE TIMER & TELEMETRY (RIGHT)
            ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '2rem', alignItems: 'start' }}>
          {/* =========================================================================
              LEFT COLUMN: PARAMETER SELECTION & SCHEDULER
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Card 1: Crop & Stage Selection */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', color: 'var(--green-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={20} color="var(--green-primary)" />
                <span>{isGu ? '૧. પાક અને વૃદ્ધિ અવસ્થા પસંદ કરો' : '1. Select Crop & Growth Stage'}</span>
              </h3>

              {/* Crop Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {cropsList.map((c) => {
                  const isSel = selectedCrop === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setSelectedCrop(c.key)}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        border: isSel ? '2px solid #0284c7' : '1px solid #e2e8f0',
                        backgroundColor: isSel ? '#f0f9ff' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: isSel ? '#0369a1' : 'var(--green-deep)' }}>
                        {isGu ? c.nameGu : c.nameEn}
                      </div>
                      <span style={{ fontSize: '0.72rem', color: isSel ? '#0284c7' : '#94a3b8', fontWeight: 600 }}>
                        {c.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Growth Stage Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '0.4rem' }}>
                  {isGu ? 'હાલની વૃદ્ધિ અવસ્થા (Stage):' : 'Current Growth Stage:'}
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                  {[
                    { key: 'seedling', en: 'Seedling / Early', gu: 'અંકુરણ / પ્રારંભિક' },
                    { key: 'vegetative', en: 'Vegetative Canopy', gu: 'વાનસ્પતિક વિકાસ' },
                    { key: 'flowering', en: 'Flowering (Critical)', gu: 'ફૂલ અવસ્થા (મુખ્ય)' },
                    { key: 'boll_development', en: 'Fruit / Boll Filling', gu: 'ફળ/જીંડવા ભરાવ' },
                    { key: 'maturity', en: 'Maturity / Harvest', gu: 'પાકટ અવસ્થા' },
                  ].map((st) => (
                    <button
                      key={st.key}
                      type="button"
                      onClick={() => setSelectedStage(st.key)}
                      style={{
                        padding: '0.65rem 0.5rem',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        border: selectedStage === st.key ? '1px solid #16a34a' : '1px solid #e2e8f0',
                        backgroundColor: selectedStage === st.key ? '#dcfce7' : '#ffffff',
                        color: selectedStage === st.key ? '#15803d' : '#64748b',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {isGu ? st.gu : st.en}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Soil, Method & Farm Area */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.15rem', color: 'var(--green-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Droplets size={20} color="#0284c7" />
                <span>{isGu ? '૨. જમીન, પદ્ધતિ અને ખેતરનું માપ' : '2. Soil, Method & Farm Area'}</span>
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                {/* Soil Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '0.4rem' }}>
                    {isGu ? 'જમીનનો પ્રકાર (Soil Type):' : 'Soil Texture (Vadodara):'}
                  </label>
                  <select
                    value={selectedSoil}
                    onChange={(e) => setSelectedSoil(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      color: 'var(--green-deep)',
                      backgroundColor: '#ffffff',
                      fontWeight: 600,
                    }}
                  >
                    <option value="medium_black">{isGu ? 'મધ્યમ કાળી જમીન (પાદરા-કરજણ)' : 'Medium Black (Karjan/Padra)'}</option>
                    <option value="goradu">{isGu ? 'ગોરાડુ / રેતાળ કાંપ (વડોદરા ઉત્તર)' : 'Goradu Sandy Loam (Vadodara/Anand)'}</option>
                    <option value="heavy_clay">{isGu ? 'ભાલ કાળી ચીકણી જમીન' : 'Heavy Black Clay (Bhal Tract)'}</option>
                  </select>
                </div>

                {/* Irrigation Method */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '0.4rem' }}>
                    {isGu ? 'સિંચાઈ પદ્ધતિ (Method):' : 'Irrigation System:'}
                  </label>
                  <select
                    value={selectedMethod}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.7rem 0.85rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.88rem',
                      color: 'var(--green-deep)',
                      backgroundColor: '#ffffff',
                      fontWeight: 600,
                    }}
                  >
                    <option value="drip">{isGu ? 'ટપક સિંચાઈ (ડ્રીપ - ૯૦% કાર્યક્ષમતા)' : 'Drip Irrigation (90% Efficient)'}</option>
                    <option value="sprinkler">{isGu ? 'ફુવારા પદ્ધતિ (૭૫% કાર્યક્ષમતા)' : 'Sprinkler (75% Efficient)'}</option>
                    <option value="flood">{isGu ? 'પરંપરાગત ધોરિયા (૪૫% કાર્યક્ષમતા)' : 'Furrow / Flood (48% Efficient)'}</option>
                  </select>
                </div>
              </div>

              {/* Area Input & Soil Moisture Slider */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-deep)' }}>
                      {isGu ? 'ખેતરનો વિસ્તાર (Area):' : 'Plot Area:'}
                    </label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => setAreaUnit('vigha')}
                        style={{
                          border: 'none',
                          background: areaUnit === 'vigha' ? 'var(--green-deep)' : '#e2e8f0',
                          color: areaUnit === 'vigha' ? '#ffffff' : '#64748b',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isGu ? 'વીઘા' : 'Vigha'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setAreaUnit('acre')}
                        style={{
                          border: 'none',
                          background: areaUnit === 'acre' ? 'var(--green-deep)' : '#e2e8f0',
                          color: areaUnit === 'acre' ? '#ffffff' : '#64748b',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isGu ? 'એકર' : 'Acre'}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="range"
                      min="0.5"
                      max="15.0"
                      step="0.5"
                      value={area}
                      onChange={(e) => setArea(parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--green-primary)' }}
                    />
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--green-deep)', minWidth: '70px', textAlign: 'right' }}>
                      {area} {areaUnit === 'vigha' ? (isGu ? 'વીઘા' : 'Vigha') : (isGu ? 'એકર' : 'Acres')}
                    </span>
                  </div>
                </div>

                {/* Moisture level */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '0.4rem' }}>
                    {isGu ? 'જમીનનો ભેજ (Current Moisture):' : 'Current Soil Moisture:'}
                  </label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[
                      { key: 'dry', en: 'Dry (<25%)', gu: 'સૂકી' },
                      { key: 'moderate', en: 'Moderate', gu: 'મધ્યમ' },
                      { key: 'wet', en: 'Moist (>75%)', gu: 'ભેજયુક્ત' },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setMoisture(m.key)}
                        style={{
                          flex: 1,
                          padding: '0.55rem 0',
                          borderRadius: '8px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          border: moisture === m.key ? '1px solid #0284c7' : '1px solid #e2e8f0',
                          backgroundColor: moisture === m.key ? '#e0f2fe' : '#ffffff',
                          color: moisture === m.key ? '#0369a1' : '#64748b',
                          cursor: 'pointer',
                        }}
                      >
                        {isGu ? m.gu : m.en}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: MGVCL Jyotigram 3-Phase Agricultural Power Schedule */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={20} color="#d97706" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--green-deep)', fontWeight: 700 }}>
                      {isGu ? 'MGVCL જ્યોતિગ્રામ ૩-ફેઝ પાવર શેડ્યૂલ' : 'MGVCL 3-Phase Agricultural Power Roster'}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: '#64748b' }}>Vadodara DISCOM 8-Hour Roster</span>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: '#dcfce7',
                    color: '#15803d',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }} />
                  {isGu ? 'હાલમાં ૩-ફેઝ ઉપલબ્ધ' : '3-Phase Active Now'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: '10px', border: '2px solid #16a34a', backgroundColor: '#f0fdf4' }}>
                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 800 }}>
                    {isGu ? 'ગ્રૂપ A (ચાલુ)' : 'GROUP A (ACTIVE)'}
                  </span>
                  <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#166534', marginTop: '2px' }}>
                    06:00 AM - 02:00 PM
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Padra, Karjan, Dabhoi</span>
                </div>

                <div style={{ padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                    {isGu ? 'ગ્રૂપ B (આગામી)' : 'GROUP B (NEXT)'}
                  </span>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
                    02:00 PM - 10:00 PM
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Savli, Waghodia</span>
                </div>

                <div style={{ padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>
                    {isGu ? 'ગ્રૂપ C (રાત્રિ)' : 'GROUP C (NIGHT)'}
                  </span>
                  <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#334155', marginTop: '2px' }}>
                    10:00 PM - 06:00 AM
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Shinor, Anklav</span>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RIGHT COLUMN: LIVE COUNTDOWN TIMER & WATER CONSERVATION TELEMETRY
              ========================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Live Interactive Timer Box */}
            <div
              style={{
                background: 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)',
                borderRadius: '20px',
                padding: '2rem',
                border: '2px solid #bae6fd',
                boxShadow: '0 8px 24px rgba(2, 132, 199, 0.08)',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  position: 'absolute',
                  top: '1.25rem',
                  right: '1.25rem',
                  background: 'none',
                  border: 'none',
                  color: soundEnabled ? '#0284c7' : '#94a3b8',
                  cursor: 'pointer',
                }}
                title={soundEnabled ? 'Mute alarm chime' : 'Enable alarm chime'}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>

              <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0369a1' }}>
                {isGu ? 'લાઇવ સિંચાઈ ઓટો-ટાઈમર' : 'LIVE IRRIGATION RUN-TIMER'}
              </span>

              {/* Big Digital Clock Display */}
              <div
                style={{
                  fontSize: '3.4rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: timerActive ? '#0284c7' : timerFinished ? '#16a34a' : 'var(--green-deep)',
                  margin: '0.75rem 0',
                  letterSpacing: '2px',
                  textShadow: timerActive ? '0 0 20px rgba(2, 132, 199, 0.2)' : 'none',
                }}
              >
                {formatTime(timerSecondsLeft)}
              </div>

              {/* Status Pill */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  style={{
                    backgroundColor: timerActive ? '#e0f2fe' : timerFinished ? '#dcfce7' : '#f1f5f9',
                    color: timerActive ? '#0284c7' : timerFinished ? '#15803d' : '#64748b',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {timerActive
                    ? isGu ? '● સબમર્સિબલ પંપ ચાલુ છે' : '● Borewell Pump Flowing'
                    : timerFinished
                    ? isGu ? '✓ સિંચાઈ પૂર્ણ થઈ! પંપ બંધ કરો' : '✓ Irrigation Completed! Shut Off Pump'
                    : isGu ? 'વિરામ (Standby)' : 'Standby / Paused'}
                </span>
              </div>

              {/* Saturation Progress Bar */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>
                  <span>{isGu ? 'મૂળ વિસ્તાર ભેજ સંતૃપ્તિ' : 'Root Zone Saturation'}</span>
                  <span style={{ fontWeight: 800, color: '#0284c7' }}>{progressPercent}%</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              {/* Live Liters Delivered Real-Time Counter */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0f2fe',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>WATER DELIVERED</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0284c7' }}>
                    {waterDeliveredSoFar.toLocaleString()} L
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Target: {calcResult?.waterMetrics?.totalLiters?.toLocaleString() || 0} L</span>
                </div>

                <div style={{ width: '1px', height: '36px', backgroundColor: '#e2e8f0' }} />

                <div>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>FLOW RATE</span>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                    {calcResult?.flowRateLpm || 140} LPM
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8' }}>Drip manifold</span>
                </div>
              </div>

              {/* Timer Control Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                {!timerActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (timerSecondsLeft === 0) {
                        setTimerSecondsLeft(timerTotalSeconds);
                        setWaterDeliveredSoFar(0);
                        setTimerFinished(false);
                      }
                      setTimerActive(true);
                    }}
                    style={{
                      flex: 2,
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                    }}
                  >
                    <Play size={18} fill="#ffffff" />
                    <span>{isGu ? 'ટાઈમર શરૂ કરો' : 'Start Timer'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setTimerActive(false)}
                    style={{
                      flex: 2,
                      padding: '0.85rem',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: '#d97706',
                      color: '#ffffff',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Pause size={18} fill="#ffffff" />
                    <span>{isGu ? 'વિરામ (Pause)' : 'Pause Timer'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setTimerActive(false);
                    setTimerSecondsLeft(timerTotalSeconds);
                    setWaterDeliveredSoFar(0);
                    setTimerFinished(false);
                  }}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <RotateCcw size={16} />
                  <span>{isGu ? 'રીસેટ' : 'Reset'}</span>
                </button>
              </div>

              {/* Log Completed Session Action */}
              <div style={{ marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={handleSaveLog}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '10px',
                    border: '1px solid #bbf7d0',
                    backgroundColor: '#f0fdf4',
                    color: '#166534',
                    fontSize: '0.86rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Save size={16} />
                  <span>{isGu ? 'સિંચાઈ સત્ર ઈતિહાસમાં સાચવો' : 'Save Session to History'}</span>
                </button>
                {logSuccessMessage && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#16a34a', fontWeight: 700 }}>
                    {logSuccessMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Telemetry Card: Water & Electricity Savings */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.75rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', color: 'var(--green-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="#16a34a" />
                <span>{isGu ? 'જળ અને વીજળી બચત આંકડા' : 'Water & Cost Conservation'}</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ backgroundColor: '#f0fdf4', borderRadius: '12px', padding: '1rem', border: '1px solid #dcfce7' }}>
                  <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'ચોખ્ખી પાણી બચત' : 'WATER PRESERVED'}
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', marginTop: '2px' }}>
                    {calcResult?.waterMetrics?.waterSavedLiters?.toLocaleString() || '18,500'} L
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#166534' }}>
                    {calcResult?.waterMetrics?.savingsPercent || 52}% vs Flood Furrow
                  </span>
                </div>

                <div style={{ backgroundColor: '#fef3c7', borderRadius: '12px', padding: '1rem', border: '1px solid #fde68a' }}>
                  <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>
                    {isGu ? 'વીજળી બિલ બચત' : 'POWER BILL SAVING'}
                  </span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                    ₹{calcResult?.energyMetrics?.billSavingsInr || '168'}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#92400e' }}>
                    {calcResult?.energyMetrics?.unitsSavedKwh || 35} kWh Units Saved
                  </span>
                </div>
              </div>

              {/* GGRC Drip Subsidy Info Pill */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '0.85rem',
                  fontSize: '0.8rem',
                  color: '#475569',
                  lineHeight: 1.5,
                }}
              >
                <Award size={16} color="#d97706" style={{ display: 'inline', marginRight: '6px', verticalAlign: '-3px' }} />
                <span>
                  {isGu
                    ? 'ગુજરાત ગ્રીન રિવોલ્યુશન કંપની (GGRC) યોજના હેઠળ નાના અને સીમાંત ખેડૂતોને ટપક સિંચાઈ પદ્ધતિ પર ૭૦% સુધીની સરકારી સબસિડી ઉપલબ્ધ છે.'
                    : 'GGRC (Gujarat Green Revolution Company) provides up to 70% government subsidy on Drip Irrigation for small & marginal farmers.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: RECENT IRRIGATION LOGS HISTORY
            ========================================================================= */}
        <div
          style={{
            marginTop: '2.5rem',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--green-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--green-primary)" />
              <span>{isGu ? 'તાજેતરનો સિંચાઈ ઈતિહાસ' : 'Recent Irrigation Session History'}</span>
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {logs.length} {isGu ? 'સત્રો નોંધાયા' : 'Sessions Logged'}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'પાક' : 'Crop'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'વિસ્તાર' : 'Area'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'પદ્ધતિ' : 'Method'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'સમયગાળો' : 'Duration'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'પાણી (લિટર)' : 'Delivered'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'બચત (લિટર)' : 'Saved'}</th>
                  <th style={{ padding: '0.75rem 1rem' }}>{isGu ? 'તારીખ' : 'Date'}</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--green-deep)' }}>
                      {log.cropName}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                      {log.areaVigha} {isGu ? 'વીઘા' : 'Vigha'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span
                        style={{
                          backgroundColor: log.method === 'drip' ? '#f0fdf4' : '#f8fafc',
                          color: log.method === 'drip' ? '#15803d' : '#64748b',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'capitalize',
                        }}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#334155' }}>
                      {log.durationMinutes} {isGu ? 'મિનિટ' : 'mins'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#0284c7' }}>
                      {log.waterDeliveredLiters.toLocaleString()} L
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#16a34a' }}>
                      +{log.waterSavedLiters.toLocaleString()} L
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(log.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IrrigationTimer;
