import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Layers,
  Thermometer,
  Trees,
  Wind,
  Maximize2,
  MapPin,
  Flame,
  CheckCircle2,
  Info,
  Sparkles,
} from 'lucide-react';

// Ward polygon footprints (realistic geographic boundaries centered on Vadodara Wards)
const WARD_POLYGONS = {
  'ward-01': [
    // Alkapuri & RC Dutt Road
    [22.3160, 73.1630],
    [22.3180, 73.1760],
    [22.3120, 73.1810],
    [22.3040, 73.1740],
    [22.3060, 73.1620],
  ],
  'ward-02': [
    // Makarpura GIDC Industrial Corridor
    [22.2640, 73.1850],
    [22.2660, 73.2080],
    [22.2420, 73.2090],
    [22.2390, 73.1880],
    [22.2510, 73.1820],
  ],
  'ward-03': [
    // Old City (Mandvi & Nyay Mandir)
    [22.3070, 73.1970],
    [22.3080, 73.2120],
    [22.2930, 73.2130],
    [22.2920, 73.1980],
  ],
  'ward-04': [
    // Sayajigunj & MS University Campus (Kamati Baug green lung)
    [22.3240, 73.1810],
    [22.3260, 73.1990],
    [22.3100, 73.2010],
    [22.3080, 73.1820],
  ],
  'ward-05': [
    // Gotri & Vasna Urban Extension
    [22.3180, 73.1310],
    [22.3200, 73.1530],
    [22.2980, 73.1510],
    [22.2970, 73.1320],
  ],
};

