import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Trees,
  Sun,
  Eye,
  RotateCcw,
  Maximize2,
  Sparkles,
  Droplets,
  Layers,
  Compass,
} from 'lucide-react';

export const TreeCanopy3D = ({
  selectedTree = null,
  treeCount = 60,
  currentLang = 'en',
}) => {
  const isGu = currentLang === 'gu';
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const treeGroupRef = useRef(null);
  const sunLightRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // View modes: 'specimen' (Detailed single tree) | 'grove' (Multi-tree urban plantation)
  const [viewMode, setViewMode] = useState('specimen');

  // Sun time: 'morning' (9 AM) | 'noon' (1 PM peak sun) | 'evening' (5 PM long shadows)
  const [sunTime, setSunTime] = useState('noon');

  // Mouse orbit state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const rotationRef = useRef({ x: 0.35, y: 0.8 });
  const zoomDistanceRef = useRef(18);

  // Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth || 600;
    const height = 440;

    // 1. Scene & Atmosphere Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0fdf4);
    scene.fog = new THREE.FogExp2(0xf0fdf4, 0.015);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 150);
    cameraRef.current = camera;

    // 3. Renderer with Soft Shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0xf3efe6, 0.4);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(12, 24, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 70;
    const d = 20;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // 5. Ground Plane with Grid Texture
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xf3efe6,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    // Subtle Road / Pavement strip to visualize urban shading
    const roadGeo = new THREE.PlaneGeometry(12, 60);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x475569, // Asphalt street
      roughness: 0.9,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(6, -0.01, 0);
    road.receiveShadow = true;
    scene.add(road);

    // Sidewalk curb
    const curbGeo = new THREE.BoxGeometry(0.6, 0.2, 60);
    const curbMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1 });
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(0, 0.1, 0);
    curb.receiveShadow = true;
    scene.add(curb);

    // 6. Tree Group Container
    const treeGroup = new THREE.Group();
    scene.add(treeGroup);
    treeGroupRef.current = treeGroup;

    // 7. Render Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      // Camera position from spherical coordinates
      const camDist = zoomDistanceRef.current;
      const rotX = rotationRef.current.x;
      const rotY = rotationRef.current.y;

      camera.position.x = camDist * Math.sin(rotY) * Math.cos(rotX);
      camera.position.y = camDist * Math.sin(rotX);
      camera.position.z = camDist * Math.cos(rotY) * Math.cos(rotX);
      camera.lookAt(0, 2.8, 0);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      camera.aspect = newW / height;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Sun Directional Light based on Time of Day
  useEffect(() => {
    if (!sunLightRef.current) return;
    const sun = sunLightRef.current;
    if (sunTime === 'morning') {
      sun.position.set(22, 12, 16);
      sun.color.setHex(0xffedd5); // Warm amber morning
      sun.intensity = 1.1;
    } else if (sunTime === 'evening') {
      sun.position.set(-22, 10, 16);
      sun.color.setHex(0xfed7aa); // Golden hour long shadows
      sun.intensity = 1.0;
    } else {
      // Noon (1 PM)
      sun.position.set(4, 28, 6);
      sun.color.setHex(0xffffff); // Overhead crisp sun
      sun.intensity = 1.35;
    }
  }, [sunTime]);

  // Construct Procedural 3D Tree Mesh Based on Species & Density
  useEffect(() => {
    if (!treeGroupRef.current || !sceneRef.current) return;
    const group = treeGroupRef.current;

    // Clear previous tree objects
    while (group.children.length > 0) {
      const obj = group.children[0];
      group.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
        else obj.material.dispose();
      }
    }

    const speciesId = selectedTree?.id || 'tree-neem';

    // Materials definition
    const barkMaterial = new THREE.MeshStandardMaterial({
      color: speciesId === 'tree-banyan' ? 0x5c4033 : speciesId === 'tree-peepal' ? 0x78716c : 0x451a03,
      roughness: 0.9,
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color:
        speciesId === 'tree-banyan'
          ? 0x14532d // Deep dense green
          : speciesId === 'tree-gulmohar'
          ? 0x15803d // Fern green
          : speciesId === 'tree-peepal'
          ? 0x166534 // Broad leaf green
          : 0x16a34a, // Fresh neem green
      roughness: 0.65,
      metalness: 0.05,
      flatShading: true,
    });

    // Helper: Build a single detailed 3D tree
    const buildTreeInstance = (x = 0, z = 0, scale = 1.0) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      tree.scale.set(scale, scale, scale);

      if (speciesId === 'tree-banyan') {
        // Banyan: Thick sprawling fluted trunk + wide canopy + aerial roots
        const trunkGeo = new THREE.CylinderGeometry(0.8, 1.3, 4.2, 10);
        const trunk = new THREE.Mesh(trunkGeo, barkMaterial);
        trunk.position.y = 2.1;
        trunk.castShadow = true;
        trunk.receiveShadow = true;
        tree.add(trunk);

        // Aerial prop roots
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const rootGeo = new THREE.CylinderGeometry(0.12, 0.16, 3.8, 6);
          const root = new THREE.Mesh(rootGeo, barkMaterial);
          root.position.set(Math.cos(angle) * 2.2, 1.9, Math.sin(angle) * 2.2);
          root.castShadow = true;
          tree.add(root);
        }

        // Sprawling Tiered Canopy Clouds
        const canopyClusters = [
          { r: 3.8, x: 0, y: 5.4, z: 0 },
          { r: 2.8, x: 2.4, y: 4.6, z: 1.2 },
          { r: 2.9, x: -2.3, y: 4.7, z: -1.0 },
          { r: 2.7, x: 1.0, y: 4.8, z: -2.2 },
          { r: 2.7, x: -1.2, y: 4.8, z: 2.1 },
        ];
        canopyClusters.forEach((c) => {
          const foliageGeo = new THREE.DodecahedronGeometry(c.r, 1);
          const foliage = new THREE.Mesh(foliageGeo, leafMaterial);
          foliage.position.set(c.x, c.y, c.z);
          foliage.castShadow = true;
          foliage.receiveShadow = true;
          tree.add(foliage);
        });
      } else if (speciesId === 'tree-gulmohar') {
        // Gulmohar: Upright trunk branching into a wide flat umbrella crown with scarlet blooms
        const trunkGeo = new THREE.CylinderGeometry(0.4, 0.65, 4.8, 8);
        const trunk = new THREE.Mesh(trunkGeo, barkMaterial);
        trunk.position.y = 2.4;
        trunk.castShadow = true;
        tree.add(trunk);

        // Flat umbrella crown
        const crownGeo = new THREE.CylinderGeometry(4.2, 2.6, 1.8, 12);
        const crown = new THREE.Mesh(crownGeo, leafMaterial);
        crown.position.y = 5.2;
        crown.castShadow = true;
        crown.receiveShadow = true;
        tree.add(crown);

        // Scarlet flower highlights
        const flowerMat = new THREE.MeshStandardMaterial({
          color: 0xef4444, // Vibrant Gulmohar red
          roughness: 0.5,
          flatShading: true,
        });
        for (let i = 0; i < 7; i++) {
          const flGeo = new THREE.IcosahedronGeometry(0.7, 0);
          const fl = new THREE.Mesh(flGeo, flowerMat);
          const ang = (i * Math.PI * 2) / 7;
          fl.position.set(Math.cos(ang) * 3.1, 5.8, Math.sin(ang) * 3.1);
          fl.castShadow = true;
          tree.add(fl);
        }
      } else if (speciesId === 'tree-peepal') {
        // Peepal: Broad majestic rounded canopy dome
        const trunkGeo = new THREE.CylinderGeometry(0.55, 0.9, 4.4, 8);
        const trunk = new THREE.Mesh(trunkGeo, barkMaterial);
        trunk.position.y = 2.2;
        trunk.castShadow = true;
        tree.add(trunk);

        const domeGeo = new THREE.SphereGeometry(3.6, 9, 8);
        domeGeo.scale(1.2, 0.9, 1.2);
        const dome = new THREE.Mesh(domeGeo, leafMaterial);
        dome.position.y = 5.6;
        dome.castShadow = true;
        dome.receiveShadow = true;
        tree.add(dome);
      } else {
        // Neem: Compact upright rounded crown with fine textured foliar clusters
        const trunkGeo = new THREE.CylinderGeometry(0.45, 0.7, 4.0, 8);
        const trunk = new THREE.Mesh(trunkGeo, barkMaterial);
        trunk.position.y = 2.0;
        trunk.castShadow = true;
        tree.add(trunk);

        const neemClusters = [
          { r: 2.8, x: 0, y: 5.0, z: 0 },
          { r: 2.1, x: 1.2, y: 4.4, z: 0.6 },
          { r: 2.0, x: -1.2, y: 4.5, z: -0.5 },
          { r: 1.8, x: 0.2, y: 4.3, z: -1.1 },
        ];
        neemClusters.forEach((c) => {
          const folGeo = new THREE.DodecahedronGeometry(c.r, 1);
          const fol = new THREE.Mesh(folGeo, leafMaterial);
          fol.position.set(c.x, c.y, c.z);
          fol.castShadow = true;
          fol.receiveShadow = true;
          tree.add(fol);
        });
      }

      return tree;
    };

    if (viewMode === 'specimen') {
      // Single tree specimen in center
      group.add(buildTreeInstance(0, 0, 1.0));
      zoomDistanceRef.current = 17;
    } else {
      // Grove Mode: Multiple trees simulating the slider plantation count
      // Scale count into a representative avenue grove of 5 to 14 3D models
      const displayCount = Math.min(14, Math.max(5, Math.round(treeCount / 20)));

      for (let i = 0; i < displayCount; i++) {
        const side = i % 2 === 0 ? -1 : 1;
        const zPos = (Math.floor(i / 2) - displayCount / 4) * 4.2;
        const xPos = side * 3.6;
        const randScale = 0.85 + Math.random() * 0.25;
        group.add(buildTreeInstance(xPos, zPos, randScale));
      }
      zoomDistanceRef.current = 26;
    }
  }, [selectedTree, viewMode, treeCount]);

  // Mouse / Touch Orbit Event Handlers
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - prevMousePosRef.current.x;
    const deltaY = e.clientY - prevMousePosRef.current.y;

    rotationRef.current.y -= deltaX * 0.008;
    rotationRef.current.x = Math.max(0.12, Math.min(1.25, rotationRef.current.x + deltaY * 0.008));

    prevMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e) => {
    zoomDistanceRef.current = Math.max(9, Math.min(38, zoomDistanceRef.current + e.deltaY * 0.015));
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
      {/* 3D Toolbar Header */}
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
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Trees size={20} color="#0284c7" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#1b4332', fontWeight: 800 }}>
              {isGu ? '૩D વૃક્ષ કેનોપી અને છાંયો સિમ્યુલેટર' : '3D Native Tree Canopy & Shadow Simulator'}
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
              {isGu
                ? 'વાસ્તવિક ૩D મોડેલ, કેનોપી કદ અને જમીન પર પડતો છાંયો'
                : 'Real-time 3D WebGL foliage anatomy, solar angle tracking & ground shade footprint'}
            </span>
          </div>
        </div>

        {/* View Mode & Time Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* Specimen vs Grove Toggle */}
          <div style={{ display: 'flex', backgroundColor: '#e2e8f0', borderRadius: '8px', padding: '2px' }}>
            <button
              type="button"
              onClick={() => setViewMode('specimen')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'specimen' ? '#ffffff' : 'transparent',
                color: viewMode === 'specimen' ? '#166534' : '#64748b',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: 'pointer',
              }}
            >
              {isGu ? 'વૃક્ષ નમૂનો' : 'Specimen'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grove')}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: viewMode === 'grove' ? '#ffffff' : 'transparent',
                color: viewMode === 'grove' ? '#166534' : '#64748b',
                fontWeight: 700,
                fontSize: '0.76rem',
                cursor: 'pointer',
              }}
            >
              {isGu ? 'શહેરી પટ્ટો (Avenue)' : 'Urban Belt'}
            </button>
          </div>

          {/* Sun Angle Selector */}
          <div style={{ display: 'flex', backgroundColor: '#fef3c7', borderRadius: '8px', padding: '2px', border: '1px solid #fde68a' }}>
            <button
              type="button"
              onClick={() => setSunTime('morning')}
              title="Morning Sun (9 AM)"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: sunTime === 'morning' ? '#ffffff' : 'transparent',
                color: sunTime === 'morning' ? '#b45309' : '#92400e',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              9 AM
            </button>
            <button
              type="button"
              onClick={() => setSunTime('noon')}
              title="Noon Sun (1 PM Peak)"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: sunTime === 'noon' ? '#ffffff' : 'transparent',
                color: sunTime === 'noon' ? '#b45309' : '#92400e',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              1 PM (Noon)
            </button>
            <button
              type="button"
              onClick={() => setSunTime('evening')}
              title="Evening Sun (5 PM)"
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: sunTime === 'evening' ? '#ffffff' : 'transparent',
                color: sunTime === 'evening' ? '#b45309' : '#92400e',
                fontWeight: 700,
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              5 PM
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        style={{
          width: '100%',
          height: '440px',
          cursor: isDraggingRef.current ? 'grabbing' : 'grab',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Floating 3D Interaction Hint */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(6px)',
            borderRadius: '10px',
            padding: '6px 12px',
            fontSize: '0.72rem',
            color: '#475569',
            fontWeight: 600,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <Eye size={13} color="#16a34a" />
          <span>{isGu ? 'ફેરવવા માટે ડ્રેગ કરો • ઝૂમ માટે સ્ક્રોલ' : 'Click & drag to orbit 3D • Scroll to zoom'}</span>
        </div>

        {/* Botanical Species Metric Overlay Card */}
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '16px',
            zIndex: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.94)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            maxWidth: '300px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 800, textTransform: 'uppercase' }}>
              BOTANICAL 3D SPECIFICATION
            </span>
          </div>

          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1b4332' }}>
            {isGu ? selectedTree?.commonNameGu || selectedTree?.commonName : selectedTree?.commonName}
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic', marginBottom: '8px' }}>
            {selectedTree?.scientificName}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.74rem' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '8px' }}>
              <span style={{ color: '#166534', display: 'block', fontSize: '0.66rem' }}>Shade Radius</span>
              <strong style={{ color: '#15803d', fontSize: '0.92rem' }}>
                {selectedTree?.shadeRadiusMeters || 10} meters
              </strong>
            </div>

            <div style={{ backgroundColor: '#f0fdf4', padding: '6px 8px', borderRadius: '8px' }}>
              <span style={{ color: '#166534', display: 'block', fontSize: '0.66rem' }}>Leaf Area (LAI)</span>
              <strong style={{ color: '#15803d', fontSize: '0.92rem' }}>
                {selectedTree?.leafAreaIndex || 3.8} m²/m²
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeCanopy3D;
