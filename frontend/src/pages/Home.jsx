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
} from 'lucide-react';
import AlertCard from '../components/AlertCard';
import { getTranslation } from '../services/translationService';

export const Home = ({ currentLang = 'en', onNavigateToScanner }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const t = getTranslation(currentLang);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
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
            title={isGu ? "IMD વડોદરા હીટવેવ સલાહકાર સક્રિય" : "IMD Vadodara Agro-Climatic Advisory"}
            badgeText={isGu ? "વડોદરા હવામાન કેન્દ્ર" : "Vadodara Station"}
            message={
              isGu
                ? "વડોદરા સેન્ટ્રલ અને મકરપુરા વિસ્તારમાં ગરમીની તીવ્રતા વધારે હોવાથી બપોરે ૧૨ થી ૩:૩૦ દરમિયાન પિયત ટાળીને સાંજે ટપક સિંચાઈ કરવા ભલામણ છે."
                : "Elevated microclimate thermal zones recorded across Vadodara urban pockets. Daytime irrigation between 12:00 and 15:30 should be avoided to prevent excess evaporation losses."
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
                <span>{isGu ? "વડોદરા જિલ્લો કૃષિ અને પર્યાવરણીય પ્લેટફોર્મ" : "Smart Agriculture & Environmental Intelligence Platform"}</span>
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
                  ? "હરિત અયન એક AI-સંચાલિત સ્માર્ટ એગ્રીકલ્ચર અને પ્લાન્ટ મેનેજમેન્ટ પ્લેટફોર્મ છે, જે વડોદરા જિલ્લાના ખેડૂતો, બાગાયતકારો અને સંશોધકોને પાક સ્વાસ્થ્ય સુધારવા, રોગ નિવારણ, શહેરી ગરમી ઘટાડવા અને લાઈવ APMC બજાર ભાવો મેળવવામાં મદદ કરે છે."
                  : "HaritAyan is an AI-powered smart agriculture and plant management platform developed to assist farmers, gardeners, and researchers in monitoring plant health, reducing crop losses, mitigating urban heat islands, and accessing live APMC market data across Vadodara District."}
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
                  className="btn btn-leaf"
                  style={{ fontWeight: 700 }}
                >
                  <Camera size={17} />
                  <span>{isGu ? "પાક રોગ સ્કેન કરો" : "AI Plant Scanner"}</span>
                  <Sparkles size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('modules-section')}
                  className="btn btn-primary"
                >
                  <Layers size={17} />
                  <span>{isGu ? "૪ મુખ્ય મોડ્યુલ્સ જુઓ" : "Explore Core Modules"}</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('about-section')}
                  className="btn btn-secondary"
                >
                  <Compass size={17} />
                  <span>{isGu ? "હરિત અયન મિશન" : "What HaritAyan is All About"}</span>
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
              {isGu ? "પ્લેટફોર્મ પરિચય અને ઉદ્દેશ" : "Platform Overview & Purpose"}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isGu ? "હરિત અયન શા માટે?" : "What HaritAyan is All About"}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              {isGu
                ? "હરિત અયનનો મુખ્ય ઉદ્દેશ્ય ટકાઉ કૃષિ પદ્ધતિઓને પ્રોત્સાહન આપવાનો, કાર્યક્ષમતા વધારવાનો, પાકના નુકસાનને ઘટાડવાનો અને આધુનિક કૃષિ ટેકનોલોજીને દરેક સુધી સુલભ બનાવવાનો છે."
                : "The primary objective of HaritAyan is to promote sustainable agricultural practices, increase efficiency, reduce crop losses, and make modern agricultural and environmental technology accessible to everyone."}
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
                  {isGu ? "રોગ ઓળખ અને નિવારણ" : "Plant Disease Detection"}
                </h3>
                <span style={{ color: 'var(--green-primary)', fontSize: '0.78rem', fontWeight: 700 }}>
                  {isGu ? 'ખોલો →' : 'Launch →'}
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "પાંદડાના લક્ષણો પરથી રોગની ત્વરિત ઓળખ અને ખેડૂતો માટે યોગ્ય નિવારક પગલાંની ભલામણ."
                  : "Recognize visible symptoms of foliar diseases and receive timely scientific and organic preventive guidance."}
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
                {isGu ? "વ્યક્તિગત કૃષિ માર્ગદર્શન" : "Personalized Guidance"}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "પિયત વ્યવસ્થાપન, જમીનની ગુણવત્તા, ખાતર ઉપયોગ અને જીવાત નિયંત્રણ માટે સચોટ સલાહ."
                  : "Guidance on precision irrigation, soil quality, balanced fertilizer use, and weather-based decision-making."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.6rem' }}>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {isGu ? "શહેરી ગરમી ઘટાડો" : "Urban Heat Mitigation"}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "વડોદરાના અર્બન હીટ આઇલેન્ડ ઝોનનું વિશ્લેષણ અને વૃક્ષારોપણથી તાપમાન ઘટાડાનું સિમ્યુલેશન."
                  : "Monitor urban heat zones in Vadodara and simulate the microclimate cooling potential of tree plantation."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.6rem' }}>
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
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {isGu ? "લાઈવ APMC બજાર ભાવ" : "Live APMC Mandi Rates"}
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {isGu
                  ? "વડોદરા જિલ્લાની મુખ્ય મંડીઓના દૈનિક બજાર ભાવો ગુજરાતી ભાષા સપોર્ટ સાથે."
                  : "Real-time market intelligence across Vadodara district APMCs with Gujarati language support."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          THE 4 CORE MODULES (FEATURES OVERVIEW)
          ========================================================================= */}
      <section id="modules-section" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
            <span className="badge badge-leaf" style={{ marginBottom: '0.75rem' }}>
              {isGu ? "પ્લેટફોર્મ આર્કિટેક્ચર" : "Application Core Pillars"}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isGu ? "હરિત અયનના ૪ મુખ્ય મોડ્યુલ્સ" : "Features of the Application Modules"}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              {isGu
                ? "હરિત અયન ૪ સુસંગત મોડ્યુલ્સ દ્વારા પર્યાવરણ અને કૃષિ ઇન્ટેલિજન્સ પૂરું પાડે છે."
                : "HaritAyan is structured into 4 specialized modules designed to address distinct facets of agricultural and environmental monitoring."}
            </p>
          </div>

          <div className="grid-2">
            {/* Module 1 */}
            <div id="module-01" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--green-primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: 'var(--bg-tint-green)', color: 'var(--green-deep)' }}>
                  Module 01
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Urban Resilience
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "અર્બન હીટ મિટિગેશન મેપ અને કૂલિંગ સિમ્યુલેટર" : "Urban Heat Mitigation Map & Cooling Simulator"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "વડોદરા શહેરના હીટ ઝોન દર્શાવતો ઇન્ટરેક્ટિવ મેપ જે વૃક્ષારોપણની તાપમાન ઘટાડા પર થતી અસરનું સિમ્યુલેશન કરે છે."
                  : "Interactive Vadodara heat map that visualizes urban heat zones and simulates the cooling impact of tree plantation."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Module Capabilities:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--green-primary)" />
                    <span>{isGu ? "વડોદરા વોર્ડ-સ્તરીય હીટ આઇલેન્ડ વિશ્લેષણ (મકરપુરા, અલકાપુરી, સયાજીબાગ)" : "Vadodara ward-level urban heat island microclimate analysis"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--green-primary)" />
                    <span>{isGu ? "દેશી વૃક્ષો (લીમડો, પીપળો, જાંબુ) દ્વારા -3.4°C તાપમાન ઘટાડા સિમ્યુલેશન" : "Empirical cooling calculation based on native tree plantation volume"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--green-primary)" />
                    <span>{isGu ? "ગ્રીન કેનોપી કવરેજ ટકાવારી અને કાર્બન શોષણ અંદાજ" : "Canopy coverage index and annual carbon sequestration metrics"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Module 2 */}
            <div id="module-02" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--dry-leaf)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-leaf">
                  Module 02
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Multimodal AI
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "જેમિની AI મલ્ટિમોડલ વિઝન સ્કેનર" : "Gemini AI Multimodal Vision Scanner"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "AI-સંચાલિત ઇમેજ સ્કેનર જે પાકના રોગો ઓળખે છે, રોપણી સ્થળનું મૂલ્યાંકન કરે છે અને દ્વિભાષી ભલામણો આપે છે."
                  : "AI-powered image scanner that identifies crop diseases or evaluates planting sites and provides bilingual recommendations."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Module Capabilities:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--dry-leaf)" />
                    <span>{isGu ? "કપાસ (લીફ કર્લ), ટામેટા (સુકારો), દિવેલા અને શાકભાજીના રોગ નિદાન" : "Pathogen identification for Gujarat crops (Cotton, Tomato, Castor)"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--dry-leaf)" />
                    <span>{isGu ? "ગુજરાતી અને અંગ્રેજીમાં વૈજ્ઞાનિક અને સસ્તી દેશી દવાઓની સલાહ" : "Bilingual treatment advisories in Gujarati and English"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--dry-leaf)" />
                    <span>{isGu ? "જમીન અને પર્યાવરણ મુજબ વૃક્ષારોપણ માટે અનુકૂળ સ્થળ મૂલ્યાંકન" : "Micro-forestry site feasibility and soil suitability assessment"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Module 3 */}
            <div id="module-03" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--earth-ochre)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge" style={{ background: '#fdf3e7', color: 'var(--earth-clay)', borderColor: 'rgba(212, 163, 115, 0.4)' }}>
                  Module 03
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Agri Market Feed
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "રીયલ-ટાઇમ APMC મંડી એન્જિન" : "Real-Time APMC Mandi Engine"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "વડોદરા જિલ્લાની મુખ્ય APMC મંડીઓમાં કૃષિ ઉત્પાદનોના જીવંત ભાવો દર્શાવતું ડેશબોર્ડ ગુજરાતી ભાષા સપોર્ટ સાથે."
                  : "Live agricultural market dashboard showing commodity prices across major APMC markets in Vadodara District with Gujarati language support."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Module Capabilities:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--earth-clay)" />
                    <span>{isGu ? "સયાજીગંજ, પાદરા, કરજણ, ડભોઇ અને સાવલી APMC બજાર ભાવો" : "Coverage of Sayajigunj, Padra, Karjan, Dabhoi, and Savli APMCs"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--earth-clay)" />
                    <span>{isGu ? "કપાસ, દિવેલા, તુવેર, ઘઉં અને શાકભાજીના દૈનિક સરેરાશ ભાવો" : "Modal prices, min/max ranges, and arrival volume indicators"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--earth-clay)" />
                    <span>{isGu ? "ખેડૂતો માટે સંપૂર્ણ ગુજરાતી પારિભાષિક શબ્દાવલિ" : "Commodity trend tracking and native Gujarati terminology"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Module 4 */}
            <div id="module-04" className="organic-card" style={{ padding: '2rem', borderLeft: '4px solid var(--olive-sage)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-olive">
                  Module 04
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  Operations & Control
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.65rem', color: 'var(--text-title)' }}>
                {isGu ? "ઓપરેશન્સ એડમિન પેનલ" : "Operations Admin Panel"}
              </h3>

              <p style={{ fontSize: '0.92rem', color: 'var(--text-body)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {isGu
                  ? "મંડી દરો, હીટવેવ ચેતવણીઓ અને AI સિસ્ટમ મોનિટરિંગનું સંચાલન કરવા માટેનું કેન્દ્રિય વહીવટી ડેશબોર્ડ."
                  : "Centralized administration dashboard for managing mandi rates, heatwave alerts, and AI system monitoring."}
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em', marginBottom: '0.6rem' }}>
                  {isGu ? "મુખ્ય વિશેષતાઓ:" : "Module Capabilities:"}
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.86rem', color: 'var(--text-body)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--olive-sage)" />
                    <span>{isGu ? "IMD હીટવેવ પ્રારંભિક ચેતવણી બ્રોડકાસ્ટિંગ વ્યવસ્થા" : "IMD Heatwave early warning alert dispatching"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--olive-sage)" />
                    <span>{isGu ? "મંડી દર સુધારણા અને ઓવરરાઈડ નિયંત્રણ" : "Mandi rate validation, manual adjustments, and overrides"}</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} color="var(--olive-sage)" />
                    <span>{isGu ? "જેમિની વિઝન AI મોડલ લેટન્સી અને સિસ્ટમ હેલ્થ મોનિટરિંગ" : "Vision AI inference throughput and latency monitoring"}</span>
                  </li>
                </ul>
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
              {isGu ? "તત્વજ્ઞાન અને કાર્યપદ્ધતિ" : "Philosophy & Continuous Pathway"}
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              {isGu ? "શા માટે \"હરિત અયન\"? (Harit Ayan)" : "Why \"Harit Ayan\"? (हरित अयन)"}
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-body)', lineHeight: 1.7 }}>
              {isGu
                ? "હરિત અયન બે સંસ્કૃત શબ્દો પરથી બનેલું છે: હરિત (હરિયાળી અને પર્યાવરણીય સ્થિરતા) અને અયન (ધ્યેય તરફ આગળ વધવાનો માર્ગ). માત્ર એક સમસ્યા ઉકેલવાને બદલે, હરિત અયન એક સતત ડિજિટલ માર્ગ બનાવે છે:"
                : "Harit Ayan is derived from two Sanskrit-rooted words: Harit (हरित: green, greenery, vegetation, and environmental sustainability) and Ayan (अयन: a path, journey, or movement towards a destination). Together, Harit Ayan creates a continuous digital pathway:"}
            </p>
          </div>

          <div className="grid-4">
            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--green-primary)', marginBottom: '0.4rem' }}>
                01
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "પરિસ્થિતિ સમજો" : "Understand Conditions"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "સેટેલાઇટ થર્મલ મેપિંગ, સોઇલ સેન્સર અને હવામાન ડેટાનું વિશ્લેષણ."
                  : "Satellite thermal data, microclimate mapping, and crop visual indicators."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--dry-leaf)', marginBottom: '0.4rem' }}>
                02
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "માહિતગાર પગલાં લો" : "Take Informed Action"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "લક્ષિત વૃક્ષારોપણ, સચોટ પિયત અને જૈવિક રોગ નિયંત્રણ."
                  : "Targeted planting, calibrated irrigation, and bio-friendly pesticide treatments."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--earth-clay)', marginBottom: '0.4rem' }}>
                03
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "અસર માપો" : "Measure Impact"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "તાપમાનમાં વાસ્તવિક ઘટાડો, પાક સુધારો અને મંડીમાં શ્રેષ્ઠ ભાવ પ્રાપ્તિ."
                  : "Empirical cooling validation, crop recovery, and Mandi price realization."}
              </p>
            </div>

            <div className="organic-card" style={{ padding: '1.5rem', background: '#ffffff' }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--olive-sage)', marginBottom: '0.4rem' }}>
                04
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {isGu ? "નિર્ણય સુધારો" : "Improve Decisions"}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isGu
                  ? "AI મોડેલના સતત શિક્ષણથી ભવિષ્યની યોજનાઓ વધુ સચોટ બનાવો."
                  : "Continuous learning to refine agricultural and urban advisories over time."}
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
              {t.faqs?.title || (isGu ? "વારંવાર પૂછાતા પ્રશ્નો અને માર્ગદર્શન" : "General Inquiries & Platform Guidance")}
            </h2>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-muted)',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              {t.faqs?.subtitle || (isGu ? "હરિત અયન પ્લેટફોર્મ, પાક રોગ નિદાન, હીટવેવ કૂલિંગ અને APMC બજાર ભાવો વિશેના જવાબો." : "Answers to common questions about HaritAyan, crop diagnostics, urban heat simulation, and APMC pricing.")}
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