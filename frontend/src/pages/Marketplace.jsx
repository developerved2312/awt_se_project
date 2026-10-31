import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  Phone,
  MapPin,
  Tag,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Info,
  X,
  Zap,
  Check,
  PlusCircle,
} from 'lucide-react';
import { fetchEquipments, createEquipmentBooking } from '../services/equipmentService';

export const Marketplace = ({ currentLang = 'en', onNavigateHome, currentUser }) => {
  const isGu = currentLang === 'gu';

  // Filters state
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTaluka, setSelectedTaluka] = useState('all');
  const [subsidyOnly, setSubsidyOnly] = useState(false);

  // Booking Modal State
  const [bookingModalItem, setBookingModalItem] = useState(null);
  const [bookingType, setBookingType] = useState('rental'); // 'rental' | 'subsidy_guidance'
  const [rentalHours, setRentalHours] = useState(8);
  const [farmerName, setFarmerName] = useState(currentUser?.name || '');
  const [farmerPhone, setFarmerPhone] = useState(currentUser?.phone || '');
  const [farmerTaluka, setFarmerTaluka] = useState(currentUser?.taluka || 'Padra');
  const [farmerVillage, setFarmerVillage] = useState(currentUser?.village || '');
  const [notes, setNotes] = useState('');
  const [customEquipName, setCustomEquipName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccessData, setBookingSuccessData] = useState(null);

  // Load equipment on filter change
  useEffect(() => {
    loadCatalog();
  }, [selectedCategory, selectedTaluka, subsidyOnly]);

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const data = await fetchEquipments({
        category: selectedCategory,
        taluka: selectedTaluka,
        search: searchQuery,
        subsidyOnly,
      });
      setEquipments(data);
    } catch (err) {
      console.error('Failed to load equipments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCatalog();
  };

  const openBookingModal = (item, type = 'rental', isCustom = false) => {
    setBookingModalItem({ ...item, isCustom });
    setBookingType(type);
    setRentalHours(8);
    setCustomEquipName(item?.name || '');
    setBookingSuccessData(null);
    if (currentUser) {
      setFarmerName(currentUser.name || '');
      setFarmerPhone(currentUser.phone || '');
      setFarmerTaluka(currentUser.taluka || 'Padra');
      setFarmerVillage(currentUser.village || '');
    }
  };

  const closeBookingModal = () => {
    setBookingModalItem(null);
    setBookingSuccessData(null);
    setCustomEquipName('');
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim()) {
      alert(isGu ? 'કૃપા કરીને ખેડૂતનું નામ અને ફોન નંબર દાખલ કરો.' : 'Please enter farmer name and contact phone.');
      return;
    }

    if (bookingModalItem?.isCustom && !customEquipName.trim()) {
      alert(isGu ? 'કૃપા કરીને સાધનનું નામ લખો.' : 'Please enter the name of the equipment needed.');
      return;
    }

    setSubmitting(true);
    try {
      const resolvedName = bookingModalItem?.isCustom
        ? customEquipName.trim()
        : (bookingModalItem?.name || 'Custom Farm Machinery Request');

      const payload = {
        equipmentId: bookingModalItem?._id || undefined,
        equipmentName: resolvedName,
        farmerName: farmerName.trim(),
        farmerPhone: farmerPhone.trim(),
        farmerTaluka,
        farmerVillage,
        bookingType: bookingModalItem?.isCustom ? 'custom_request' : bookingType,
        rentalDurationHours: bookingType === 'rental' ? Number(rentalHours) : 0,
        notes: notes.trim(),
      };

      const result = await createEquipmentBooking(payload);
      setBookingSuccessData(result.booking || { _id: `BK-${Date.now().toString().slice(-6)}` });
    } catch (err) {
      alert(err.message || 'Failed to submit booking');
    } finally {
      setSubmitting(false);
    }
  };

  // Talukas in Vadodara District
  const talukas = [
    { id: 'all', en: 'All Talukas', gu: 'બધા તાલુકા' },
    { id: 'Padra', en: 'Padra', gu: 'પાદરા' },
    { id: 'Karjan', en: 'Karjan', gu: 'કરજણ' },
    { id: 'Dabhoi', en: 'Dabhoi', gu: 'ડભોઈ' },
    { id: 'Savli', en: 'Savli', gu: 'સાવલી' },
    { id: 'Waghodia', en: 'Waghodia', gu: 'વાઘોડિયા' },
    { id: 'Shinor', en: 'Shinor', gu: 'શિનોર' },
    { id: 'Vadodara Rural', en: 'Vadodara Rural', gu: 'વડોદરા ગ્રામ્ય' },
  ];

  // Categories
  const categories = [
    { id: 'all', en: 'All Implements', gu: 'બધા સાધનો' },
    { id: 'sprayers', en: 'Spraying Equipment', gu: 'છંટકાવ સાધનો' },
    { id: 'land_prep', en: 'Land Preparation & Tillage', gu: 'જમીન તૈયારી સાધનો' },
    { id: 'irrigation_solar', en: 'Irrigation & Solar', gu: 'સિંચાઈ & સોલાર' },
    { id: 'drone_tech', en: 'Drone Technology', gu: 'ડ્રોન ટેકનોલોજી' },
  ];

  return (
    <div
      id="marketplace-page-root"
      style={{
        backgroundColor: 'var(--bg-canvas)',
        minHeight: '100vh',
        paddingBottom: '4rem',
      }}
    >
      {/* Hero Header Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
          color: '#ffffff',
          padding: '3rem 1.5rem 2.75rem',
          boxShadow: '0 4px 20px rgba(27, 67, 50, 0.15)',
        }}
      >
        <div className="container" style={{ maxWidth: '1160px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(216, 243, 220, 0.22)',
                border: '1px solid #74c69d',
                color: '#d8f3dc',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                padding: '3px 10px',
                borderRadius: '20px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Wrench size={13} color="#d8f3dc" />
              {isGu ? 'કૃષિ યાંત્રિકીકરણ અને કસ્ટમ હાયરિંગ' : 'Custom Hiring Center & Mechanization'}
            </span>
            <span
              style={{
                backgroundColor: '#fef08a',
                color: '#854d0e',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '4px',
              }}
            >
              i-Khedut Subsidy 40-60%
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.2,
              marginBottom: '0.65rem',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {isGu ? 'કૃષિ ઓજાર & સાધન બજાર' : 'Agricultural Tools & Equipment Marketplace'}
          </h1>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#d8f3dc',
              maxWidth: '820px',
              lineHeight: 1.5,
              marginBottom: '1.75rem',
            }}
          >
            {isGu
              ? 'વડોદરા જિલ્લાના ખેડૂતો માટે સસ્તા દરે આધુનિક સાધન ભાડા પર મેળવવાની અને i-ખેડૂત પોર્ટલ હેઠળ ૪૦% થી ૬૦% સરકારી સબસિડી સાથે સાધન ખરીદવાની અધિકૃત સુવિધા.'
              : 'Affordable farm machinery rental and direct government i-Khedut subsidy assistance across Vadodara district. Rent precision sprayers, drones, rotavators, and laser levelers.'}
          </p>

          {/* Quick Pillars */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(216, 243, 220, 0.25)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#d8f3dc',
                  color: '#1b4332',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Zap size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                  {isGu ? 'ઝડપી ખેતર ડિલિવરી' : 'Rapid Field Dispatch'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#d8f3dc' }}>
                  {isGu ? 'પાદરા, કરજણ, ડભોઈ સહિત ૭ તાલુકામાં' : 'Active across all 7 Vadodara talukas'}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(216, 243, 220, 0.25)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#d8f3dc',
                  color: '#1b4332',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Tag size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                  {isGu ? 'i-ખેડૂત ૪૦-૬૦% સબસિડી' : 'i-Khedut Subsidy Linked'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#d8f3dc' }}>
                  {isGu ? 'SMAM & PM-KUSUM સહાય યોજના' : 'Pre-approved state government schemes'}
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(216, 243, 220, 0.25)',
                borderRadius: '12px',
                padding: '0.9rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  backgroundColor: '#d8f3dc',
                  color: '#1b4332',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff' }}>
                  {isGu ? 'પ્રમાણિત કૃષિ કેન્દ્રો' : 'Verified Agro Centers'}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#d8f3dc' }}>
                  {isGu ? 'ગાંધીનગર & જિલ્લા ખેતીવાડી નોંધાયેલ' : 'Government & FPO authorized equipment'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1160px', margin: '2rem auto 0', padding: '0 1rem' }}>
        {/* Search & Filter Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid var(--border-medium)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Top row: Search input & Taluka filter & Subsidy Toggle */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.85rem',
            }}
          >
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                flex: '1 1 280px',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }}
              />
              <input
                id="marketplace-search-input"
                type="text"
                placeholder={isGu ? 'સાધનનું નામ અથવા યોજના શોધો (દા.ત. ડ્રોન, પંપ, રોટાવેટર)...' : 'Search implement, drone, rotavator, or scheme...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-medium)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  backgroundColor: '#fbf9f5',
                  color: 'var(--text-title)',
                }}
              />
            </form>

            {/* Taluka Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="var(--green-primary)" />
              <select
                id="marketplace-taluka-select"
                value={selectedTaluka}
                onChange={(e) => setSelectedTaluka(e.target.value)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--border-medium)',
                  fontSize: '0.86rem',
                  fontWeight: 600,
                  backgroundColor: '#ffffff',
                  color: 'var(--text-title)',
                  cursor: 'pointer',
                }}
              >
                {talukas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {isGu ? t.gu : t.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Subsidy Only Pill Toggle */}
            <button
              type="button"
              id="marketplace-subsidy-toggle-btn"
              onClick={() => setSubsidyOnly(!subsidyOnly)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '8px 14px',
                borderRadius: '20px',
                border: subsidyOnly ? '1.5px solid var(--green-primary)' : '1px solid var(--border-medium)',
                backgroundColor: subsidyOnly ? 'var(--green-wash)' : '#ffffff',
                color: subsidyOnly ? 'var(--green-deep)' : 'var(--text-body)',
                fontWeight: 700,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Tag size={14} color={subsidyOnly ? 'var(--green-deep)' : 'var(--text-muted)'} />
              <span>{isGu ? 'માત્ર સબસિડી વાળા સાધનો' : 'Subsidy Eligible Only'}</span>
              {subsidyOnly && <Check size={14} color="var(--green-deep)" />}
            </button>

            {/* Request Other Equipment Button */}
            <button
              type="button"
              id="marketplace-custom-request-btn"
              onClick={() => openBookingModal(null, 'rental', true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '8px 16px',
                borderRadius: '10px',
                backgroundColor: 'var(--green-primary)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.84rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(45, 106, 79, 0.2)',
                marginLeft: 'auto',
              }}
            >
              <PlusCircle size={15} />
              <span>{isGu ? 'અન્ય સાધન માટે વિનંતી કરો' : 'Request Other Machinery'}</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '2px',
            }}
          >
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backgroundColor: active ? 'var(--green-primary)' : 'var(--bg-subtle)',
                    color: active ? '#ffffff' : 'var(--text-body)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isGu ? cat.gu : cat.en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Catalog List */}
        {loading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 1rem',
              color: 'var(--text-muted)',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: '36px',
                height: '36px',
                border: '3px solid var(--border-medium)',
                borderTopColor: 'var(--green-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                marginBottom: '1rem',
              }}
            />
            <p style={{ fontWeight: 600 }}>
              {isGu ? 'ઓજાર યાદી લોડ થઈ રહી છે...' : 'Loading machinery catalog...'}
            </p>
          </div>
        ) : equipments.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid var(--border-medium)',
            }}
          >
            <Wrench size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
              {isGu ? 'કોઈ સાધન મળ્યું નથી' : 'No machinery found matching your criteria'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {isGu
                ? 'કૃપા કરીને તાલુકો અથવા કેટેગરી ફિલ્ટર બદલીને ફરી તપાસો.'
                : 'Try adjusting your search terms or taluka filter.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTaluka('all');
                setSearchQuery('');
                setSubsidyOnly(false);
              }}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                backgroundColor: 'var(--green-primary)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isGu ? 'બધા ફિલ્ટર્સ સાફ કરો' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {equipments.map((item) => {
              const hasSubsidy = item.subsidyPercentage > 0;
              const hasRental = item.rentalRatePerHour > 0 || item.rentalRatePerDay > 0;

              return (
                <div
                  key={item._id}
                  id={`equip-card-${item._id}`}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid var(--border-medium)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                >
                  {/* Card Header & Photo */}
                  <div style={{ position: 'relative', height: '170px', backgroundColor: '#eef6f0' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />

                    {/* Category Tag Overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(27, 67, 50, 0.92)',
                        color: '#d8f3dc',
                        padding: '3px 9px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                      }}
                    >
                      {isGu ? item.categoryLabelGu : item.categoryLabel}
                    </div>

                    {/* Subsidy Badge Overlay */}
                    {hasSubsidy && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#15803d',
                          color: '#ffffff',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        <Sparkles size={12} />
                        <span>{item.subsidyPercentage}% {isGu ? 'સબસિડી' : 'Subsidy'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Title */}
                    <h3
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: 'var(--text-title)',
                        marginBottom: '0.25rem',
                        lineHeight: 1.3,
                      }}
                    >
                      {isGu ? item.nameGu : item.name}
                    </h3>
                    <div
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--text-muted)',
                        marginBottom: '0.9rem',
                      }}
                    >
                      {isGu ? item.name : item.nameGu}
                    </div>

                    {/* Specs Bullet Points */}
                    <div style={{ marginBottom: '1rem', flex: 1 }}>
                      {(isGu ? item.specsGu : item.specs).slice(0, 3).map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.45rem',
                            fontSize: '0.78rem',
                            color: 'var(--text-body)',
                            lineHeight: 1.4,
                            marginBottom: '0.35rem',
                          }}
                        >
                          <CheckCircle2
                            size={14}
                            color="var(--green-primary)"
                            style={{ flexShrink: 0, marginTop: '2px' }}
                          />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Subsidy Scheme Box */}
                    {hasSubsidy && (
                      <div
                        style={{
                          backgroundColor: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          borderRadius: '8px',
                          padding: '0.65rem 0.75rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: '#166534',
                            letterSpacing: '0.04em',
                            marginBottom: '2px',
                          }}
                        >
                          {isGu ? 'સરકારી યોજના:' : 'Govt Scheme:'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#14532d', fontWeight: 600 }}>
                          {isGu ? item.ikhedutSchemeGu : item.ikhedutScheme}
                        </div>
                      </div>
                    )}

                    {/* Pricing Grid: Rental vs Purchase */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: hasRental ? '1fr 1fr' : '1fr',
                        gap: '0.65rem',
                        padding: '0.85rem',
                        backgroundColor: '#fbf9f5',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        marginBottom: '1rem',
                      }}
                    >
                      {hasRental && (
                        <div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                            {isGu ? 'ભાડા દર (Rental)' : 'Custom Rental'}
                          </div>
                          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--green-deep)' }}>
                            ₹{item.rentalRatePerHour}
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>/કલાક</span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            (₹{item.rentalRatePerDay}/દિવસ)
                          </div>
                        </div>
                      )}

                      <div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {isGu ? 'ખરીદી / સબસિડી ભાવ' : 'Purchase / Net Price'}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#166534' }}>
                          ₹{(item.effectiveFarmerPrice || item.salePrice).toLocaleString('en-IN')}
                        </div>
                        {hasSubsidy && (
                          <div style={{ fontSize: '0.7rem', color: '#991b1b', textDecoration: 'line-through' }}>
                            ₹{item.salePrice.toLocaleString('en-IN')} MRP
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Taluka Availability */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        flexWrap: 'wrap',
                        marginBottom: '1.1rem',
                      }}
                    >
                      <MapPin size={13} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {isGu ? 'ઉપલબ્ધ તાલુકા:' : 'Available in:'}
                      </span>
                      {item.talukaAvailability.slice(0, 3).map((tal, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            fontSize: '0.68rem',
                            backgroundColor: '#ffffff',
                            border: '1px solid var(--border-subtle)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            color: 'var(--text-body)',
                          }}
                        >
                          {tal}
                        </span>
                      ))}
                      {item.talukaAvailability.length > 3 && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          +{item.talukaAvailability.length - 3} વધુ
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      {hasRental && (
                        <button
                          type="button"
                          id={`rent-btn-${item._id}`}
                          onClick={() => openBookingModal(item, 'rental')}
                          style={{
                            flex: 1,
                            padding: '9px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: 'var(--green-primary)',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.35rem',
                            boxShadow: '0 2px 6px rgba(45, 106, 79, 0.2)',
                          }}
                        >
                          <Clock size={14} />
                          <span>{isGu ? 'ભાડે મેળવો' : 'Book Rental'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        id={`subsidy-btn-${item._id}`}
                        onClick={() => openBookingModal(item, 'subsidy_guidance')}
                        style={{
                          flex: 1,
                          padding: '9px 12px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--green-primary)',
                          backgroundColor: '#ffffff',
                          color: 'var(--green-deep)',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.35rem',
                        }}
                      >
                        <Tag size={14} />
                        <span>{isGu ? 'સબસિડી માહિતી' : 'Subsidy Help'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Booking & Subsidy Inquiry Modal */}
      {bookingModalItem && (
        <div
          id="equipment-booking-modal"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--green-deep)',
                color: '#ffffff',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '0.74rem', color: '#d8f3dc', fontWeight: 700, textTransform: 'uppercase' }}>
                  {bookingModalItem.isCustom
                    ? isGu
                      ? 'વિશેષ સાધન વિનંતી (Custom Request)'
                      : 'Special Machinery Request'
                    : bookingType === 'rental'
                    ? isGu
                      ? 'કસ્ટમ હાયરિંગ બુકિંગ વિનંતી'
                      : 'Equipment Rental Booking'
                    : isGu
                    ? 'i-ખેડૂત સબસિડી સહાય અરજી'
                    : 'i-Khedut Subsidy Application'}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {bookingModalItem.isCustom
                    ? isGu
                      ? 'કૃષિ સાધનની વિશેષ વિનંતી'
                      : 'Request Agricultural Machinery'
                    : isGu
                    ? bookingModalItem.nameGu
                    : bookingModalItem.name}
                </h3>
              </div>
              <button
                type="button"
                id="close-booking-modal-btn"
                onClick={closeBookingModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem' }}>
              {bookingSuccessData ? (
                /* Success Screen */
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      backgroundColor: '#dcfce7',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--green-deep)', marginBottom: '0.5rem' }}>
                    {isGu ? 'વિનંતી સફળતાપૂર્વક નોંધાઈ ગઈ છે!' : 'Booking Request Registered Successfully!'}
                  </h3>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {isGu
                      ? `તમારો બુકિંગ રેફરન્સ નંબર #${bookingSuccessData._id} છે. સંબંધિત તાલુકા કસ્ટમ હાયરિંગ સેન્ટર (CHC) ના પ્રતિનિધિ ટૂંક સમયમાં તમારા મોબાઇલ પર સંપર્ક કરશે.`
                      : `Your booking reference ID is #${bookingSuccessData._id}. The taluka Custom Hiring Center (CHC) will contact your phone shortly to confirm equipment dispatch.`}
                  </p>

                  <div
                    style={{
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'left',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                      {isGu ? 'સહાયતા હેલ્પલાઇન:' : 'Dispatch Helpline:'}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, color: '#14532d' }}>
                      <Phone size={16} />
                      <span>{bookingModalItem.vendorContact?.phone || '+91 94270 91823'}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '2px' }}>
                      {bookingModalItem.vendorContact?.name || 'Vadodara Agro Machinery Center'}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeBookingModal}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--green-primary)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isGu ? 'પૂર્ણ કરો' : 'Close Window'}
                  </button>
                </div>
              ) : (
                /* Booking Form */
                <form onSubmit={handleConfirmBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Custom Equipment Name Input */}
                  {bookingModalItem.isCustom && (
                    <div style={{ backgroundColor: '#f0fdf4', border: '1.5px solid #86efac', padding: '0.85rem 1rem', borderRadius: '10px' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#166534', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'સાધન અથવા મશીનરીનું નામ *' : 'Equipment or Implement Needed *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={customEquipName}
                        onChange={(e) => setCustomEquipName(e.target.value)}
                        placeholder={isGu ? 'દા.ત. કમ્બાઈન હાર્વેસ્ટર, રોટરી વીડર, સ્ટ્રો રીપર...' : 'e.g. Combine Harvester, Straw Reaper, Bed Planter, Power Weeder...'}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1px solid #bbf7d0',
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          backgroundColor: '#ffffff',
                        }}
                      />
                      <div style={{ fontSize: '0.74rem', color: '#15803d', marginTop: '4px' }}>
                        {isGu ? 'તમને જોઈતા સાધનની વિગત લખો. કૃષિ કેન્દ્ર આ સાધન ઉપલબ્ધ કરાવવા સંપર્ક કરશે.' : 'Specify the machinery required. Your local Custom Hiring Center will arrange availability.'}
                      </div>
                    </div>
                  )}

                  {/* Booking Type Switcher */}
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: '#f3efe6',
                      padding: '3px',
                      borderRadius: '10px',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setBookingType('rental')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        backgroundColor: bookingType === 'rental' ? '#ffffff' : 'transparent',
                        color: bookingType === 'rental' ? 'var(--green-deep)' : 'var(--text-muted)',
                        boxShadow: bookingType === 'rental' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                      }}
                    >
                      {isGu ? 'ખેતર ભાડા પર મેળવો (Rental)' : 'Custom Field Rental'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingType('subsidy_guidance')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: 'none',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        backgroundColor: bookingType === 'subsidy_guidance' ? '#ffffff' : 'transparent',
                        color: bookingType === 'subsidy_guidance' ? 'var(--green-deep)' : 'var(--text-muted)',
                        boxShadow: bookingType === 'subsidy_guidance' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                      }}
                    >
                      {isGu ? 'સબસિડી સાથે ખરીદી સલાહ' : 'Subsidy Purchase Inquiry'}
                    </button>
                  </div>

                  {/* Rental Hours Calculator */}
                  {bookingType === 'rental' && (
                    <div
                      style={{
                        backgroundColor: '#eef6f0',
                        padding: '0.9rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-medium)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--green-deep)' }}>
                          {isGu ? 'જરૂરી કલાક (Duration)' : 'Required Rental Duration'}:
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--green-primary)' }}>
                          {rentalHours} {isGu ? 'કલાક' : 'Hours'}
                        </span>
                      </div>
                      <input
                        id="booking-rental-hours-range"
                        type="range"
                        min="2"
                        max="24"
                        step="1"
                        value={rentalHours}
                        onChange={(e) => setRentalHours(e.target.value)}
                        style={{ width: '100%', accentColor: 'var(--green-primary)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.84rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>
                          {isGu ? 'અંદાજિત ભાડું:' : 'Estimated Rental Cost:'}
                        </span>
                        <span style={{ fontWeight: 800, color: 'var(--green-deep)', fontSize: '1.05rem' }}>
                          ₹{(bookingModalItem.rentalRatePerHour * Number(rentalHours)).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Subsidy Benefit Summary */}
                  {bookingType === 'subsidy_guidance' && (
                    <div
                      style={{
                        backgroundColor: '#f0fdf4',
                        padding: '0.9rem 1rem',
                        borderRadius: '12px',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <div style={{ fontSize: '0.82rem', color: '#166534', fontWeight: 700, marginBottom: '4px' }}>
                        {isGu ? 'i-ખેડૂત સબસિડી અંદાજ:' : 'i-Khedut Subsidy Overview:'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                        <span>{isGu ? 'મૂળ સાધન કિંમત:' : 'Original MRP:'}</span>
                        <span style={{ textDecoration: 'line-through' }}>₹{bookingModalItem.salePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                        <span>{isGu ? 'ખેડૂત ચુકવવાપાત્ર રકમ:' : 'Net Farmer Payable:'}</span>
                        <span>₹{(bookingModalItem.effectiveFarmerPrice || bookingModalItem.salePrice).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  {/* Farmer Details Input */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'ખેડૂતનું પૂરું નામ *' : 'Farmer Full Name *'}
                      </label>
                      <input
                        id="booking-farmer-name-input"
                        type="text"
                        required
                        placeholder="Rameshbhai Patel"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-medium)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'મોબાઇલ નંબર *' : 'Contact Mobile *'}
                      </label>
                      <input
                        id="booking-farmer-phone-input"
                        type="tel"
                        required
                        placeholder="+91 98250 XXXXX"
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-medium)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'તાલુકો *' : 'Taluka *'}
                      </label>
                      <select
                        id="booking-farmer-taluka-select"
                        value={farmerTaluka}
                        onChange={(e) => setFarmerTaluka(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-medium)',
                          fontSize: '0.86rem',
                          backgroundColor: '#ffffff',
                        }}
                      >
                        {talukas.filter((t) => t.id !== 'all').map((t) => (
                          <option key={t.id} value={t.id}>
                            {isGu ? t.gu : t.en}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                        {isGu ? 'ગામનું નામ' : 'Village Name'}
                      </label>
                      <input
                        id="booking-farmer-village-input"
                        type="text"
                        placeholder="e.g. Mobha Road"
                        value={farmerVillage}
                        onChange={(e) => setFarmerVillage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: '1.5px solid var(--border-medium)',
                          fontSize: '0.86rem',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', display: 'block', marginBottom: '4px' }}>
                      {isGu ? 'વિશેષ નોંધ અથવા પાકની વિગતો' : 'Notes / Crop Area'}
                    </label>
                    <textarea
                      id="booking-notes-textarea"
                      rows={2}
                      placeholder={isGu ? 'દા.ત. ૫ એકર કપાસમાં છંટકાવ કરવાનો છે' : 'e.g. Need spray for 5 acres cotton field'}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1.5px solid var(--border-medium)',
                        fontSize: '0.86rem',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="submit-equipment-booking-btn"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: 'var(--green-primary)',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '0.94rem',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 12px rgba(45, 106, 79, 0.25)',
                      marginTop: '0.5rem',
                    }}
                  >
                    {submitting
                      ? isGu
                        ? 'વિનંતી સબમિટ થઈ રહી છે...'
                        : 'Submitting Request...'
                      : isGu
                      ? 'વિનંતી કન્ફર્મ કરો'
                      : 'Confirm Booking Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
