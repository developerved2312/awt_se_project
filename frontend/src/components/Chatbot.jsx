import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sprout,
  Camera,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  ChevronRight,
  ExternalLink,
  Bot,
  HelpCircle,
  BarChart3,
  MapPin,
  Flame,
} from 'lucide-react';

export const Chatbot = ({
  currentLang = 'en',
  onNavigate,
  onOpenAuth,
  onLanguageChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const isGu = currentLang === 'gu';

  // Quick Suggestion Topics
  const SUGGESTIONS = [
    {
      id: 'scanner',
      icon: Camera,
      labelEn: 'Scan Plant Disease',
      labelGu: 'પાક રોગ સ્કેન કેવી રીતે કરવું?',
    },
    {
      id: 'desk',
      icon: Shield,
      labelEn: 'Farmer & Officer Desk',
      labelGu: 'ખેડૂત અને કૃષિ અધિકારી ડેસ્ક',
    },
    {
      id: 'demo',
      icon: Sparkles,
      labelEn: '1-Click Demo Profiles',
      labelGu: '૧-ક્લિક ડેમો પ્રોફાઇલ્સ',
    },
    {
      id: 'remedies',
      icon: Sprout,
      labelEn: 'Organic Sprays & Recipes',
      labelGu: 'લીમડો અને છાશના દેશી ઉપચાર',
    },
    {
      id: 'heatmap',
      icon: Flame,
      labelEn: 'Urban Heat Island Map',
      labelGu: 'વડોદરા શહેર શીતળતા મેપ',
    },
    {
      id: 'mandi',
      icon: BarChart3,
      labelEn: 'APMC Mandi Rates',
      labelGu: 'APMC મંડી બજાર ભાવ',
    },
  ];

  // KNOWLEDGE BASE (100% Rule-Based, Zero AI Token Costs)
  const KNOWLEDGE_BASE = {
    scanner: {
      textEn:
        'The **Plant Disease Vision Scanner** uses Multimodal Vision to inspect your crop leaves. You can either take a live camera snapshot, upload a photo from your gallery, or click any of the 6 pre-loaded regional samples (Cotton, Tomato, Castor, Okra, Pigeon Pea, or Healthy Crop). It returns symptoms, pathogen type, organic herbal sprays, and safe chemical dosages.',
      textGu:
        '**પાક રોગ સ્કેનર** વડે તમે તમારા પાકના પાંદડાનો કેમેરાથી લાઈવ ફોટો પાડી શકો છો અથવા ફાઇલ અપલોડ કરી શકો છો. તમે કપાસ, ટામેટા, દિવેલા, ભીંડા, તુવેર અથવા તંદુરસ્ત પાકના નમૂના પર ૧-ક્લિક કરીને ત્વરિત નિદાન અને દેશી-રાસાયણિક દવાઓની માત્રા જાણી શકો છો.',
      actionType: 'navigate',
      actionTarget: 'scanner',
      actionLabelEn: 'Open Plant Scanner →',
      actionLabelGu: 'પાક સ્કેનર ખોલો →',
    },
    desk: {
      textEn:
        'The **Farmer & Officer Desk** is our multi-user consultation system. Farmers (Ramesh Patel, Bhavesh Solanki, Kanubhai Bharwad) can post crop questions and leaf photos. District Agricultural Officer **Dr. Hitesh Trivedi** (Room 204, Krishi Bhavan, Vadodara) reviews them and issues official verified advisories directly to their profiles.',
      textGu:
        '**કિસાન અને અધિકારી ડેસ્ક** એ અમારું બહુભૂમિકા પોર્ટલ છે. ખેડૂતો (રમેશભાઈ, ભાવેશભાઈ, કાનુભાઈ) પોતાના ખેતરના પ્રશ્નો અને ફોટા મોકલી શકે છે. જિલ્લા કૃષિ અધિકારી **ડૉ. હિતેશ ત્રિવેદી** (કૃષિ ભવન, વડોદરા) તેનું નિરીક્ષણ કરી સત્તાવાર દવા અને સારવારની ભલામણ મોકલે છે.',
      actionType: 'navigate',
      actionTarget: 'profile',
      actionLabelEn: 'Open Farmer & Officer Desk →',
      actionLabelGu: 'કિસાન-અધિકારી ડેસ્ક ખોલો →',
    },
    demo: {
      textEn:
        'You can instantly test the system without typing any passwords! Use the **Live Demo Switcher** at the top of the Desk or in the Navbar to switch between: \n• **Ramesh Patel** (Cotton Farmer, Padra)\n• **Bhavesh Solanki** (Tomato Farmer, Anklav)\n• **Kanubhai Bharwad** (Castor Farmer, Karjan)\n• **Dr. Hitesh Trivedi** (District Agricultural Officer, Vadodara).',
      textGu:
        'કોઈપણ પાસવર્ડ ટાઇપ કર્યા વગર તમે **૧-ક્લિક લાઇવ ડેમો** વાપરી શકો છો:\n• **રમેશભાઈ પટેલ** (કપાસના ખેડૂત, પાદરા)\n• **ભાવેશભાઈ સોલંકી** (ટામેટાના ખેડૂત, આંકલાવ)\n• **કાનુભાઈ ભરવાડ** (દિવેલાના ખેડૂત, કરજણ)\n• **ડૉ. હિતેશ ત્રિવેદી** (જિલ્લા કૃષિ અધિકારી, વડોદરા).',
      actionType: 'auth',
      actionLabelEn: 'Open Live Demo Switcher →',
      actionLabelGu: 'લાઇવ સ્વિચર ખોલો →',
    },
    remedies: {
      textEn:
        '**Gujarat Recommended Organic Protocols**:\n1. **Neem Oil 1500 ppm**: Mix 30–35ml in 15L water pump to control whiteflies, thrips, and aphids.\n2. **Sour Buttermilk (ખાટી છાશ)**: 500ml fermented buttermilk + 10g turmeric per 15L pump to check early fungal blights on tomato and vegetables.\n3. **Trichoderma harzianum**: 50g per pump for soil/foliar wilt defense.\n4. **Yellow Sticky Traps**: 16 traps per acre to capture sucking pests naturally.',
      textGu:
        '**ગુજરાત કૃષિ યુનિવર્સિટી ભલામણ કરેલ દેશી ઉપચાર**:\n૧. **લીંબોળીનું તેલ (૧૫૦૦ PPM)**: ૧૫ લીટર પંપમાં ૩૦-૩૫ મિલી ઉમેરી છાંટવાથી સફેદ માખી અને મોલોમશી અટકે છે.\n૨. **ખાટી છાશ + હળદર**: ૫૦૦ મિલી ખાટી છાશ અને ૧૦ ગ્રામ હળદર પ્રતિ પંપ ટામેટાના સુકારા સામે ઉત્તમ રક્ષણ આપે છે.\n૩. **ટ્રાઇકોડર્મા**: ૫૦ ગ્રામ પ્રતિ પંપ ફૂગનાશક તરીકે વાપરવું.\n૪. **પીળા સ્ટીકી ટ્રેપ**: એકરે ૧૬ ટ્રેપ લગાવવા.',
    },
    heatmap: {
      textEn:
        'The **Urban Heat Island & Tree Cooling Simulator** maps Vadodara\'s 19 municipal wards (Akota, Alkapuri, Manjalpur, Sayajigunj, Gorwa, etc.). It displays baseline summer temperatures and lets you simulate how planting native Gujarat trees (Banyan / વડ, Neem / લીમડો, Peepal / પીપળો, Gulmohar) cools ward microclimates by up to 1.8°C.',
      textGu:
        '**શહેર શીતળતા અને વૃક્ષ સિમ્યુલેટર** વડોદરા મ્યુનિસિપલ કોર્પોરેશનના ૧૯ વોર્ડ (અકોટા, અલકાપુરી, માંજલપુર, સયાજીગંજ વગેરે) નું ઉનાળુ તાપમાન દર્શાવે છે. વડ, લીમડો અને પીપળા જેવા દેશી વૃક્ષો વાવીને વોર્ડનું તાપમાન ૧.૮°C સુધી કેવી રીતે ઘટાડી શકાય તેનું ગણિત દર્શાવે છે.',
      actionType: 'navigate',
      actionTarget: 'home',
      actionLabelEn: 'Explore on Home Page →',
      actionLabelGu: 'મુખ્ય પૃષ્ઠ પર જુઓ →',
    },
    mandi: {
      textEn:
        'The **APMC Mandi Intelligence Engine** monitors daily spot arrivals and trading rates across major Gujarat mandis including **Vadodara (Sayajigunj)**, **Karjan**, **Padra**, and **Anand**. It tracks market spot rates for Cotton (કપાસ), Castor (દિવેલા), Tomato (ટામેટા), Pigeon Pea (તુવેર), and Wheat (ઘઉં).',
      textGu:
        '**APMC મંડી ભાવ એન્જિન** વડોદરા (સયાજીગંજ), કરજણ, પાદરા અને આણંદ મંડીના રોજના બજાર ભાવો અને આવક દર્શાવે છે. કપાસ, દિવેલા, ટામેટા, તુવેર અને ઘઉંના ૨૦ કિલો (મણ) દીઠ લાઈવ ભાવો અહીં ઉપલબ્ધ છે.',
    },
    cotton: {
      textEn:
        '**Cotton Leaf Curl Virus (CLCuV - કપાસનો કોકડવાટ)**:\n• **Symptoms**: Upward leaf curling, thick veins on underside, stunted plants.\n• **Vector**: Whitefly (Bemisia tabaci).\n• **Treatment**: Eradicate alternate weeds along field borders. Spray Neem Oil 1500 ppm @ 35ml/15L pump or Flonicamid 50 WG @ 3.5g/15L.',
      textGu:
        '**કપાસમાં પાન વળવાનો વાયરસ (કોકડવાટ)**:\n• **લક્ષણો**: પાન ઉપરની તરફ વળી વાટકા જેવા બને, નસો જાડી થાય.\n• **વાહક જીવાત**: સફેદ માખી.\n• **સારવાર**: શેઢા-પાળા પરથી નીંદણ દૂર કરો. લીંબોળીનું તેલ ૩૫ મિલી અથવા ફ્લોનિકામિડ ૫૦ ડબ્લ્યુજી ૩.૫ ગ્રામ પ્રતિ ૧૫ લીટર પંપ છાંટો.',
      actionType: 'navigate',
      actionTarget: 'scanner',
      actionLabelEn: 'Scan a Cotton Leaf →',
      actionLabelGu: 'કપાસનું પાન સ્કેન કરો →',
    },
    tomato: {
      textEn:
        '**Tomato Early Blight (ટામેટાનો આગોતરો સુકારો)**:\n• **Symptoms**: Target-board concentric brown rings on lower leaves surrounded by yellow halos.\n• **Remedy**: Avoid evening furrow watering. Spray Mancozeb 75 WP @ 30g/15L or fermented sour buttermilk (500ml) + turmeric (10g).',
      textGu:
        '**ટામેટાનો આગોતરો સુકારો (અર્લી બ્લાઇટ)**:\n• **લક્ષણો**: નીચલા પાન પર કથ્થાઈ ગોળ ચક્રાકાર ડાઘ અને પીળી કિનારી.\n• **ઉપચાર**: સાંજે પાણી આપવું ટાળો. મેન્કોઝેબ ૭૫ ડબ્લ્યુપી ૩૦ ગ્રામ પ્રતિ પંપ અથવા ખાટી છાશ ૫૦૦ મિલી + હળદર ૧૦ ગ્રામ છાંટો.',
      actionType: 'navigate',
      actionTarget: 'scanner',
      actionLabelEn: 'Scan a Tomato Leaf →',
      actionLabelGu: 'ટામેટાનું પાન સ્કેન કરો →',
    },
    about: {
      textEn:
        '**HaritAyan (હરિતઅયન)** combines two Sanskrit concepts:\n• **Harit (हरित)**: Green vegetation, agricultural vitality, and plant health.\n• **Ayan (अयन)**: A purposeful, continuous journey.\nOur platform unites Gujarat farmers, citizens, and agricultural officers for smart foliar diagnostics, urban heat cooling, and fair mandi intelligence.',
      textGu:
        '**હરિતઅયન (HaritAyan)**:\n• **હરિત (हरित)**: હરિયાળી, વનસ્પતિ અને ખેતીની સમૃદ્ધિ.\n• **અયન (अयन)**: અવિરત અને સાર્થક યાત્રા.\nઆ પ્લેટફોર્મ ખેડૂતો, નાગરિકો અને કૃષિ અધિકારીઓને પાક સુરક્ષા, શહેર શીતળતા અને મંડી ભાવો માટે એક તાંતણે જોડે છે.',
    },
    default: {
      textEn:
        'I am the **HaritAyan Guide Assistant**. I can help you with:\n1. Scanning plant diseases with the Gemini AI Vision tool\n2. Consulting agricultural officers via the Farmer Desk\n3. Switching between 1-click demo accounts (Ramesh Patel, Dr. Hitesh)\n4. Organic spray recipes (Neem, buttermilk, turmeric)\n5. Vadodara tree cooling and heat mitigation map\n\nPlease select one of the quick options below or type your question!',
      textGu:
        'હું **હરિતઅયન માર્ગદર્શક સહાયક** છું. હું તમને નીચેની બાબતોમાં મદદ કરી શકું છું:\n૧. જેમિની AI પાક રોગ સ્કેનરનો ઉપયોગ કરવો\n૨. કિસાન-અધિકારી ડેસ્ક પર પ્રશ્નો પૂછવા અને સલાહ મેળવવી\n૩. ૧-ક્લિક લાઇવ ડેમો પ્રોફાઇલ્સ સ્વિચ કરવી\n૪. લીમડાનું તેલ અને છાશના દેશી ઓર્ગેનિક ઉપચાર\n૫. વડોદરા વૃક્ષ શીતળતા મેપની માહિતી\n\nકૃપા કરીને નીચે આપેલા વિકલ્પોમાંથી પસંદ કરો અથવા તમારો પ્રશ્ન લખો!',
    },
  };

  // Initialize welcome message on mount or language switch
  useEffect(() => {
    const welcomeMsg = {
      id: 'welcome',
      sender: 'bot',
      text: isGu
        ? 'નમસ્તે! હું **હરિતઅયન સહાયક** છું. હું તમને પાક સ્કેનર, કિસાન-અધિકારી ડેસ્ક, દેશી ઉપચાર અને પ્લેટફોર્મના તમામ ફીચર્સ સમજવામાં મદદ કરી શકું છું. નીચેનામાંથી કોઈ વિષય પસંદ કરો અથવા તમારો પ્રશ્ન લખો.'
        : 'Namaste! I am **HaritAyan Sahayak**, your guided smart farming and platform assistant. I can help you explore the plant scanner, farmer consultations, organic remedies, and demo accounts. Choose a topic below or type your question.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showSuggestions: true,
    };
    setMessages([welcomeMsg]);
  }, [currentLang]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Natural Rule-Based Intent Resolution
  const resolveIntent = (input) => {
    const lower = input.toLowerCase().trim();

    if (/scan|camera|leaf|disease|photo|upload|picture|સ્કેન|પાંદડું|રોગ|ફોટો|કેમેરો/.test(lower)) {
      return 'scanner';
    }
    if (/officer|desk|doctor|dr|hitesh|farmer|query|ask|consult|અધિકારી|ડેસ્ક|પ્રશ્ન|સલાહ|હિતેશ|પૂછ/.test(lower)) {
      return 'desk';
    }
    if (/demo|login|switch|profile|ramesh|bhavesh|kanubhai|account|ખાતું|પ્રવેશ|સ્વિચ|ડેમો/.test(lower)) {
      return 'demo';
    }
    if (/remedy|neem|spray|organic|buttermilk|curd|turmeric|લીમડો|છાશ|દવા|ઉપચાર|હળદર|ઓર્ગેનિક/.test(lower)) {
      return 'remedies';
    }
    if (/heat|tree|cooling|ward|vadodara|temperature|urban|ગરમી|વૃક્ષ|શીતળતા|તાપમાન|વડોદરા|ઠંડક/.test(lower)) {
      return 'heatmap';
    }
    if (/mandi|price|rate|apmc|market|bazar|મંડી|ભાવ|બજાર|કપાસના ભાવ/.test(lower)) {
      return 'mandi';
    }
    if (/cotton|bt cotton|clcuv|curling|whitefly|કપાસ|કોકડવાટ/.test(lower)) {
      return 'cotton';
    }
    if (/tomato|blight|early blight|ટામેટા|સુકારો/.test(lower)) {
      return 'tomato';
    }
    if (/about|haritayan|meaning|what is|વિશે|હરિતઅયન/.test(lower)) {
      return 'about';
    }

    return 'default';
  };

  const handleSend = (textToSend = null) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    // Add user message
    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulated short response delay for realistic feel
    setTimeout(() => {
      const intentKey = resolveIntent(query);
      const data = KNOWLEDGE_BASE[intentKey] || KNOWLEDGE_BASE.default;

      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: isGu && data.textGu ? data.textGu : data.textEn,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionType: data.actionType,
        actionTarget: data.actionTarget,
        actionLabel: isGu && data.actionLabelGu ? data.actionLabelGu : data.actionLabelEn,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (actionType, actionTarget) => {
    if (actionType === 'navigate' && onNavigate) {
      onNavigate(actionTarget);
      setIsOpen(false);
    } else if (actionType === 'auth' && onOpenAuth) {
      onOpenAuth();
      setIsOpen(false);
    }
  };

  const handleClearChat = () => {
    const welcomeMsg = {
      id: 'welcome_reset',
      sender: 'bot',
      text: isGu
        ? 'ચેટ રીસેટ થઈ ગઈ છે. હું તમને કેવી રીતે મદદ કરી શકું?'
        : 'Chat cleared. How can I assist you with HaritAyan today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      showSuggestions: true,
    };
    setMessages([welcomeMsg]);
  };

  return (
    <>
      {/* 1. FLOATING CHAT TRIGGER BUTTON (Bottom-Right) */}
      {!isOpen && (
        <button
          type="button"
          id="harit-sahayak-trigger"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1500,
            padding: '10px 18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--green-deep)',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.3)',
            boxShadow: '0 8px 24px rgba(27, 67, 50, 0.35)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
            e.currentTarget.style.backgroundColor = 'var(--green-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.backgroundColor = 'var(--green-deep)';
          }}
          aria-label="Open HaritAyan Assistant"
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#d8f3dc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--green-deep)',
            }}
          >
            <Bot size={17} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.01em', lineHeight: 1.1 }}>
              {isGu ? 'હરિત સહાયક' : 'Harit Sahayak'}
            </span>
            <span style={{ fontSize: '0.68rem', color: '#b7e4c7', fontWeight: 600 }}>
              {isGu ? 'પ્લેટફોર્મ માર્ગદર્શિકા' : 'Assistant & Guide'}
            </span>
          </div>

          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#52b788',
              boxShadow: '0 0 8px #52b788',
            }}
          />
        </button>
      )}

      {/* 2. CHATBOT WINDOW DIALOG */}
      {isOpen && (
        <div
          id="harit-sahayak-dialog"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '92vw',
            maxWidth: '410px',
            height: '560px',
            maxHeight: '82vh',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-medium)',
            boxShadow: '0 20px 48px -8px rgba(27, 67, 50, 0.28)',
            zIndex: 1600,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.9rem 1.15rem',
              background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: '#d8f3dc',
                  color: 'var(--green-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={20} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ fontSize: '0.94rem', fontWeight: 800 }}>
                    {isGu ? 'હરિતઅયન સહાયક' : 'HaritAyan Sahayak'}
                  </span>
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Guide Bot
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.72rem', color: '#d8f3dc', opacity: 0.9 }}>
                  {isGu ? 'ઓફલાઇન પ્લેટફોર્મ માર્ગદર્શક' : 'Offline Platform Assistant'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={handleClearChat}
                title={isGu ? 'ચેટ રીસેટ કરો' : 'Clear Chat'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  opacity: 0.75,
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <RefreshCw size={15} />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title={isGu ? 'બંધ કરો' : 'Close'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={19} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              backgroundColor: '#f8faf7',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';

              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isBot ? 'flex-start' : 'flex-end',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '86%',
                      padding: '0.75rem 0.95rem',
                      borderRadius: isBot ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                      backgroundColor: isBot ? '#ffffff' : 'var(--green-primary)',
                      color: isBot ? 'var(--text-title)' : '#ffffff',
                      border: isBot ? '1px solid var(--border-medium)' : 'none',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      fontSize: '0.84rem',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}

                    {/* Interactive Direct Action Button */}
                    {msg.actionLabel && (
                      <div style={{ marginTop: '0.65rem' }}>
                        <button
                          type="button"
                          onClick={() => handleActionClick(msg.actionType, msg.actionTarget)}
                          style={{
                            padding: '5px 11px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: 'var(--green-wash)',
                            color: 'var(--green-deep)',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{msg.actionLabel}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      fontSize: '0.65rem',
                      color: '#9ca3af',
                      marginTop: '3px',
                      padding: '0 4px',
                    }}
                  >
                    {msg.timestamp}
                  </span>

                  {/* Suggestion Chips on initial welcome */}
                  {msg.showSuggestions && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.4rem',
                        marginTop: '0.65rem',
                        maxWidth: '100%',
                      }}
                    >
                      {SUGGESTIONS.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => handleSend(isGu ? item.labelGu : item.labelEn)}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '20px',
                              border: '1px solid var(--border-medium)',
                              backgroundColor: '#ffffff',
                              color: 'var(--green-deep)',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                              transition: 'all 0.15s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--green-wash)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#ffffff';
                            }}
                          >
                            <Icon size={12} color="var(--green-primary)" />
                            <span>{isGu ? item.labelGu : item.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor: '#ffffff',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-medium)',
                  fontSize: '0.78rem',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Sprout size={13} className="spin" color="var(--green-primary)" />
                <span>{isGu ? 'સહાયક વિચારી રહ્યું છે...' : 'Sahayak is typing...'}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div
            style={{
              padding: '0.4rem 0.75rem',
              backgroundColor: '#f1f5ee',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {[
              { labelEn: '🌱 Plant Scanner', labelGu: '🌱 પાક સ્કેનર', val: 'scanner' },
              { labelEn: '👨‍🌾 Farmer Desk', labelGu: '👨‍🌾 કિસાન ડેસ્ક', val: 'desk' },
              { labelEn: '⚡ 1-Click Demo', labelGu: '⚡ ૧-ક્લિક ડેમો', val: 'demo' },
              { labelEn: '🌿 Organic Sprays', labelGu: '🌿 દેશી દવાઓ', val: 'remedies' },
            ].map((shortcut, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(isGu ? shortcut.labelGu : shortcut.labelEn)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(45,106,79,0.18)',
                  backgroundColor: '#ffffff',
                  color: 'var(--green-deep)',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {isGu ? shortcut.labelGu : shortcut.labelEn}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.65rem 0.85rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isGu ? 'પાક, રોગ કે ફીચર વિશે પૂછો...' : 'Ask about crops, scans, or features...'}
              style={{
                flex: 1,
                border: '1px solid var(--border-medium)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                fontSize: '0.84rem',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: inputText.trim() ? 'var(--green-primary)' : '#e5ebd8',
                color: inputText.trim() ? '#ffffff' : '#9ca3af',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s ease',
              }}
              title="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
