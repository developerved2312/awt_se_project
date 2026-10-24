import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Filter,
  MapPin,
  Calendar,
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Scale,
  ChevronRight,
  Info,
  CheckCircle2,
  DollarSign,
  Layers,
  ArrowUpRight,
  Building2,
  Share2,
} from 'lucide-react';
import {
  fetchLatestMandiPrices,
  fetchMandiSummary,
  fetchMandiDirectory,
  syncLiveMandiRates,
  toMann,
  formatCurrency,
  formatArrivals,
} from '../services/mandiService';
import { getTranslation } from '../services/translationService';

export const MandiPrices = ({ currentLang = 'en', onNavigateHome, onNavigateScanner }) => {
  const isGu = currentLang === 'gu';
  const t = getTranslation(currentLang);

  // Unit mode: 'quintal' (100 kg) or 'mann' (20 kg)
  const [unitMode, setUnitMode] = useState('quintal');
  const [selectedMandi, setSelectedMandi] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('modalPrice');
  const [sortOrder, setSortOrder] = useState('desc');

  // State
  const [prices, setPrices] = useState([]);
  const [summary, setSummary] = useState(null);
  const [directory, setDirectory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ message: '', time: '' });
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'arbitrage' | 'directory'
  const [selectedCardForModal, setSelectedCardForModal] = useState(null);

  // Mandi quick filter list
  const mandisList = [
    { id: 'all', en: 'All Mandis', gu: 'બધી મંડીઓ' },
    { id: 'Sayajiganj', en: 'Sayajiganj APMC', gu: 'સયાજીગંજ APMC' },
    { id: 'Padra', en: 'Padra APMC', gu: 'પાદરા APMC' },
    { id: 'Karjan', en: 'Karjan APMC', gu: 'કરજણ APMC' },
    { id: 'Dabhoi', en: 'Dabhoi APMC', gu: 'ડભોઇ APMC' },
    { id: 'Savli', en: 'Savli APMC', gu: 'સાવલી APMC' },
  ];

  // Commodity quick filters
  const cropsList = [
    { id: 'all', en: 'All Crops', gu: 'બધા પાકો' },
    { id: 'Cotton', en: 'Cotton (કપાસ)', gu: 'કપાસ' },
    { id: 'Castor', en: 'Castor (દિવેલા)', gu: 'દિવેલા' },
    { id: 'Pigeon Pea', en: 'Tuver / Pigeon Pea (તુવેર)', gu: 'તુવેર' },
    { id: 'Tomato', en: 'Tomato (ટામેટા)', gu: 'ટામેટા' },
    { id: 'Okra', en: 'Okra / Bhindi (ભીંડા)', gu: 'ભીંડા' },
    { id: 'Wheat', en: 'Wheat (ઘઉં)', gu: 'ઘઉં' },
  ];

  // Load initial data
  const loadData = async (showRefreshState = false) => {
    if (showRefreshState) setIsRefreshing(true);
    else setLoading(true);

    try {
      const [priceRes, summaryRes, dirRes] = await Promise.all([
        fetchLatestMandiPrices({
          mandi: selectedMandi,
          commodity: selectedCrop,
          sortBy,
          order: sortOrder,
          search: searchQuery,
        }),
        fetchMandiSummary(),
        fetchMandiDirectory(),
      ]);

      if (priceRes && priceRes.data) {
        setPrices(priceRes.data);
      }
      if (summaryRes && summaryRes.summary) {
        setSummary(summaryRes.summary);
      }
      if (dirRes && dirRes.data) {
        setDirectory(dirRes.data);
      }

      setSyncStatus({
        message: priceRes.source === 'mongodb-atlas' ? 'MongoDB Atlas Live' : 'Market Baseline Sync',
        time: new Date().toLocaleTimeString(isGu ? 'gu-IN' : 'en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
    } catch (err) {
      console.error('Failed to load Mandi rates:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMandi, selectedCrop, sortBy, sortOrder]);

  // Handle Search submit or debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      loadData(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger real-time sync with MongoDB
  const handleTriggerLiveSync = async () => {
    setIsRefreshing(true);
    try {
      const res = await syncLiveMandiRates();
      await loadData(false);
      setSyncStatus({
        message: res.persistedToMongo ? 'MongoDB Atlas Updated' : 'Live Ticker Synced',
        time: new Date().toLocaleTimeString(isGu ? 'gu-IN' : 'en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      });
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Unit price display helper
  const renderPrice = (quintalPrice) => {
    if (unitMode === 'mann') {
      const mannPrice = toMann(quintalPrice);
      return {
        amount: formatCurrency(mannPrice),
        unitLabel: isGu ? 'પ્રતિ મણ (૨૦ કિલો)' : 'per Mann (20 kg)',
        raw: mannPrice,
      };
    }
    return {
      amount: formatCurrency(quintalPrice),
      unitLabel: isGu ? 'પ્રતિ ક્વિન્ટલ (૧૦૦ કિલો)' : 'per Quintal (100 kg)',
      raw: quintalPrice,
    };
  };

  // Top gainers ticker items
  const tickerItems = useMemo(() => {
    if (!prices || prices.length === 0) return [];
    return [...prices].slice(0, 8);
  }, [prices]);

  return (
    <div
      id="mandi-prices-page"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        minHeight: '100vh',
        paddingBottom: '5rem',
      }}
    >
      {/* Top Banner / Breadcrumb */}
      <div
        style={{
          background: 'linear-gradient(180deg, rgba(27, 67, 50, 0.06) 0%, rgba(251, 249, 245, 0) 100%)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '1.25rem 0',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span
              onClick={onNavigateHome}
              style={{ cursor: 'pointer', color: 'var(--green-primary)', fontWeight: 600 }}
            >
              {isGu ? 'મુખ્ય પાનું' : 'Home'}
            </span>
            <ChevronRight size={14} />
            <span style={{ color: 'var(--text-title)', fontWeight: 600 }}>
              {isGu ? 'APMC મંડી બજાર ભાવ' : 'APMC Mandi Market Prices'}
            </span>
          </div>

          {/* Live Sync Status Pill & Refresh Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.8rem',
                borderRadius: '50px',
                backgroundColor: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.28)',
                color: '#15803d',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  display: 'inline-block',
                  boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.3)',
                  animation: 'pulse 2s infinite',
                }}
              />
              <span>
                {syncStatus.message || (isGu ? 'લાઈવ મંડી ડેટા' : 'Live Mandi Data')}
                {syncStatus.time && ` • ${syncStatus.time}`}
              </span>
            </div>

            <button
              onClick={handleTriggerLiveSync}
              disabled={isRefreshing}
              className="btn btn-outline"
              style={{
                padding: '0.4rem 0.9rem',
                fontSize: '0.82rem',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: isRefreshing ? 'wait' : 'pointer',
              }}
            >
              <RefreshCw
                size={14}
                style={{
                  animation: isRefreshing ? 'spin 1s linear infinite' : 'none',
                }}
              />
              <span>{isRefreshing ? (isGu ? 'તાજું થાય છે...' : 'Refreshing...') : (isGu ? 'લાઈવ ભાવ તાજા કરો' : 'Refresh Rates')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              maxWidth: '960px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span
                className="badge"
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  borderColor: '#fde68a',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Sparkles size={14} />
                {isGu ? 'રીયલ-ટાઇમ માર્કેટ ઇન્ટેલિજન્સ' : 'Real-Time Market Intelligence'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {isGu ? 'વડોદરા જિલ્લો' : 'Vadodara District'}
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(1.9rem, 4vw, 2.7rem)',
                fontWeight: 800,
                color: 'var(--text-title)',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              {isGu
                ? 'વડોદરા જિલ્લાની મુખ્ય APMC મંડીઓના રોજના બજાર ભાવ'
                : 'Real-Time APMC Mandi Market Rates Engine'}
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                color: 'var(--text-body)',
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {isGu
                ? 'સયાજીગંજ, પાદરા, કરજણ, ડભોઇ અને સાવલી APMC મંડીઓમાં કપાસ, દિવેલા, તુવેર, ટામેટા અને ભીંડાના રોજના મોડલ ભાવ, આવક અને ૭ દિવસના ટ્રેન્ડ્સ.'
                : 'Authentic daily commodity auction rates, modal prices, daily arrivals, and 7-day trend indicators across Sayajiganj, Padra, Karjan, Dabhoi, and Savli APMCs.'}
            </p>
          </div>

          {/* Real-Time Scrolling Price Ticker Ribbon */}
          <div
            style={{
              marginTop: '1.8rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
              overflow: 'hidden',
              padding: '0.85rem 1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <TrendingUp size={15} color="#15803d" />
                <span>{isGu ? 'લાઈવ માર્કેટ ટિકર (વડોદરા જિલ્લા APMC)' : 'Live District Market Ticker'}</span>
              </div>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {unitMode === 'mann' ? (isGu ? 'ભાવ: ₹/મણ (૨૦ કિલો)' : 'Rates in ₹/Mann (20kg)') : (isGu ? 'ભાવ: ₹/ક્વિન્ટલ (૧૦૦ કિલો)' : 'Rates in ₹/Quintal')}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.35rem',
                scrollbarWidth: 'thin',
              }}
            >
              {tickerItems.map((item, idx) => {
                const p = renderPrice(item.modalPrice);
                const isPositive = item.priceChange24h >= 0;
                return (
                  <div
                    key={`ticker-${idx}-${item.commodity}-${item.mandi}`}
                    onClick={() => setSelectedCardForModal(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.5rem 0.85rem',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      flexShrink: 0,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                  >
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)' }}>
                        {isGu ? item.commodityGu : item.commodity}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {isGu ? item.mandiGu.split(' ')[0] : item.mandi.replace(' APMC', '')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-title)' }}>
                        {p.amount}
                      </div>
                      <div
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          color: isPositive ? '#15803d' : '#b91c1c',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          gap: '2px',
                        }}
                      >
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        <span>
                          {isPositive ? '+' : ''}
                          {item.priceChangePercent}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unit Toggle & View Tabs Header */}
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            {/* Navigation Tabs */}
            <div
              style={{
                display: 'inline-flex',
                padding: '0.3rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              }}
            >
              <button
                onClick={() => setActiveTab('grid')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'grid' ? 'var(--green-primary)' : 'transparent',
                  color: activeTab === 'grid' ? '#ffffff' : 'var(--text-body)',
                  fontWeight: activeTab === 'grid' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <BarChart3 size={16} />
                <span>{isGu ? 'પાક બજાર ભાવ' : 'Commodity Prices'}</span>
              </button>

              <button
                onClick={() => setActiveTab('arbitrage')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'arbitrage' ? 'var(--green-primary)' : 'transparent',
                  color: activeTab === 'arbitrage' ? '#ffffff' : 'var(--text-body)',
                  fontWeight: activeTab === 'arbitrage' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Scale size={16} />
                <span>{isGu ? 'મંડી સરખામણી & નફો' : 'Mandi Arbitrage Matrix'}</span>
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '9px',
                  border: 'none',
                  backgroundColor: activeTab === 'directory' ? 'var(--green-primary)' : 'transparent',
                  color: activeTab === 'directory' ? '#ffffff' : 'var(--text-body)',
                  fontWeight: activeTab === 'directory' ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <Building2 size={16} />
                <span>{isGu ? 'વડોદરા APMC ડિરેક્ટરી' : 'APMC Directory'}</span>
              </button>
            </div>

            {/* Gujarat Unit Toggle (₹/Quintal vs ₹/Mann) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: '#ffffff',
                padding: '0.35rem 0.5rem',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
              }}
            >
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, paddingLeft: '0.4rem' }}>
                {isGu ? 'એકમ:' : 'Unit:'}
              </span>
              <button
                onClick={() => setUnitMode('quintal')}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: unitMode === 'quintal' ? 'var(--earth-ochre)' : 'transparent',
                  color: unitMode === 'quintal' ? '#ffffff' : 'var(--text-title)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isGu ? '₹/ક્વિન્ટલ (૧૦૦ કિલો)' : '₹/Quintal (100kg)'}
              </button>
              <button
                onClick={() => setUnitMode('mann')}
                style={{
                  padding: '0.35rem 0.8rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: unitMode === 'mann' ? 'var(--green-primary)' : 'transparent',
                  color: unitMode === 'mann' ? '#ffffff' : 'var(--text-title)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isGu ? '₹/મણ (૨૦ કિલો)' : '₹/Mann (20kg)'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '1rem 0' }}>
        <div className="container">
          {/* TAB 1: COMMODITY PRICES GRID */}
          {activeTab === 'grid' && (
            <div>
              {/* Filter & Search Bar */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  padding: '1.25rem',
                  marginBottom: '1.75rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                {/* Search & Sort Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minWidth: '260px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Search
                      size={18}
                      color="var(--text-muted)"
                      style={{ position: 'absolute', left: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder={
                        isGu
                          ? 'પાક અથવા મંડી શોધો (દા.ત. કપાસ, તુવેર, પાદરા)...'
                          : 'Search crop or mandi (e.g. Cotton, Tuver, Karjan)...'
                      }
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 1rem 0.65rem 2.4rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)',
                        fontSize: '0.9rem',
                        color: 'var(--text-title)',
                        outline: 'none',
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          border: 'none',
                          background: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Sort By Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {isGu ? 'ગોઠવો:' : 'Sort By:'}
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      style={{
                        padding: '0.6rem 1rem',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-card)',
                        fontSize: '0.86rem',
                        fontWeight: 600,
                        color: 'var(--text-title)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="modalPrice">{isGu ? 'સૌથી વધુ ભાવ (Modal Rate)' : 'Highest Modal Price'}</option>
                      <option value="arrivals">{isGu ? 'સૌથી વધુ આવક (Arrivals)' : 'Highest Daily Arrivals'}</option>
                      <option value="change">{isGu ? 'સૌથી વધુ ૨૪ કલાક ફેરફાર' : 'Highest 24h Gain'}</option>
                      <option value="name">{isGu ? 'પાક નામ (અ થી ક્ષ)' : 'Crop Name'}</option>
                    </select>

                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="btn btn-outline"
                      title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                      style={{
                        padding: '0.6rem 0.75rem',
                        borderRadius: '10px',
                        fontSize: '0.82rem',
                      }}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                {/* Mandi Filter Pills */}
                <div style={{ marginBottom: '0.85rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                    {isGu ? 'મંડી પસંદ કરો:' : 'Filter by APMC Mandi:'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {mandisList.map((m) => {
                      const isSelected = selectedMandi === m.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => setSelectedMandi(m.id)}
                          style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: '20px',
                            border: isSelected ? '1px solid var(--green-primary)' : '1px solid var(--border-subtle)',
                            backgroundColor: isSelected ? 'var(--green-primary)' : '#ffffff',
                            color: isSelected ? '#ffffff' : 'var(--text-body)',
                            fontSize: '0.82rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isGu ? m.gu : m.en}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Commodity Filter Pills */}
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.45rem', textTransform: 'uppercase' }}>
                    {isGu ? 'પાક પસંદ કરો:' : 'Filter by Crop:'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {cropsList.map((c) => {
                      const isSelected = selectedCrop === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => setSelectedCrop(c.id)}
                          style={{
                            padding: '0.35rem 0.8rem',
                            borderRadius: '20px',
                            border: isSelected ? '1px solid var(--earth-ochre)' : '1px solid var(--border-subtle)',
                            backgroundColor: isSelected ? '#fef3c7' : '#ffffff',
                            color: isSelected ? '#92400e' : 'var(--text-body)',
                            fontSize: '0.8rem',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isGu ? c.gu : c.en}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Price Cards Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <RefreshCw
                    size={32}
                    color="var(--green-primary)"
                    style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }}
                  />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    {isGu ? 'મંડી બજાર ભાવો લોડ થઈ રહ્યા છે...' : 'Fetching real-time APMC Mandi rates...'}
                  </p>
                </div>
              ) : prices.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px dashed var(--border-subtle)',
                  }}
                >
                  <Info size={36} color="var(--text-muted)" style={{ marginBottom: '0.75rem' }} />
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--text-title)', marginBottom: '0.5rem' }}>
                    {isGu ? 'કોઈ પાક અથવા મંડી મળી નથી' : 'No matching mandi commodity found'}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    {isGu
                      ? 'તમારા ફિલ્ટર્સ અથવા શોધ શબ્દ બદલીને ફરી પ્રયાસ કરો.'
                      : 'Try broadening your filter criteria or search keyword.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedMandi('all');
                      setSelectedCrop('all');
                      setSearchQuery('');
                    }}
                    className="btn btn-outline"
                  >
                    {isGu ? 'બધા ફિલ્ટર્સ સાફ કરો' : 'Reset All Filters'}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '1.4rem',
                  }}
                >
                  {prices.map((item) => {
                    const priceInfo = renderPrice(item.modalPrice);
                    const minInfo = renderPrice(item.minPrice);
                    const maxInfo = renderPrice(item.maxPrice);
                    const isPositive = item.priceChange24h >= 0;

                    // Calculate range bar percentage
                    const rangeSpan = item.maxPrice - item.minPrice;
                    const modalPositionPercent =
                      rangeSpan > 0 ? Math.min(100, Math.max(0, ((item.modalPrice - item.minPrice) / rangeSpan) * 100)) : 50;

                    return (
                      <div
                        key={item._id || `${item.commodity}-${item.mandi}`}
                        className="organic-card"
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '18px',
                          border: '1px solid var(--border-subtle)',
                          padding: '1.4rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                          cursor: 'pointer',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        }}
                        onClick={() => setSelectedCardForModal(item)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 8px 24px rgba(27, 67, 50, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.03)';
                        }}
                      >
                        {/* Header: Mandi & Quality */}
                        <div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              marginBottom: '0.75rem',
                            }}
                          >
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                color: 'var(--green-primary)',
                                backgroundColor: 'rgba(27, 67, 50, 0.08)',
                                padding: '0.25rem 0.65rem',
                                borderRadius: '20px',
                              }}
                            >
                              <MapPin size={12} />
                              {isGu ? item.mandiGu : item.mandi}
                            </span>

                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                color: 'var(--text-muted)',
                                backgroundColor: 'var(--bg-card)',
                                padding: '0.2rem 0.55rem',
                                borderRadius: '6px',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              {isGu ? item.categoryGu : item.category}
                            </span>
                          </div>

                          {/* Commodity Title & Variety */}
                          <div style={{ marginBottom: '1rem' }}>
                            <h3
                              style={{
                                fontSize: '1.25rem',
                                fontWeight: 800,
                                color: 'var(--text-title)',
                                margin: '0 0 0.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}
                            >
                              <span>{isGu ? item.commodityGu : item.commodity}</span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                {isGu ? item.commodity : item.commodityGu}
                              </span>
                            </h3>

                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              {isGu ? item.varietyGu : item.variety} •{' '}
                              <span style={{ color: 'var(--earth-clay)', fontWeight: 600 }}>
                                {isGu ? item.qualityGradeGu : item.qualityGrade}
                              </span>
                            </div>
                          </div>

                          {/* Primary Modal Rate Display */}
                          <div
                            style={{
                              backgroundColor: 'var(--bg-card)',
                              borderRadius: '12px',
                              padding: '0.85rem 1rem',
                              marginBottom: '1rem',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                              <div>
                                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                  {isGu ? 'મોડલ દર (બજાર સરેરાશ)' : 'Modal Price (Average)'}
                                </span>
                                <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-title)', lineHeight: 1.15 }}>
                                  {priceInfo.amount}
                                </div>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                  {priceInfo.unitLabel}
                                </span>
                              </div>

                              {/* 24h Change Pill */}
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.35rem 0.65rem',
                                  borderRadius: '20px',
                                  backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                                  color: isPositive ? '#15803d' : '#b91c1c',
                                  fontSize: '0.78rem',
                                  fontWeight: 800,
                                }}
                              >
                                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>
                                  {isPositive ? '+' : ''}
                                  {item.priceChangePercent}%
                                </span>
                              </div>
                            </div>

                            {/* Min / Max Range Bar */}
                            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-subtle)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                                <span>
                                  {isGu ? 'ન્યૂનતમ: ' : 'Min: '}
                                  <strong>{minInfo.amount}</strong>
                                </span>
                                <span>
                                  {isGu ? 'મહત્તમ: ' : 'Max: '}
                                  <strong>{maxInfo.amount}</strong>
                                </span>
                              </div>

                              {/* Progress bar with pin at modal price */}
                              <div
                                style={{
                                  position: 'relative',
                                  height: '6px',
                                  backgroundColor: '#e5e7eb',
                                  borderRadius: '3px',
                                  overflow: 'visible',
                                }}
                              >
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: 0,
                                    width: `${modalPositionPercent}%`,
                                    height: '100%',
                                    backgroundColor: 'var(--green-primary)',
                                    borderRadius: '3px',
                                  }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: `calc(${modalPositionPercent}% - 5px)`,
                                    top: '-3px',
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--earth-ochre)',
                                    border: '2px solid #ffffff',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                  }}
                                  title={`Modal: ${priceInfo.amount}`}
                                />
                              </div>
                            </div>
                          </div>

                          {/* 7-Day Sparkline Trend Display */}
                          {item.weeklyTrend && item.weeklyTrend.length > 0 && (
                            <div style={{ marginBottom: '0.85rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                                <span>{isGu ? 'છેલ્લા ૭ દિવસનો ભાવ પ્રવાહ' : '7-Day Price Trend'}</span>
                                <span style={{ fontWeight: 600 }}>
                                  {item.trend === 'up' ? '↗ Bullish' : item.trend === 'down' ? '↘ Bearish' : '→ Stable'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '5px', height: '36px' }}>
                                {(() => {
                                  const pricesInWeek = item.weeklyTrend.map((w) => w.modalPrice);
                                  const minW = Math.min(...pricesInWeek) * 0.98;
                                  const maxW = Math.max(...pricesInWeek) * 1.02;
                                  const rangeW = maxW - minW || 1;

                                  return item.weeklyTrend.map((w, idx) => {
                                    const heightPercent = Math.max(15, Math.min(100, ((w.modalPrice - minW) / rangeW) * 100));
                                    const isLast = idx === item.weeklyTrend.length - 1;
                                    return (
                                      <div
                                        key={`bar-${idx}`}
                                        style={{
                                          flex: 1,
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                          height: '100%',
                                          justifyContent: 'flex-end',
                                        }}
                                        title={`${isGu ? w.dayGu : w.day}: ${formatCurrency(unitMode === 'mann' ? toMann(w.modalPrice) : w.modalPrice)}`}
                                      >
                                        <div
                                          style={{
                                            width: '100%',
                                            height: `${heightPercent}%`,
                                            backgroundColor: isLast ? 'var(--green-primary)' : '#cbd5e1',
                                            borderRadius: '2px 2px 0 0',
                                            transition: 'height 0.2s ease',
                                          }}
                                        />
                                        <span style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                          {isGu ? w.dayGu : w.day.slice(0, 1)}
                                        </span>
                                      </div>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Arrivals & Quick Action */}
                        <div
                          style={{
                            borderTop: '1px solid var(--border-subtle)',
                            paddingTop: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.78rem',
                          }}
                        >
                          <div>
                            <span style={{ color: 'var(--text-muted)' }}>
                              {isGu ? 'આજની આવક: ' : 'Daily Arrivals: '}
                            </span>
                            <strong style={{ color: 'var(--text-title)' }}>
                              {formatArrivals(item.arrivalsQuintals)}
                            </strong>
                          </div>

                          <span
                            style={{
                              color: 'var(--green-primary)',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '2px',
                            }}
                          >
                            <span>{isGu ? 'વિગતો' : 'Inspect'}</span>
                            <ChevronRight size={14} />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CROSS-MANDI ARBITRAGE MATRIX */}
          {activeTab === 'arbitrage' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Scale size={20} color="var(--earth-ochre)" />
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'વડોદરા જિલ્લો મંડી સરખામણી & ખેડૂત નફો મેટ્રિક્સ' : 'Vadodara District Mandi Arbitrage Matrix'}
                  </h2>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
                  {isGu
                    ? 'કઈ મંડીમાં તમારો પાક વેચવાથી સૌથી વધુ ભાવ અને નફો મળી શકે છે તેનું સચોટ વિશ્લેષણ.'
                    : 'Side-by-side district rate comparison revealing highest vs. lowest paying mandis for maximum farmer profit.'}
                </p>
              </div>

              {/* Arbitrage Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {summary && summary.arbitrageHighlights && summary.arbitrageHighlights.length > 0 ? (
                  summary.arbitrageHighlights.map((arb, idx) => {
                    const highDisplay = renderPrice(arb.highestPrice);
                    const lowDisplay = renderPrice(arb.lowestPrice);
                    const spreadDisplay = unitMode === 'mann' ? formatCurrency(toMann(arb.spread)) : formatCurrency(arb.spread);

                    return (
                      <div
                        key={`arb-${idx}`}
                        style={{
                          backgroundColor: 'var(--bg-card)',
                          borderRadius: '14px',
                          border: '1px solid var(--border-subtle)',
                          padding: '1.25rem 1.5rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.9rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div>
                            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
                              {isGu ? arb.commodityGu : arb.commodity}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                              ({isGu ? arb.commodity : arb.commodityGu})
                            </span>
                          </div>

                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              backgroundColor: 'rgba(34, 197, 94, 0.12)',
                              color: '#15803d',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '20px',
                              fontSize: '0.82rem',
                              fontWeight: 800,
                            }}
                          >
                            <TrendingUp size={15} />
                            <span>
                              {isGu ? `તફાવત: +${spreadDisplay}` : `Price Spread: +${spreadDisplay}`}
                              {unitMode === 'mann' ? ' /મણ' : ' /Qtl'} ({arb.spreadPercent}%)
                            </span>
                          </div>
                        </div>

                        {/* Comparison Columns */}
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                            gap: '1rem',
                          }}
                        >
                          {/* Highest Mandi */}
                          <div
                            style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '10px',
                              padding: '0.9rem',
                              border: '2px solid rgba(34, 197, 94, 0.4)',
                            }}
                          >
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                              🏆 {isGu ? 'સૌથી વધુ ભાવ આપતી મંડી' : 'Highest Paying Mandi'}
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-title)' }}>
                              {isGu ? arb.highestMandiGu : arb.highestMandi}
                            </div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803d', marginTop: '0.2rem' }}>
                              {highDisplay.amount}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {highDisplay.unitLabel}
                            </div>
                          </div>

                          {/* Lowest Mandi */}
                          <div
                            style={{
                              backgroundColor: '#ffffff',
                              borderRadius: '10px',
                              padding: '0.9rem',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>
                              📉 {isGu ? 'ન્યૂનતમ સરેરાશ મંડી' : 'Benchmark Mandi'}
                            </div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-title)' }}>
                              {isGu ? arb.lowestMandiGu : arb.lowestMandi}
                            </div>
                            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-body)', marginTop: '0.2rem' }}>
                              {lowDisplay.amount}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {lowDisplay.unitLabel}
                            </div>
                          </div>
                        </div>

                        {/* Farmer Advisory Recommendation */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            backgroundColor: 'rgba(212, 163, 115, 0.1)',
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            borderLeft: '3px solid var(--earth-ochre)',
                          }}
                        >
                          <Info size={16} color="var(--earth-ochre)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div style={{ fontSize: '0.84rem', color: 'var(--text-body)', lineHeight: 1.5 }}>
                            <strong>{isGu ? 'ખેડૂત સલાહ: ' : 'Farmer Advisory: '}</strong>
                            {isGu ? arb.recommendationGu : arb.recommendation}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    {isGu ? 'સરખામણી ડેટા ઉપલબ્ધ નથી' : 'Arbitrage comparison computing...'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DISTRICT APMC DIRECTORY */}
          {activeTab === 'directory' && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                padding: '2rem',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <Building2 size={20} color="var(--green-primary)" />
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    {isGu ? 'વડોદરા જિલ્લા APMC માર્કેટ યાર્ડ ડિરેક્ટરી' : 'Vadodara District APMC Market Yards Directory'}
                  </h2>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', margin: 0 }}>
                  {isGu
                    ? 'સત્તાવાર સંપર્ક, લિલામ સમય અને મુખ્ય પાક વિશેષતાઓની સંપૂર્ણ માહિતી.'
                    : 'Official addresses, auction operating hours, yard superintendents, and commodity trading specialties.'}
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {directory.map((yard) => (
                  <div
                    key={yard.id}
                    style={{
                      borderRadius: '14px',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.35rem',
                      backgroundColor: 'var(--bg-card)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.9rem',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: '0 0 0.2rem' }}>
                            {isGu ? yard.nameGu : yard.name}
                          </h3>
                          <span style={{ fontSize: '0.78rem', color: 'var(--earth-clay)', fontWeight: 600 }}>
                            {isGu ? yard.specialtyGu : yard.specialty}
                          </span>
                        </div>
                        <span
                          style={{
                            padding: '0.2rem 0.5rem',
                            borderRadius: '6px',
                            backgroundColor: 'rgba(27, 67, 50, 0.08)',
                            color: 'var(--green-primary)',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                          }}
                        >
                          APMC Yard
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.82rem', color: 'var(--text-body)', marginTop: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                          <MapPin size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{isGu ? yard.locationGu : yard.location}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Clock size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <span>{isGu ? yard.marketTimingGu : yard.marketTiming}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Phone size={15} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                          <span>
                            {yard.contactPerson} • <strong>{yard.contactNumber}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.65rem' }}>
                      <button
                        onClick={() => {
                          setSelectedMandi(yard.id === 'sayajiganj' ? 'Sayajiganj' : yard.id === 'padra' ? 'Padra' : yard.id === 'karjan' ? 'Karjan' : yard.id === 'dabhoi' ? 'Dabhoi' : 'Savli');
                          setActiveTab('grid');
                        }}
                        className="btn btn-outline"
                        style={{
                          width: '100%',
                          fontSize: '0.8rem',
                          padding: '0.45rem',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <span>{isGu ? `${yard.nameGu.split(' ')[0]} ના ભાવ જુઓ` : `View ${yard.name.replace(' APMC', '')} Rates`}</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modal Inspector for a Specific Commodity */}
      {selectedCardForModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setSelectedCardForModal(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--green-primary)',
                    backgroundColor: 'rgba(27, 67, 50, 0.08)',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '20px',
                  }}
                >
                  {isGu ? selectedCardForModal.mandiGu : selectedCardForModal.mandi}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)', margin: '0.4rem 0 0' }}>
                  {isGu ? selectedCardForModal.commodityGu : selectedCardForModal.commodity}
                </h2>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {isGu ? selectedCardForModal.varietyGu : selectedCardForModal.variety} •{' '}
                  {isGu ? selectedCardForModal.qualityGradeGu : selectedCardForModal.qualityGrade}
                </div>
              </div>

              <button
                onClick={() => setSelectedCardForModal(null)}
                style={{
                  border: 'none',
                  background: '#f3f4f6',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  color: 'var(--text-muted)',
                }}
              >
                ✕
              </button>
            </div>

            {/* Price breakdown in both units */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ backgroundColor: 'var(--bg-card)', padding: '0.85rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {isGu ? 'પ્રતિ ક્વિન્ટલ (૧૦૦ કિલો)' : 'Per Quintal (100 kg)'}
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--text-title)', marginTop: '0.2rem' }}>
                  {formatCurrency(selectedCardForModal.modalPrice)}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Min: {formatCurrency(selectedCardForModal.minPrice)} • Max: {formatCurrency(selectedCardForModal.maxPrice)}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(27, 67, 50, 0.05)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(27, 67, 50, 0.15)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--green-primary)', fontWeight: 700 }}>
                  {isGu ? 'પ્રતિ મણ (૨૦ કિલો)' : 'Per Mann (20 kg)'}
                </span>
                <div style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--green-primary)', marginTop: '0.2rem' }}>
                  {formatCurrency(toMann(selectedCardForModal.modalPrice))}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Min: {formatCurrency(toMann(selectedCardForModal.minPrice))} • Max: {formatCurrency(toMann(selectedCardForModal.maxPrice))}
                </div>
              </div>
            </div>

            {/* Daily arrivals & movement */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-card)',
                marginBottom: '1.25rem',
                fontSize: '0.82rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{isGu ? 'દૈનિક આવક: ' : 'Daily Arrivals: '}</span>
                <strong>{formatArrivals(selectedCardForModal.arrivalsQuintals)}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{isGu ? '૨૪ કલાક ફેરફાર: ' : '24h Shift: '}</span>
                <strong style={{ color: selectedCardForModal.priceChange24h >= 0 ? '#15803d' : '#b91c1c' }}>
                  {selectedCardForModal.priceChange24h >= 0 ? '+' : ''}
                  {formatCurrency(selectedCardForModal.priceChange24h)} ({selectedCardForModal.priceChangePercent}%)
                </strong>
              </div>
            </div>

            {/* 7-Day History Table */}
            {selectedCardForModal.weeklyTrend && selectedCardForModal.weeklyTrend.length > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.5rem' }}>
                  {isGu ? '૭ દિવસનો વિગતવાર ભાવ ઇતિહાસ' : '7-Day Price History'}
                </div>
                <div
                  style={{
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-subtle)' }}>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)' }}>
                          {isGu ? 'દિવસ' : 'Day'}
                        </th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: 'var(--text-muted)' }}>
                          {isGu ? 'તારીખ' : 'Date'}
                        </th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                          {isGu ? '₹/ક્વિન્ટલ' : '₹/Quintal'}
                        </th>
                        <th style={{ padding: '0.5rem 0.75rem', textAlign: 'right', color: 'var(--text-muted)' }}>
                          {isGu ? '₹/મણ' : '₹/Mann'}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCardForModal.weeklyTrend.map((row, rIdx) => (
                        <tr
                          key={`row-${rIdx}`}
                          style={{
                            borderBottom: rIdx < selectedCardForModal.weeklyTrend.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                            backgroundColor: rIdx === selectedCardForModal.weeklyTrend.length - 1 ? 'rgba(34, 197, 94, 0.05)' : '#ffffff',
                          }}
                        >
                          <td style={{ padding: '0.45rem 0.75rem', fontWeight: 600 }}>
                            {isGu ? row.dayGu : row.day}
                          </td>
                          <td style={{ padding: '0.45rem 0.75rem', color: 'var(--text-muted)' }}>
                            {row.date}
                          </td>
                          <td style={{ padding: '0.45rem 0.75rem', textAlign: 'right', fontWeight: 700 }}>
                            {formatCurrency(row.modalPrice)}
                          </td>
                          <td style={{ padding: '0.45rem 0.75rem', textAlign: 'right', fontWeight: 700, color: 'var(--green-primary)' }}>
                            {formatCurrency(toMann(row.modalPrice))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedCardForModal(null)}
                className="btn btn-outline"
                style={{ flex: 1, padding: '0.65rem' }}
              >
                {isGu ? 'બંધ કરો' : 'Close'}
              </button>
              {onNavigateScanner && (
                <button
                  onClick={() => {
                    setSelectedCardForModal(null);
                    onNavigateScanner();
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1.2, padding: '0.65rem' }}
                >
                  {isGu ? 'પાક રોગ સ્કેનર' : 'Scan Crop Health'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MandiPrices;