export const UrbanHeat2DMap = ({
  wards = [],
  selectedWard = null,
  onSelectWard = () => {},
  onRunSimulator = () => {},
  currentLang = 'en',
}) => {
  const isGu = currentLang === 'gu';
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  // Active view layer: 'lst' (Surface Heat) | 'ndvi' (Canopy/Greenery) | 'cooling' (Cooling Potential)
  const [activeLayer, setActiveLayer] = useState('lst');

  // Helper: Color by metric and risk
  const getWardColor = (ward, layer) => {
    if (layer === 'ndvi') {
      if (ward.ndvi >= 0.45) return '#15803d'; // High Greenery
      if (ward.ndvi >= 0.3) return '#65a30d';
      if (ward.ndvi >= 0.2) return '#eab308';
      return '#dc2626'; // Sparse
    }
    if (layer === 'cooling') {
      if (ward.coolingPotentialC <= -3.0) return '#0284c7'; // Max cooling impact
      if (ward.coolingPotentialC <= -2.0) return '#0ea5e9';
      return '#38bdf8';
    }
    // Default LST
    if (ward.surfaceTempC >= 42.0) return '#dc2626'; // Severe Hotspot
    if (ward.surfaceTempC >= 40.0) return '#ea580c'; // High Heat
    if (ward.surfaceTempC >= 38.0) return '#eab308'; // Moderate
    return '#16a34a'; // Cool Oasis
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: [22.3072, 73.1812],
        zoom: 12,
        minZoom: 11,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });

      // Map Tiles:
      // Priority 1: Mapbox if VITE_MAPBOX_TOKEN is provided in frontend/.env
      // Priority 2: CartoDB with API Key if VITE_CARTO_API_KEY is provided
      // Default: OpenStreetMap standard tiles (100% free, zero watermark, reliable open-access)
      const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;
      const cartoKey = import.meta.env.VITE_CARTO_API_KEY;

      let tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
      let tileOptions = {
        maxZoom: 19,
      };

      if (mapboxToken) {
        tileUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`;
        tileOptions = {
          maxZoom: 19,
          tileSize: 512,
          zoomOffset: -1,
        };
      } else if (cartoKey) {
        tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${cartoKey}`;
        tileOptions = {
          subdomains: 'abcd',
          maxZoom: 19,
        };
      }

      L.tileLayer(tileUrl, tileOptions).addTo(map);

      // Custom Zoom Control top-right
      L.control
        .zoom({
          position: 'topright',
        })
        .addTo(map);

      // Attribution
      L.control
        .attribution({
          position: 'bottomright',
          prefix: mapboxToken
            ? 'Mapbox • Vadodara Municipal GeoGrid'
            : cartoKey
            ? 'CartoDB • Vadodara Municipal GeoGrid'
            : 'OpenStreetMap • Vadodara Municipal GeoGrid',
        })
        .addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render ward polygons, circles and interactive markers
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !wards.length) return;

    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    wards.forEach((ward) => {
      const isSelected = selectedWard?.id === ward.id;
      const color = getWardColor(ward, activeLayer);
      const polygonCoords = WARD_POLYGONS[ward.id];

      // 1. Render Ward Geographic Polygon
      if (polygonCoords) {
        const polygon = L.polygon(polygonCoords, {
          color: isSelected ? '#15803d' : color,
          weight: isSelected ? 3.5 : 2,
          opacity: isSelected ? 0.95 : 0.75,
          fillColor: color,
          fillOpacity: isSelected ? 0.42 : 0.24,
          dashArray: isSelected ? null : '4, 4',
        });

        polygon.on('click', () => {
          onSelectWard(ward);
        });

        polygon.bindTooltip(
          `<strong>${isGu ? ward.nameGu || ward.name : ward.name}</strong><br/>
           ${activeLayer === 'lst' ? `LST: ${ward.surfaceTempC}°C` : activeLayer === 'ndvi' ? `NDVI: ${ward.ndvi}` : `Potential: ${ward.coolingPotentialC}°C`}`,
          { direction: 'top', className: 'haritayan-map-tooltip' }
        );

        layerGroup.addLayer(polygon);
      }

      // 2. Hotspot Heat Circle
      if (ward.lat && ward.lng) {
        const radius = ward.surfaceTempC >= 42 ? 1400 : ward.surfaceTempC >= 39 ? 1100 : 900;
        const heatCircle = L.circle([ward.lat, ward.lng], {
          radius: radius,
          color: 'transparent',
          fillColor: color,
          fillOpacity: activeLayer === 'lst' && ward.surfaceTempC >= 42 ? 0.28 : 0.16,
        });
        layerGroup.addLayer(heatCircle);

        // 3. Interactive HTML DivIcon Pin
        const pinHtml = `
          <div class="ward-map-pin ${isSelected ? 'pin-selected' : ''}" style="
            background: #ffffff;
            border: 2px solid ${color};
            box-shadow: 0 4px 14px rgba(0,0,0,0.18);
            border-radius: 20px;
            padding: 4px 10px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-family: inherit;
            cursor: pointer;
            white-space: nowrap;
            transform: translate(-50%, -50%);
            transition: all 0.2s ease;
          ">
            <span style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${color};
              display: inline-block;
              ${ward.surfaceTempC >= 42 ? 'box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.35);' : ''}
            "></span>
            <span style="font-size: 11px; font-weight: 800; color: #1b4332;">
              ${isGu ? (ward.nameGu || ward.name).split(' ')[0] : ward.name.split(' ')[0]}
            </span>
            <span style="
              font-size: 10px;
              font-weight: 800;
              background-color: ${color}15;
              color: ${color};
              padding: 1px 5px;
              border-radius: 6px;
            ">
              ${activeLayer === 'lst' ? `${ward.surfaceTempC}°C` : activeLayer === 'ndvi' ? `NDVI ${ward.ndvi}` : `${ward.coolingPotentialC}°C`}
            </span>
          </div>
        `;

        const customIcon = L.divIcon({
          html: pinHtml,
          className: 'custom-ward-div-icon',
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([ward.lat, ward.lng], { icon: customIcon });

        marker.on('click', () => {
          onSelectWard(ward);
        });

        layerGroup.addLayer(marker);
      }
    });
  }, [wards, selectedWard, activeLayer, isGu]);

  // Smoothly fly to selected ward on map
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedWard?.lat || !selectedWard?.lng) return;
    mapInstanceRef.current.flyTo([selectedWard.lat, selectedWard.lng], 13.6, {
      duration: 1.0,
      easeLinearity: 0.25,
    });
  }, [selectedWard]);

  // Reset to district view
  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([22.3072, 73.1812], 12, { duration: 0.8 });
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        marginBottom: '2rem',
        position: 'relative',
      }}
    >
      {/* Map Header Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.75rem',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#dcfce7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Flame size={20} color="#16a34a" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1b4332', fontWeight: 800 }}>
              {isGu ? 'વડોદરા ૨D શહેરી ગરમી નકશો' : 'Vadodara 2D Urban Heat Island Observatory'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {isGu
                ? 'સેટેલાઇટ થર્મલ સ્કેન અને વોર્ડ મુજબ જમીન સપાટી ગરમી'
                : 'Landsat-9 / Sentinel-2 Thermal Radiometry & Microclimate Ward Grid'}
            </span>
          </div>
        </div>

        {/* Layer Switcher Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveLayer('lst')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: activeLayer === 'lst' ? '1px solid #dc2626' : '1px solid #cbd5e1',
              backgroundColor: activeLayer === 'lst' ? '#fee2e2' : '#ffffff',
              color: activeLayer === 'lst' ? '#b91c1c' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Thermometer size={14} />
            <span>{isGu ? 'સપાટી ગરમી (LST)' : 'Surface Heat (LST)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('ndvi')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: activeLayer === 'ndvi' ? '1px solid #16a34a' : '1px solid #cbd5e1',
              backgroundColor: activeLayer === 'ndvi' ? '#dcfce7' : '#ffffff',
              color: activeLayer === 'ndvi' ? '#15803d' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Trees size={14} />
            <span>{isGu ? 'કેનોપી / હરિયાળી (NDVI)' : 'Canopy Cover (NDVI)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveLayer('cooling')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              border: activeLayer === 'cooling' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: activeLayer === 'cooling' ? '#e0f2fe' : '#ffffff',
              color: activeLayer === 'cooling' ? '#0369a1' : '#475569',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <Wind size={14} />
            <span>{isGu ? 'શીતળતા સંભાવના' : 'Cooling Potential'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetView}
            title={isGu ? 'સમગ્ર વડોદરા દૃશ્ય' : 'Reset to Vadodara View'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#475569',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Maximize2 size={13} />
            <span>{isGu ? 'રીસેટ' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div style={{ position: 'relative', width: '100%', height: '480px' }}>
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#e5e7eb',
          }}
        />

        {/* Floating Active Metric Legend on Map */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 1000,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: '10px 14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.14)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            fontSize: '0.76rem',
            color: '#1b4332',
            maxWidth: '300px',
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={13} color="#16a34a" />
            <span>
              {activeLayer === 'lst'
                ? isGu
                  ? 'જમીન સપાટી ગરમી સ્કેલ (LST)'
                  : 'Surface Temp (LST) Scale'
                : activeLayer === 'ndvi'
                ? isGu
                  ? 'કેનોપી વનસ્પતિ સૂચકાંક (NDVI)'
                  : 'Vegetation Canopy (NDVI)'
                : isGu
                ? 'શીતળતા સંભાવના સ્કેલ'
                : 'Microclimate Cooling Potential'}
            </span>
          </div>

          {activeLayer === 'lst' && (
            <div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #16a34a, #eab308, #ea580c, #dc2626)',
                  marginBottom: '5px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                <span>&lt; 37°C (Oasis)</span>
                <span>39°C</span>
                <span>41°C</span>
                <span>&gt; 43°C (Severe)</span>
              </div>
            </div>
          )}

          {activeLayer === 'ndvi' && (
            <div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #dc2626, #eab308, #65a30d, #15803d)',
                  marginBottom: '5px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                <span>0.10 (Sparse)</span>
                <span>0.25</span>
                <span>0.40</span>
                <span>&gt; 0.50 (Dense)</span>
              </div>
            </div>
          )}

          {activeLayer === 'cooling' && (
            <div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #bae6fd, #38bdf8, #0284c7)',
                  marginBottom: '5px',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                <span>-1.0°C</span>
                <span>-2.5°C</span>
                <span>-3.8°C (Max Benefit)</span>
              </div>
            </div>
          )}
        </div>

        {/* Selected Ward Quick Diagnostic Card Floating Over Map */}
        {selectedWard && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              zIndex: 1000,
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(10px)',
              borderRadius: '14px',
              padding: '12px 16px',
              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
              border: '1.5px solid #16a34a',
              maxWidth: '320px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
                {isGu ? 'પસંદ કરેલ વોર્ડ' : 'SELECTED ZONE'}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: selectedWard.surfaceTempC >= 42 ? '#fee2e2' : '#fef9c3',
                  color: selectedWard.surfaceTempC >= 42 ? '#b91c1c' : '#a16207',
                }}
              >
                {selectedWard.heatIslandIntensity}
              </span>
            </div>

            <div style={{ fontSize: '1rem', fontWeight: 800, color: '#1b4332', marginBottom: '8px' }}>
              {isGu ? selectedWard.nameGu || selectedWard.name : selectedWard.name}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem', marginBottom: '10px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Surface (LST)</span>
                <strong style={{ color: selectedWard.surfaceTempC >= 42 ? '#dc2626' : '#ea580c', fontSize: '0.98rem' }}>
                  {selectedWard.surfaceTempC}°C
                </strong>
              </div>
              <div style={{ backgroundColor: '#f8fafc', padding: '6px 8px', borderRadius: '8px' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem' }}>Canopy Cover</span>
                <strong style={{ color: '#15803d', fontSize: '0.98rem' }}>
                  {selectedWard.canopyCoveragePercent}%
                </strong>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRunSimulator(selectedWard)}
              style={{
                width: '100%',
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#16a34a',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Wind size={13} />
              <span>{isGu ? 'વૃક્ષ સિમ્યુલેટર ચલાવો' : 'Simulate Tree Cooling'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UrbanHeat2DMap;
