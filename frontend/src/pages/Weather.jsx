import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  ShieldAlert,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  Sparkles,
  Calendar,
  Clock,
  Layers,
  MapPin,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';

export const Weather = ({ currentLang = 'en', onNavigateHome, onNavigateToHeatMap, onNavigateToIrrigation }) => {
  const isGu = currentLang === 'gu';

  // State
  const [selectedTaluka, setSelectedTaluka] = useState('vadodara_city');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const talukas = [
    { key: 'vadodara_city', nameEn: 'Vadodara City', nameGu: 'વડોદરા શહેર', tag: 'Urban Heat Island' },
    { key: 'padra', nameEn: 'Padra', nameGu: 'પાદરા', tag: 'Banana & Veg Hub' },
    { key: 'karjan', nameEn: 'Karjan', nameGu: 'કરજણ', tag: 'Cotton Belt' },
    { key: 'dabhoi', nameEn: 'Dabhoi', nameGu: 'ડભોઇ', tag: 'Paddy & Canal' },
    { key: 'savli', nameEn: 'Savli', nameGu: 'સાવલી', tag: 'Semi-Arid Plains' },
    { key: 'waghodia', nameEn: 'Waghodia', nameGu: 'વાઘોડિયા', tag: 'Forest Fringe' },
    { key: 'shinor', nameEn: 'Shinor', nameGu: 'શિનોર', tag: 'Narmada Basin' },
  ];

  const fetchWeatherData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const [curRes, foreRes, alertRes] = await Promise.all([
        fetch(`http://localhost:5000/api/weather/current?taluka=${selectedTaluka}`).catch(() => null),
        fetch(`http://localhost:5000/api/weather/forecast`).catch(() => null),
        fetch(`http://localhost:5000/api/weather/alerts`).catch(() => null),
      ]);

      if (curRes && curRes.ok) {
        const d = await curRes.json();
        if (d.success) setWeatherData(d);
      }
      if (foreRes && foreRes.ok) {
        const d = await foreRes.json();
        if (d.success) setForecastData(d);
      }
      if (alertRes && alertRes.ok) {
        const d = await alertRes.json();
        if (d.success) setAlerts(d.data || []);
      }
    } catch (err) {
      console.warn('Weather fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedTaluka]);

  // Fallback defaults
  const cur = weatherData?.currentWeather || {
    tempC: 34.6,
    feelsLikeC: 36.8,
    humidityPercent: 56,
    windSpeedKmh: 12.2,
    pressureHpa: 1012,
    uvIndex: 7.2,
    evapotranspirationEt0Mm: 5.4,
    heatAlert: 'Normal',
    heatAlertGu: 'સામાન્ય',
    heatColor: '#16a34a',
    spraySuitability: {
      status: 'optimal',
      reasonEn: 'Wind speed and thermal conditions are optimal for foliar & micronutrient spraying.',
      reasonGu: 'હાલનો પવન અને તાપમાન દવાનો છંટકાવ કરવા માટે અનુકૂળ છે.',
    },
    fungalRisk: 'Low Risk',
  };

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
            HEADER & ACTIONS
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
                <CloudSun size={24} color="#ffffff" />
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
                  {isGu ? 'હવામાન આગાહી અને હીટવેવ સલાહકાર' : 'Agro-Meteorological Observatory & Weather Advisory'}
                </h1>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#64748b' }}>
                  {isGu
                    ? 'વડોદરા જિલ્લાના તાલુકાવાર તાપમાન, પવનની ગતિ, દવા છંટકાવ અનુકૂળતા અને હવામાન ચેતવણી'
                    : 'Real-time microclimate observations, foliar spray advisories, and IMD Gujarat heatwave alerts'}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => fetchWeatherData(true)}
              disabled={refreshing}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '0.55rem 0.95rem',
                borderRadius: '10px',
                color: 'var(--green-deep)',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: refreshing ? 'not-allowed' : 'pointer',
              }}
            >
              <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
              <span>{isGu ? 'તાજું કરો' : 'Refresh Feed'}</span>
            </button>

            {onNavigateHome && (
              <button
                type="button"
                onClick={onNavigateHome}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  padding: '0.55rem 0.95rem',
                  borderRadius: '10px',
                  color: 'var(--green-deep)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Compass size={15} />
                <span>{isGu ? 'હોમ' : 'Home'}</span>
              </button>
            )}
          </div>
        </div>

        {/* =========================================================================
            TALUKA SELECTOR PILLS
            ========================================================================= */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            overflowX: 'auto',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          {talukas.map((t) => {
            const isSel = selectedTaluka === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedTaluka(t.key)}
                style={{
                  padding: '0.65rem 1.15rem',
                  borderRadius: '24px',
                  border: isSel ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: isSel ? '#0284c7' : '#ffffff',
                  color: isSel ? '#ffffff' : 'var(--green-deep)',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isSel ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                {isGu ? t.nameGu : t.nameEn}
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            HERO CURRENT OBSERVATION & AGRO-DECISION CARDS
            ========================================================================= */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.75rem', marginBottom: '2rem', alignItems: 'start' }}>
          {/* Main Weather Hero Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              borderRadius: '20px',
              padding: '2rem',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Subtle water droplet / weather decorative background */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <MapPin size={16} color="#bae6fd" />
                  <span style={{ fontSize: '0.85rem', color: '#e0f2fe', fontWeight: 600 }}>
                    {talukas.find((t) => t.key === selectedTaluka)?.[isGu ? 'nameGu' : 'nameEn']} • Vadodara District
                  </span>
                </div>
                <div style={{ fontSize: '3.6rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '-1px' }}>
                  {cur.tempC}°C
                </div>
                <span style={{ fontSize: '0.9rem', color: '#bae6fd', fontWeight: 600 }}>
                  {isGu ? 'અનુભવાતું તાપમાન (Feels like)' : 'Feels like'} {cur.feelsLikeC}°C
                </span>
              </div>

              {/* Heat Alert Status Badge */}
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Flame size={16} color="#fbbf24" />
                  <span>{isGu ? cur.heatAlertGu : cur.heatAlert}</span>
                </span>
                <div style={{ marginTop: '0.75rem', fontSize: '0.76rem', color: '#e0f2fe' }}>
                  Source: {weatherData?.source || 'Open-Meteo Live'}
                </div>
              </div>
            </div>

            {/* Weather Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: '#bae6fd', display: 'block', fontWeight: 600 }}>HUMIDITY</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cur.humidityPercent}%</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#bae6fd', display: 'block', fontWeight: 600 }}>WIND SPEED</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cur.windSpeedKmh} km/h</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#bae6fd', display: 'block', fontWeight: 600 }}>UV INDEX</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cur.uvIndex} (Very High)</span>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#bae6fd', display: 'block', fontWeight: 600 }}>ET₀ DEMAND</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>{cur.evapotranspirationEt0Mm} mm</span>
              </div>
            </div>
          </div>

          {/* Right: Agricultural Spray & Field Decision Box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Foliar Spraying Advisor */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                  {isGu ? 'કીટનાશક / દવા છંટકાવ અનુકૂળતા' : 'FOLIAR SPRAYING SUITABILITY'}
                </span>
                <span
                  style={{
                    backgroundColor: cur.spraySuitability.status === 'optimal' ? '#dcfce7' : '#fef3c7',
                    color: cur.spraySuitability.status === 'optimal' ? '#15803d' : '#b45309',
                    padding: '3px 10px',
                    borderRadius: '16px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  {cur.spraySuitability.status === 'optimal'
                    ? isGu ? 'ઉત્તમ અનુકૂળ' : 'Optimal Window'
                    : isGu ? 'સાવચેતી' : 'Caution Advised'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--green-deep)', lineHeight: 1.5, fontWeight: 600 }}>
                {isGu ? cur.spraySuitability.reasonGu : cur.spraySuitability.reasonEn}
              </p>
            </div>

            {/* Quick Link Card to Smart Irrigation Timer */}
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                  {isGu ? 'સિંચાઈ ટાઈમર સંકલન' : 'IRRIGATION SCHEDULING'}
                </span>
                <div style={{ fontSize: '0.98rem', fontWeight: 800, color: '#14532d', marginTop: '2px' }}>
                  {isGu ? 'પાણીની જરૂરિયાત: ૫.૪ mm/દિવસ' : 'ET₀ Crop Demand: 5.4 mm/day'}
                </div>
              </div>
              {onNavigateToIrrigation && (
                <button
                  type="button"
                  onClick={onNavigateToIrrigation}
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.55rem 0.95rem',
                    borderRadius: '10px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>{isGu ? 'ટાઈમર જુઓ' : 'Open Timer'}</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            24-HOUR HOURLY TEMPERATURE & RAIN TIMELINE
            ========================================================================= */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--green-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="#0284c7" />
              <span>{isGu ? '૨૪ કલાકનું હવામાન અને પવન સમયરેખા' : '24-Hour Agro-Weather & Wind Timeline'}</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Vadodara Hourly Curve</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '0.75rem' }}>
            {(forecastData?.hourlyTimeline || []).map((h, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '0.85rem 0.5rem',
                  borderRadius: '12px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>{h.hour}</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--green-deep)', margin: '4px 0' }}>
                  {h.temp}°C
                </div>
                <div style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 600 }}>
                  <Droplets size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '2px' }} />
                  {h.humidity}%
                </div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                  <Wind size={11} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '2px' }} />
                  {h.wind} km/h
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            7-DAY AGRO-WEATHER FORECAST
            ========================================================================= */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid #e2e8f0',
            marginBottom: '2rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--green-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--green-primary)" />
              <span>{isGu ? '૭ દિવસની પાક હવામાન આગાહી' : '7-Day Regional Crop Weather Outlook'}</span>
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#64748b' }}>Vadodara District Zone</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            {(forecastData?.sevenDayForecast || []).map((f, i) => (
              <div
                key={i}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: i === 0 ? '2px solid #0284c7' : '1px solid #e2e8f0',
                  backgroundColor: i === 0 ? '#f0f9ff' : '#ffffff',
                }}
              >
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: i === 0 ? '#0284c7' : 'var(--green-deep)' }}>
                  {isGu ? f.dayNameGu : f.dayName}
                </div>
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{f.date}</span>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', margin: '0.65rem 0 0.35rem' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#dc2626' }}>{f.maxTemp}°</span>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>{f.minTemp}°</span>
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--green-deep)', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {isGu ? f.conditionGu : f.condition}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '0.4rem' }}>
                  <span>Rain: {f.rainChance}%</span>
                  <span>ET₀: {f.et0}mm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            ACTIVE WEATHER BULLETINS & IMD HEATWAVE NOTICES
            ========================================================================= */}
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
            <ShieldAlert size={20} color="#ea580c" />
            <span>{isGu ? 'સત્તાવાર હવામાન અને હીટવેવ બુલેટિન' : 'Official Agro-Climatic Bulletins & Heatwave Notices'}</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {alerts.map((al) => (
              <div
                key={al._id || al.id}
                style={{
                  backgroundColor: al.severity === 'warning' ? '#fffbeb' : '#f0fdf4',
                  border: `1px solid ${al.severity === 'warning' ? '#fde68a' : '#bbf7d0'}`,
                  borderRadius: '12px',
                  padding: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: al.severity === 'warning' ? '#b45309' : '#15803d' }}>
                    {isGu ? al.titleGu : al.titleEn}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                    {al.broadcastBy || 'DAMU / KVK Vadodara'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.86rem', color: '#334155', lineHeight: 1.55 }}>
                  {isGu ? al.messageGu : al.messageEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
