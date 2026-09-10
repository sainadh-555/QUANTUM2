import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
  Box,
  RotateCcw,
  Maximize2,
  Sliders,
  Compass,
  Info,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Learning3D({ onNavigateBack }) {
  const mountRef = useRef(null);

  // Selected 3D Object
  const [selectedObject, setSelectedObject] = useState('black_sphere'); // 'black_sphere' | 'cube' | 'cylinder'

  // Coordinates for the Black Sphere
  const [coords, setCoords] = useState({ x: 0, y: 1.5, z: 0 });
  const [autoRotate, setAutoRotate] = useState(false);

  // References to Three.js objects
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const activeMeshRef = useRef(null);
  const projLinesRef = useRef(null);
  const cameraRef = useRef(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060918);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(6, 5, 8);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(8, 12, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.2);
    dirLight2.position.set(-6, -4, -4);
    scene.add(dirLight2);

    // 5. Grid & Coordinate Axes
    const gridHelper = new THREE.GridHelper(12, 24, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    // Red = X, Green = Y, Blue = Z
    scene.add(axesHelper);

    // Projection Lines Group
    const projGroup = new THREE.Group();
    scene.add(projGroup);
    projLinesRef.current = projGroup;

    // 6. Interactive Mouse Orbit Controls
    let isDragging = false;
    let previousMouse = { x: 0, y: 0 };
    let spherical = { radius: 11, theta: Math.PI / 4, phi: Math.PI / 3 };

    const updateCameraPos = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 1, 0);
    };
    updateCameraPos();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouse.x;
      const deltaY = e.clientY - previousMouse.y;
      previousMouse = { x: e.clientX, y: e.clientY };

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));
      updateCameraPos();
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(4, Math.min(22, spherical.radius + e.deltaY * 0.01));
      updateCameraPos();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domEl.addEventListener('wheel', onWheel, { passive: false });

    // 7. Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate) {
        spherical.theta += 0.005;
        updateCameraPos();
      }

      if (activeMeshRef.current && selectedObject === 'cube') {
        activeMeshRef.current.rotation.x += 0.008;
        activeMeshRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domEl.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domEl.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [autoRotate, selectedObject]);

  // Update 3D Object Mesh based on selected type and coordinates
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove previous mesh
    if (activeMeshRef.current) {
      scene.remove(activeMeshRef.current);
      activeMeshRef.current.geometry.dispose();
      activeMeshRef.current = null;
    }

    let geometry;
    let material;

    if (selectedObject === 'black_sphere') {
      // Sleek Black Sphere as requested in spec
      geometry = new THREE.SphereGeometry(1.0, 48, 48);
      material = new THREE.MeshStandardMaterial({
        color: 0x111318,
        roughness: 0.15,
        metalness: 0.9,
        emissive: 0x07111e
      });
    } else if (selectedObject === 'cube') {
      geometry = new THREE.BoxGeometry(1.6, 1.6, 1.6);
      material = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.3,
        metalness: 0.7,
        wireframe: false
      });
    } else {
      // Cylinder
      geometry = new THREE.CylinderGeometry(0.8, 0.8, 2.0, 32);
      material = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        roughness: 0.3,
        metalness: 0.8
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(coords.x, coords.y, coords.z);
    scene.add(mesh);
    activeMeshRef.current = mesh;

    // Update Projection Lines from Object to Ground Plane
    if (projLinesRef.current) {
      const group = projLinesRef.current;
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }

      // Vertical line to ground
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(coords.x, coords.y, coords.z),
        new THREE.Vector3(coords.x, 0, coords.z)
      ]);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0x38bdf8,
        dashSize: 0.2,
        gapSize: 0.1
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      group.add(line);

      // Ground projection disc
      const discGeo = new THREE.RingGeometry(0.05, 0.4, 24);
      const discMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = Math.PI / 2;
      disc.position.set(coords.x, 0.01, coords.z);
      group.add(disc);
    }
  }, [selectedObject, coords]);

  // Handle Coordinate input changes
  const handleCoordChange = (axis, value) => {
    const num = Number(value);
    setCoords(prev => ({
      ...prev,
      [axis]: isNaN(num) ? 0 : num
    }));
  };

  const handleResetCoords = () => {
    setCoords({ x: 0, y: 1.5, z: 0 });
  };

  // Euclidean distance from origin R = sqrt(x^2 + y^2 + z^2)
  const distanceFromOrigin = Math.sqrt(coords.x ** 2 + coords.y ** 2 + coords.z ** 2).toFixed(2);

  return (
    <div className="flex-1 w-full h-[calc(100vh-64px)] bg-[#040612] text-gray-100 flex flex-col lg:flex-row overflow-hidden select-none">
      
      {/* 3D WebGL Viewport (Center/Left) */}
      <div className="flex-1 relative h-[55vh] lg:h-full bg-[#060918] overflow-hidden">
        
        {/* Three.js Canvas Container */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Viewport Overlay Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-1.5 rounded-xl bg-[#090d24]/90 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono text-cyan-300">
            <Compass className="w-4 h-4 text-cyan-400" />
            <span>3D Coordinate Lab</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
              autoRotate ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-400 hover:text-white'
            }`}
          >
            {autoRotate ? 'Rotating' : 'Orbit'}
          </button>
        </div>

        {/* Axis Color Key Banner */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#090d24]/90 border border-white/10 text-[11px] font-mono backdrop-blur-md">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-rose-400 font-bold">X Axis</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-400 font-bold">Y Axis (Up)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-blue-400 font-bold">Z Axis</span>
          </div>
        </div>

        {/* Mouse Interaction Hint */}
        <div className="absolute bottom-4 right-4 z-10 hidden sm:block text-[10px] font-mono text-gray-500 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
          Left Drag: Rotate • Scroll: Zoom
        </div>

      </div>

      {/* Side Panel: Object Information & Coordinate Controls (Right) */}
      <aside className="w-full lg:w-96 h-[45vh] lg:h-full bg-[#070b1f] border-t lg:border-t-0 lg:border-l border-white/10 p-5 flex flex-col justify-between overflow-y-auto">
        
        <div className="space-y-5">
          
          {/* Section Header */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white font-['Space_Grotesk'] uppercase tracking-wider flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-400" />
                3D Object Controls
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Interactive
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Select a 3D geometry and manipulate its spatial coordinates in real time.
            </p>
          </div>

          {/* Object Selector (Black Sphere, Cube, Cylinder) */}
          <div>
            <label className="block text-[11px] font-mono text-gray-400 mb-2">
              Select 3D Geometry
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'black_sphere', label: 'Black Sphere' },
                { id: 'cube', label: 'Cube' },
                { id: 'cylinder', label: 'Cylinder' }
              ].map(obj => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObject(obj.id)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold font-sans border transition-all ${
                    selectedObject === obj.id
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm shadow-cyan-500/20'
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-gray-200'
                  }`}
                >
                  {obj.label}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC TELEMETRY DISPLAY (X, Y, Z coordinates display required by spec) */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-cyan-500/20 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono border-b border-white/5 pb-2">
              <span className="text-gray-400">Current Position:</span>
              <span className="text-cyan-300 font-bold">
                ({coords.x.toFixed(1)}, {coords.y.toFixed(1)}, {coords.z.toFixed(1)})
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
              <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                <span className="text-gray-400 block text-[10px]">X Position</span>
                <span className="text-rose-400 font-bold">{coords.x.toFixed(2)}</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-gray-400 block text-[10px]">Y Position</span>
                <span className="text-emerald-400 font-bold">{coords.y.toFixed(2)}</span>
              </div>
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <span className="text-gray-400 block text-[10px]">Z Position</span>
                <span className="text-blue-400 font-bold">{coords.z.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 pt-1">
              <span>Euclidean Distance $R$:</span>
              <span className="text-amber-400 font-bold">{distanceFromOrigin} units</span>
            </div>
          </div>

          {/* COORDINATE SLIDERS & NUMERIC INPUTS */}
          <div className="space-y-3.5">
            
            {/* X Coordinate Slider & Input */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-rose-400 font-bold">X Coordinate:</span>
                <input
                  type="number"
                  step="0.1"
                  min="-5"
                  max="5"
                  value={coords.x}
                  onChange={(e) => handleCoordChange('x', e.target.value)}
                  className="w-16 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-right text-xs text-rose-300 font-mono focus:outline-none focus:border-rose-400"
                />
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={coords.x}
                onChange={(e) => handleCoordChange('x', e.target.value)}
                className="w-full accent-rose-400"
              />
            </div>

            {/* Y Coordinate Slider & Input */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-emerald-400 font-bold">Y Coordinate:</span>
                <input
                  type="number"
                  step="0.1"
                  min="-2"
                  max="6"
                  value={coords.y}
                  onChange={(e) => handleCoordChange('y', e.target.value)}
                  className="w-16 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-right text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
              <input
                type="range"
                min="-2"
                max="6"
                step="0.1"
                value={coords.y}
                onChange={(e) => handleCoordChange('y', e.target.value)}
                className="w-full accent-emerald-400"
              />
            </div>

            {/* Z Coordinate Slider & Input */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-blue-400 font-bold">Z Coordinate:</span>
                <input
                  type="number"
                  step="0.1"
                  min="-5"
                  max="5"
                  value={coords.z}
                  onChange={(e) => handleCoordChange('z', e.target.value)}
                  className="w-16 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-right text-xs text-blue-300 font-mono focus:outline-none focus:border-blue-400"
                />
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={coords.z}
                onChange={(e) => handleCoordChange('z', e.target.value)}
                className="w-full accent-blue-400"
              />
            </div>

          </div>

          {/* Quick Coordinate Presets */}
          <div className="flex gap-2">
            <button
              onClick={() => setCoords({ x: 0, y: 1.5, z: 0 })}
              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-mono border border-white/10"
            >
              Origin (0, 1.5, 0)
            </button>
            <button
              onClick={() => setCoords({ x: 2.5, y: 3.0, z: -1.5 })}
              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-mono border border-white/10"
            >
              Point (2.5, 3, -1.5)
            </button>
            <button
              onClick={handleResetCoords}
              title="Reset"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Bottom Pedagogical Note */}
        <div className="pt-4 border-t border-white/10">
          <div className="flex items-start gap-2 text-[11px] text-gray-400 leading-relaxed font-sans">
            <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <span>
              The dashed line shows the normal projection to the ground plane ($Y=0$), demonstrating Euclidean orthogonal decomposition in 3D Euclidean space.
            </span>
          </div>
        </div>

      </aside>

    </div>
  );
}
