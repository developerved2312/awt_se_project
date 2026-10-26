import React, { useState } from 'react';
import {
  Sprout,
  Flame,
  Camera,
  BarChart3,
  Shield,
  Compass,
  ArrowRight,
  Leaf,
  CheckCircle2,
  TreeDeciduous,
  Droplets,
  Sun,
  Layers,
  MapPin,
  Users,
  ChevronDown,
  HelpCircle,
  Sparkles,
  Activity,
} from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { getTranslation } from '../services/translationService';

export const Home = ({
  currentLang = 'en',
  onNavigateToScanner,
  onNavigateToMandi,
  onNavigateToHeatMap,
  onNavigateToIrrigation,
  onNavigateToWeather,
  onNavigateToProfile,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const t = getTranslation(currentLang);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreModules = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const btn = document.getElementById('nav-module-dropdown-btn');
      if (btn) {
        btn.click();
        btn.focus();
      }
    }, 150);
  };

  const isGu = currentLang === 'gu';

  return (
    <div id="haritayan-home-page" style={{ paddingBottom: '2rem' }}>
      {/* =========================================================================
          HERO SECTION
          ========================================================================= */}
      <section
        id="hero-top"
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
          position: 'relative',
        }}
      >
        <div className="container">
          <AlertCard
            title={isGu ? "IMD વડોદરા હવામાન સલાહ" : "IMD Vadodara Weather Advisory"}
            badgeText={isGu ? "વડોદરા હવામાન કેન્દ્ર" : "Vadodara Weather Station"}
            message={
              isGu
                ? "વડોદરા સેન્ટ્રલ અને મકરપુરા વિસ્તારમાં ગરમી વધારે હોવાથી બપોરે ૧૨ થી ૩:૩૦ દરમિયાન પિયત ટાળીને સાંજે ટપક સિંચાઈ કરવા ભલામણ છે."
                : "Hot daytime temperatures recorded in parts of Vadodara. It is recommended to water crops in the evening rather than during peak afternoon hours (12:00 to 15:30) to save water."
            }
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '2.5rem',
              alignItems: 'center',
            }}
            className="hero-grid"
          >
            <div>
              <div className="badge badge-leaf" style={{ marginBottom: '1.25rem' }}>
                <Leaf size={14} />
                <span>{isGu ? "સ્માર્ટ ખેતી અને હરિયાળું શહેર પ્લેટફોર્મ" : "Smart Agriculture & Green City Platform"}</span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                  color: 'var(--text-title)',
                }}
              >
                {isGu ? "હરિત અયન" : "HaritAyan"}{' '}
                <span style={{ color: 'var(--green-primary)' }}>
                  {isGu ? "— એક હરિત ભવિષ્ય તરફની યાત્રા" : "— A Journey Towards a Greener Future"}
                </span>
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.7,
                  color: 'var(--text-body)',
                  marginBottom: '1.5rem',
                  maxWidth: '620px',
                }}
              >
                {isGu
                  ? "હરિત અયન એક સરળ સ્માર્ટ એગ્રીકલ્ચર પ્લેટફોર્મ છે જે વડોદરાના ખેડૂતો, માળીઓ અને નાગરિકોને પાકના રોગો ઓળખવામાં, વૃક્ષોથી શહેર ઠંડુ રાખવામાં અને રોજના મંડી બજાર ભાવો જાણવામાં મદદ કરે છે."
                  : "HaritAyan is a simple smart agriculture and green city platform created to help farmers, gardeners, and citizens check plant diseases, protect crops, cool neighborhoods with shade trees, and view live mandi rates in Vadodara."}
              </p>

              {/* Sanskrit Slogan Pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--dry-leaf-soft)',
                  border: '1px solid var(--dry-leaf-border)',
                  marginBottom: '2rem',
                  fontSize: '0.86rem',
                  color: 'var(--dry-leaf-dark)',
                  fontWeight: 600,
                }}
              >
                <Sprout size={16} />
                <span>
                  {isGu
                    ? "હરિત (વનસ્પતિ અને હરિયાળી) + અયન (અવિરત સાર્થક યાત્રા)"
                    : "Harit (हरित: Green Vegetation) + Ayan (अयन: Purposeful Journey)"}
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
                <button
                  type="button"
                  onClick={onNavigateToScanner}
                  className="btn btn-primary"
                  style={{ fontWeight: 700, padding: '0.65rem 1.25rem' }}
                >
                  <Activity size={17} />
                  <span>{isGu ? "પાક રોગ સ્કેનર" : "Plant Disease Scanner"}</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleExploreModules}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.15rem' }}
                  title="Open Modules Menu in Navigation"
                >
                  <Layers size={17} />
                  <span>{isGu ? "મોડ્યુલ્સ જુઓ" : "Explore Modules"}</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToIrrigation}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.15rem' }}
                >
                  <Droplets size={17} color="#0284c7" />
                  <span>{isGu ? "સિંચાઈ ટાઈમર" : "Irrigation Timer"}</span>
                </button>

                <button
                  type="button"
                  onClick={onNavigateToProfile}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.15rem' }}
                >
                  <Shield size={17} />
                  <span>{isGu ? "કિસાન-અધિકારી ડેસ્ક" : "Farmer & Officer Desk"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('about-section')}
                  className="btn btn-secondary"
                  style={{ padding: '0.65rem 1.15rem' }}
                >
                  <Compass size={17} />
                  <span>{isGu ? "હરિત અયન વિશે" : "About HaritAyan"}</span>
                </button>
              </div>
            </div>

            {/* Natural Hero Image Card */}
            <div>
              <div
                className="organic-card"
                style={{
                  padding: '0.65rem',
                  borderRadius: 'var(--radius-lg)',
                  background: '#ffffff',
                }}
              >
                <img
                  src="/images/hero-banner.jpg"
                  alt="HaritAyan Sustainable Agriculture & Plant Management in Vadodara"
                  style={{
                    width: '100%',
                    height: '350px',
                    objectFit: 'cover',
                    borderRadius: 'calc(var(--radius-lg) - 6px)',
                  }}
                />
                <div
                  style={{
                    padding: '0.85rem 0.5rem 0.35rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <span>📍 {isGu ? "વડોદરા જિલ્લો કવરેજ" : "Vadodara District Grid"}</span>
                  <span style={{ color: 'var(--green-primary)', fontWeight: 700 }}>
                    🌱 {isGu ? "સસ્ટેનેબલ એગ્રીકલ્ચર" : "Sustainable Agri-Tech"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHAT THE APP IS ALL ABOUT (MISSION & OBJECTIVES)
          ========================================================================= */}
      <section
        id="about-section"
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span className="badge badge-leaf" style={{ marginBottom: '0.75rem' }}>
              {isGu ? "પ્લેટફોર્મ વિશે" : "About the Platform"}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isGu ? "હરિત અયન શા માટે?" : "What HaritAyan is All About"}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              {isGu
                ? "હરિત અયનનો મુખ્ય ઉદ્દેશ્ય સરળ ખેતી પદ્ધતિઓને પ્રોત્સાહન આપવાનો, પાકનું નુકસાન ઘટાડવાનો અને સામાન્ય ખેડૂતો તેમજ નાગરિકો સુધી ઉપયોગી માહિતી પહોંચાડવાનો છે."
                : "The goal of HaritAyan is to help farmers protect crops, support tree planting to cool our city, and provide easy-to-use digital tools for everyone in Vadodara."}
            </p>
          </div>

          <div className="grid-4">
            <div
              className="organic-card"
              style={{ padding: '1.6rem', cursor: 'pointer' }}
              onClick={onNavigateToScanner}
              title="Click to launch AI Plant Scanner"
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-tint-green)',
                  color: 'var(--green-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Camera size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {isGu ? "પાક રોગ ઓળખ" : "Plant Disease Check"}
                </h3>
                <span style={{ color: 'var(--green-primary)', fontSize: '0.78rem', fontWeight: 700 }}>
                  {isGu ? 'ખોલો →' : 'Launch →'}
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "પાંદડાના ફોટા પરથી રોગની ત્વરિત ઓળખ અને ખેડૂતો માટે સરળ કુદરતી તથા યોગ્ય દવાઓના ઉપાય."
                  : "Take a photo of sick leaves to identify crop disease and receive simple organic and spray remedies."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.6rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--dry-leaf-soft)',
                  color: 'var(--dry-leaf-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Droplets size={20} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {isGu ? "ખેતી અને પાક સલાહ" : "Helpful Farm Advice"}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "પિયતનો યોગ્ય સમય, જમીનની સંભાળ, ખાતરનો વપરાશ અને ઋતુ આધારિત પાકની સારસંભાળ."
                  : "Helpful advice on watering times, soil care, balanced fertilizers, and season-based crop tips."}
              </p>
            </div>

            <div
              className="organic-card"
              style={{ padding: '1.6rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => onNavigateToHeatMap && onNavigateToHeatMap()}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              title="Click to launch Urban Heat & Tree Cooling Observatory"
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--olive-wash)',
                  color: 'var(--olive-sage)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <TreeDeciduous size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  {isGu ? "શહેરમાં વૃક્ષોથી ઠંડક" : "City Tree Cooling"}
                </h3>
                <span style={{ color: 'var(--green-primary)', fontSize: '0.78rem', fontWeight: 700 }}>
                  {isGu ? 'ખોલો →' : 'Launch →'}
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "વડોદરાના વિસ્તારોમાં ગરમીનું પ્રમાણ અને છાંયડાવાળા વૃક્ષો વાવવાથી મળતી ઠંડક."
                  : "See warm zones in Vadodara and discover how planting shade trees helps cool your area."}
              </p>
            </div>

            <div
              className="organic-card"
              style={{ padding: '1.6rem', cursor: 'pointer', transition: 'all 0.2s ease' }}
              onClick={() => onNavigateToMandi && onNavigateToMandi()}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'var(--bg-tint-leaf)',
                  color: 'var(--earth-clay)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <BarChart3 size={20} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                  {isGu ? "રોજના APMC મંડી ભાવ" : "Daily APMC Mandi Rates"}
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#15803d', fontWeight: 700, backgroundColor: 'rgba(34, 197, 94, 0.12)', padding: '2px 8px', borderRadius: '12px' }}>
                  Live
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "વડોદરા જિલ્લાની મુખ્ય મંડીઓના રોજના પાકના ભાવો ગુજરાતી અને અંગ્રેજીમાં સરળતાથી જુઓ."
                  : "Check daily market prices across Vadodara district APMCs with clear rates in Gujarati and English."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          KEY PLATFORM FEATURES (OVERVIEW)
          ========================================================================= */}
      <section id="modules-section" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span className="badge badge-leaf" style={{ marginBottom: '0.75rem' }}>
              {isGu ? "મુખ્ય સુવિધાઓ" : "Key Features"}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isGu ? "હરિત અયન દ્વારા મળતી સેવાઓ" : "What HaritAyan Helps You Do"}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              {isGu
                ? "હરિત અયન પાકના રોગ નિદાન, શહેરની ગરમી ઘટાડવા અને મંડી બજાર ભાવ જાણવા માટે ઉપયોગી સુવિધાઓ આપે છે."
                : "HaritAyan brings together simple, useful tools to check crop diseases, view tree cooling benefits, and check mandi crop prices."}
            </p>
          </div>

          <div className="grid-2">
            {/* Urban Heat & Tree Cooling Map */}
            <div id="module-01" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--green-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'var(--bg-tint-green)', color: 'var(--green-deep)' }}>
                  {isGu ? "શહેરી ગરમી" : "City Heat"}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {isGu ? "વૃક્ષ કૂલિંગ" : "Tree Cooling"}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "શહેરની ગરમી અને વૃક્ષારોપણ કૂલિંગ નકશો" : "City Heat & Tree Cooling Map"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "વડોદરા શહેરના ગરમ વિસ્તારો દર્શાવતો નકશો જે વૃક્ષારોપણ કરવાથી તાપમાનમાં થતા ઘટાડાનો અંદાજ આપે છે."
                  : "Interactive Vadodara map showing heat zones and estimating how planting shade trees can cool down neighborhoods."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Key Benefits:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--green-primary)" />
                    <span>{isGu ? "વડોદરાના વિવિધ વિસ્તારોમાં ગરમીની તપાસ" : "Ward-level temperature checks across Vadodara"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--green-primary)" />
                    <span>{isGu ? "દેશી વૃક્ષો (લીમડો, પીપળો, જાંબુ) વાવવાથી ઠંડકમાં ફાયદો" : "Cooling benefits from planting native shade trees"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--green-primary)" />
                    <span>{isGu ? "ગ્રીન કવર અને પર્યાવરણ સુધારણા અંદાજ" : "Green cover and environmental improvement estimate"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* AI Plant Disease Scanner */}
            <div id="module-02" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--dry-leaf)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-leaf">
                  {isGu ? "પાક રોગ" : "Crop Health"}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {isGu ? "AI સ્કેનર" : "AI Scanner"}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "જેમિની AI પાક રોગ સ્કેનર" : "Gemini AI Plant Disease Scanner"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "પાનનો ફોટો પાડીને રોગ ઓળખો અને ગુજરાતી તથા અંગ્રેજીમાં સરળ ઉપાયો મેળવો."
                  : "Snap a photo of any crop leaf to identify diseases and get simple remedies in English and Gujarati."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Key Benefits:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--dry-leaf)" />
                    <span>{isGu ? "કપાસ, ટામેટા, દિવેલા અને શાકભાજીના રોગ ઓળખવા" : "Find diseases on Cotton, Tomato, Castor, and Vegetables"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--dry-leaf)" />
                    <span>{isGu ? "ગુજરાતી અને અંગ્રેજીમાં સરળ દેશી દવાઓ અને ઉપાયો" : "Simple remedies and medicine sprays in English & Gujarati"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--dry-leaf)" />
                    <span>{isGu ? "વૃક્ષારોપણ માટે અનુકૂળ જગ્યા અને જમીનની માહિતી" : "Helpful tips on soil suitability and planting spots"}</span>
                  </li>
                </ul>

                <div style={{ marginTop: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={onNavigateToScanner}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.65rem 1rem' }}
                  >
                    <Activity size={16} />
                    <span>{isGu ? "પાક રોગ સ્કેનર શરૂ કરો" : "Launch AI Disease Scanner"}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Real-Time APMC Mandi Rates */}
            <div id="module-03" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--earth-ochre)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: '#fdf3e7', color: 'var(--earth-clay)', borderColor: 'rgba(212, 163, 115, 0.4)' }}>
                  {isGu ? "મંડી ભાવ" : "Mandi Rates"}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {isGu ? "લાઈવ બજાર" : "Live Market"}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "રીયલ-ટાઇમ APMC મંડી ભાવ" : "Real-Time APMC Mandi Prices"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "વડોદરા જિલ્લાની મુખ્ય APMC મંડીઓમાં પાકના રોજના બજાર ભાવો સરળતાથી જાણો."
                  : "Daily agricultural crop prices from major APMC market yards across Vadodara District."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Key Benefits:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--earth-clay)" />
                    <span>{isGu ? "સયાજીગંજ, પાદરા, કરજણ, ડભોઇ અને સાવલી APMC બજાર ભાવો" : "Live prices for Sayajigunj, Padra, Karjan, Dabhoi, and Savli APMCs"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--earth-clay)" />
                    <span>{isGu ? "કપાસ, દિવેલા, તુવેર, ઘઉં અને શાકભાજીના રોજના સરેરાશ ભાવો" : "Daily average modal prices and market arrivals"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--earth-clay)" />
                    <span>{isGu ? "ખેડૂતો માટે સરળ ગુજરાતીમાં ભાવની માહિતી" : "Easy-to-read market price trends in Gujarati"}</span>
                  </li>
                </ul>

                <div style={{ marginTop: '1.25rem' }}>
                  <button
                    onClick={() => onNavigateToMandi && onNavigateToMandi()}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      borderRadius: '10px',
                      padding: '0.65rem 1rem',
                      fontWeight: 700,
                      borderColor: 'var(--earth-ochre)',
                      color: 'var(--earth-clay)',
                      backgroundColor: '#fffdfa',
                    }}
                  >
                    <BarChart3 size={16} />
                    <span>{isGu ? "APMC મંડી ભાવ એન્જિન ખોલો" : "Explore APMC Mandi Rates"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Weather Alerts & Notice Panel */}
            <div id="module-04" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--olive-sage)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-olive">
                  {isGu ? "હવામાન" : "Weather"}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {isGu ? "ચેતવણી" : "Alerts"}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "હવામાન ચેતવણી અને સંચાલન" : "Weather Alerts & Notice Panel"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "ગરમીની ચેતવણીઓ, મંડી દરો અને સિસ્ટમ મોનિટરિંગનું સંચાલન કરવા માટેનું ડેશબોર્ડ."
                  : "Overview dashboard for viewing weather heat alerts, managing mandi rates, and checking app health."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Key Benefits:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--olive-sage)" />
                    <span>{isGu ? "હીટવેવ અને વધુ ગરમીની વહેલી ચેતવણી" : "Early heatwave alerts and farming notices"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--olive-sage)" />
                    <span>{isGu ? "મંડી દરોની નિયમિત ચકાસણી અને અપડેટ" : "Regular verification and updates for mandi rates"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--olive-sage)" />
                    <span>{isGu ? "AI સ્કેનર સિસ્ટમનું સતત મોનિટરિંગ" : "Continuous checking of AI scanner performance"}</span>
                  </li>
                </ul>

                <div style={{ marginTop: '1.25rem' }}>
                  <button
                    onClick={() => onNavigateToWeather && onNavigateToWeather()}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      borderRadius: '10px',
                      padding: '0.65rem 1rem',
                      fontWeight: 700,
                      borderColor: 'var(--olive-sage)',
                      color: 'var(--green-deep)',
                      backgroundColor: '#fbfcf8',
                    }}
                  >
                    <Shield size={16} />
                    <span>{isGu ? "હવામાન આગાહી અને એલર્ટ જુઓ" : "Open Weather & Alerts Hub"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Smart Irrigation Timer & Water Conservation */}
            <div id="module-irrigation" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid #0284c7' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}>
                  {isGu ? "સ્માર્ટ સિંચાઈ" : "Smart Irrigation"}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#0284c7', fontWeight: 700 }}>
                  {isGu ? "ઓટો-ટાઈમર" : "Auto-Timer"}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "સ્માર્ટ સિંચાઈ ટાઈમર અને જળ વ્યવસ્થાપન" : "Smart Irrigation Timer & Advisory"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "વડોદરા જિલ્લાના પાક, જમીન અને MGVCL ૩-ફેઝ વીજળી શેડ્યૂલ મુજબ ચોક્કસ પાણી ગણતરી અને લાઇવ ટાઈમર."
                  : "Precision root-zone moisture balancing, live runtime countdown, and MGVCL 3-phase agricultural power roster."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Key Benefits:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#0284c7" />
                    <span>{isGu ? "કપાસ, કેળ, ટામેટા અને તુવેર માટે લિટર અને રન-ટાઇમ ગણતરી" : "Calculates precise runtime & liters for Cotton, Banana, and Tomato"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#0284c7" />
                    <span>{isGu ? "લાઇવ કાઉન્ટડાઉન ટાઈમર અને પંપ બંધ કરવાની એલાર્મ રીંગ" : "Live countdown timer with pump shutoff chime alerts"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="#0284c7" />
                    <span>{isGu ? "MGVCL જ્યોતિગ્રામ ૩-ફેઝ ૮ કલાક વીજળી શિફ્ટ ટ્રેકર" : "Vadodara DISCOM MGVCL 3-phase 8-hour agricultural power roster"}</span>
                  </li>
                </ul>

                <div style={{ marginTop: '1.25rem' }}>
                  <button
                    onClick={() => onNavigateToIrrigation && onNavigateToIrrigation()}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      borderRadius: '10px',
                      padding: '0.65rem 1rem',
                      fontWeight: 700,
                      borderColor: '#0284c7',
                      color: '#0369a1',
                      backgroundColor: '#f0f9ff',
                    }}
                  >
                    <Droplets size={16} />
                    <span>{isGu ? "સિંચાઈ ટાઈમર શરૂ કરો" : "Launch Irrigation Timer"}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          PHILOSOPHY & 4-STEP DIGITAL PATHWAY
          ========================================================================= */}
      <section
        id="vadodara-context"
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg-tint-leaf)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <span className="badge badge-leaf" style={{ marginBottom: '0.75rem' }}>
              {isGu ? "૪ સરળ પગલાં" : "Simple 4-Step Approach"}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isGu ? "શા માટે \"હરિત અયન\"? (Harit Ayan)" : "Why \"Harit Ayan\"? (हरित અયન)"}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              {isGu
                ? "હરિત અયન બે શબ્દો પરથી બનેલું છે: હરિત (હરિયાળી અને સ્વસ્થ પ્રકૃતિ) અને અયન (આગળ વધવાનો સરળ માર્ગ). હરિત અયન આ ૪ સરળ પગલાં દ્વારા મદદ કરે છે:"
                : "Harit Ayan comes from two words: Harit (हरित: greenery and healthy plants) and Ayan (अयन: a clear path forward). Harit Ayan guides you in 4 simple steps:"}
            </p>
          </div>

          <div className="grid-4">
            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--green-primary)', marginBottom: '0.5rem' }}>
                {isGu ? "પગલું ૧ : સ્થિતિ તપાસો" : "Step 1 : Check Conditions"}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "વાતાવરણ જુઓ" : "See the Situation"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "શહેરનો ગરમી નકશો, હવામાન ચેતવણી અને પાંદડાના ફોટા જુઓ."
                  : "Check city heat maps, weather alerts, and leaf scan photos."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--dry-leaf)', marginBottom: '0.5rem' }}>
                {isGu ? "પગલું ૨ : યોગ્ય પગલાં લો" : "Step 2 : Take Action"}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "સાચા ઉપાયો કરો" : "Follow Helpful Tips"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "વૃક્ષારોપણ, યોગ્ય પિયત અને કુદરતી દેશી ઉપાયો અજમાવો."
                  : "Plant shade trees, water at the right time, and try simple remedies."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--earth-clay)', marginBottom: '0.5rem' }}>
                {isGu ? "પગલું ૩ : પરિણામ જુઓ" : "Step 3 : See Results"}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "ફાયદો અનુભવો" : "Notice Improvements"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "તાપમાનમાં ઠંડક, સ્વસ્થ પાક અને મંડીમાં સારા ભાવ મેળવો."
                  : "Feel cooler local areas, see healthier plants, and get better crop prices."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--olive-sage)', marginBottom: '0.5rem' }}>
                {isGu ? "પગલું ૪ : વધુ સારો સુધારો" : "Step 4 : Grow & Improve"}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "હંમેશા આગળ વધો" : "Keep Improving"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "સરળ ડિજિટલ માર્ગદર્શન જે ખેતી અને શહેરને હંમેશા હરિયાળું રાખે છે."
                  : "Simple digital guidance that helps your farming and city stay green."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GENERAL FAQS SECTION
          ========================================================================= */}
      <section
        id="faq-section"
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '3.5rem',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div className="badge badge-leaf" style={{ marginBottom: '0.85rem' }}>
              <HelpCircle size={14} />
              <span>{t.faqs?.kicker || (isGu ? "સામાન્ય પ્રશ્નોત્તરી (FAQ)" : "Frequently Asked Questions")}</span>
            </div>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)',
                fontWeight: 800,
                color: 'var(--text-title)',
                marginBottom: '0.75rem',
              }}
            >
              {t.faqs?.title || (isGu ? "સામાન્ય પ્રશ્નો અને સરળ જવાબો" : "Common Questions & Simple Answers")}
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              {t.faqs?.subtitle || (isGu ? "હરિત અયન, પાકના રોગની તપાસ, વૃક્ષોની ઠંડક અને મંડી ભાવો વિશેના જવાબો." : "Quick answers about using HaritAyan, checking plant diseases, city tree cooling, and mandi prices.")}
            </p>
          </div>

          <div className="faq-container">
            {t.faqs?.items?.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-trigger"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    id={`faq-btn-${index}`}
                  >
                    <span>{item.q}</span>
                    <ChevronDown size={19} className="faq-chevron" />
                  </button>
                  {isOpen && (
                    <div className="faq-body" id={`faq-answer-${index}`}>
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
