import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, RotateCw, AlertTriangle, Sparkles, Info } from 'lucide-react';

export default function BlochSphere({ blochStates = [], qubits = 2 }) {
  const mountRef = useRef(null);
  const [selectedQubit, setSelectedQubit] = useState(0);
  const [resetRotationKey, setResetRotationKey] = useState(0);

  // Fallback state if simulation hasn't run yet or qubit not found
  const activeState = blochStates.find(s => s.qubit === selectedQubit) || {
    qubit: selectedQubit,
    x: 0,
    y: 0,
    z: 1,
    r: 1,
    theta: 0,
    phi: 0,
    label: `q${selectedQubit} (|0⟩ Ground State)`
  };

  const isEntangled = (activeState.r !== undefined && activeState.r < 0.15) ||
    (Math.abs(activeState.x || 0) < 0.05 && Math.abs(activeState.y || 0) < 0.05 && Math.abs(activeState.z || 0) < 0.05);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || 400;
    let height = container.clientHeight || 300;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(2.4, 1.8, 2.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const cyanLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
    cyanLight.position.set(4, 6, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.DirectionalLight(0xa855f7, 0.8);
    purpleLight.position.set(-4, -4, -5);
    scene.add(purpleLight);

    // Root rotation group for interactive dragging
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Outer Wireframe Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    sphereGroup.add(sphere);

    // Semi-transparent inner sphere surface for depth
    const innerSurfaceGeo = new THREE.SphereGeometry(0.99, 32, 32);
    const innerSurfaceMat = new THREE.MeshPhongMaterial({
      color: 0x07112c,
      transparent: true,
      opacity: 0.45,
      shininess: 40
    });
    const innerSurface = new THREE.Mesh(innerSurfaceGeo, innerSurfaceMat);
    sphereGroup.add(innerSurface);

    // Equator Circle (XY plane in quantum, XZ in Three.js)
    const equatorGeo = new THREE.RingGeometry(0.995, 1.005, 64);
    const equatorMat = new THREE.MeshBasicMaterial({
      color: 0x00f2fe,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    const equator = new THREE.Mesh(equatorGeo, equatorMat);
    equator.rotation.x = Math.PI / 2;
    sphereGroup.add(equator);

    // Prime Meridian Circle (XZ plane in quantum, XY in Three.js)
    const meridianGeo = new THREE.RingGeometry(0.995, 1.005, 64);
    const meridianMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.3
    });
    const meridian = new THREE.Mesh(meridianGeo, meridianMat);
    meridian.rotation.y = Math.PI / 2;
    sphereGroup.add(meridian);

    // Coordinate Axes Lines
    // Three.js: X is X (Red), Y is vertical Z (Blue), Z is depth Y (Green)
    const createAxis = (start, end, colorHex) => {
      const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: colorHex, transparent: true, opacity: 0.7 });
      return new THREE.Line(geometry, material);
    };

    sphereGroup.add(createAxis([-1.35, 0, 0], [1.35, 0, 0], 0xef4444)); // X-axis (Red)
    sphereGroup.add(createAxis([0, -1.35, 0], [0, 1.35, 0], 0x38bdf8)); // Z-axis (Vertical, Cyan/Blue)
    sphereGroup.add(createAxis([0, 0, -1.35], [0, 0, 1.35], 0x10b981)); // Y-axis (Green)

    // Pole Marker Points
    const createPoleMarker = (pos, color) => {
      const poleGeo = new THREE.SphereGeometry(0.035, 16, 16);
      const poleMat = new THREE.MeshBasicMaterial({ color });
      const poleMesh = new THREE.Mesh(poleGeo, poleMat);
      poleMesh.position.set(...pos);
      return poleMesh;
    };

    sphereGroup.add(createPoleMarker([0, 1, 0], 0x38bdf8)); // |0> North Pole
    sphereGroup.add(createPoleMarker([0, -1, 0], 0xec4899)); // |1> South Pole
    sphereGroup.add(createPoleMarker([1, 0, 0], 0xef4444)); // |+>
    sphereGroup.add(createPoleMarker([-1, 0, 0], 0xf97316)); // |->
    sphereGroup.add(createPoleMarker([0, 0, 1], 0x10b981)); // |+i>
    sphereGroup.add(createPoleMarker([0, 0, -1], 0xa855f7)); // |-i>

    // Quantum Vector Representation
    const rawX = activeState.x !== undefined ? activeState.x : Math.sin(activeState.theta || 0) * Math.cos(activeState.phi || 0);
    const rawY = activeState.y !== undefined ? activeState.y : Math.sin(activeState.theta || 0) * Math.sin(activeState.phi || 0);
    const rawZ = activeState.z !== undefined ? activeState.z : Math.cos(activeState.theta || 0);
    const rawR = activeState.r !== undefined ? activeState.r : Math.sqrt(rawX * rawX + rawY * rawY + rawZ * rawZ);

    let tipMesh = null;
    let entangledCore = null;

    if (rawR < 0.12) {
      // Entangled or Maximally Mixed State (r ≈ 0, collapsed to center)
      const coreGeo = new THREE.SphereGeometry(0.2, 24, 24);
      const coreMat = new THREE.MeshPhongMaterial({
        color: 0xec4899,
        wireframe: true,
        transparent: true,
        opacity: 0.85,
        emissive: 0xec4899,
        emissiveIntensity: 0.5
      });
      entangledCore = new THREE.Mesh(coreGeo, coreMat);
      sphereGroup.add(entangledCore);

      const centerDotGeo = new THREE.SphereGeometry(0.06, 16, 16);
      const centerDotMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
      sphereGroup.add(centerDot);
    } else {
      // Pure or Partially Polarized State Vector
      // Map Quantum (X, Y, Z) to Three.js (X, Z_vertical=Y, Y_depth=Z)
      const threeVec = new THREE.Vector3(rawX, rawZ, rawY);
      const normDir = threeVec.clone().normalize();
      const length = Math.min(1.0, Math.max(0.15, rawR));

      // Arrow
      const arrowHelper = new THREE.ArrowHelper(
        normDir,
        new THREE.Vector3(0, 0, 0),
        length,
        0x00f2fe,
        0.2,
        0.12
      );
      arrowHelper.line.material.linewidth = 3;
      sphereGroup.add(arrowHelper);

      // Glowing tip sphere at end of arrow
      const tipGeo = new THREE.SphereGeometry(0.055, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe });
      tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.copy(normDir.clone().multiplyScalar(length));
      sphereGroup.add(tipMesh);
    }

    // Interactive Mouse / Touch Dragging
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      sphereGroup.rotation.y += deltaX * 0.008;
      sphereGroup.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch Support
    const onTouchStart = (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;

      sphereGroup.rotation.y += deltaX * 0.008;
      sphereGroup.rotation.x += deltaY * 0.008;

      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize Observer for responsive resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDragging) {
        sphereGroup.rotation.y += 0.0025; // Gentle ambient rotation
      }

      if (entangledCore) {
        // Pulsing animation for entangled core
        const scale = 1.0 + 0.15 * Math.sin(elapsedTime * 3);
        entangledCore.scale.set(scale, scale, scale);
        entangledCore.rotation.y += 0.01;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeState, selectedQubit, resetRotationKey]);

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Qubit Selection & Spherical Coordinates Info */}
      <div className="flex items-center justify-between flex-wrap gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
        <div className="flex items-center space-x-3">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-gray-200">Select Qubit:</span>
          <select
            value={selectedQubit}
            onChange={(e) => setSelectedQubit(Number(e.target.value))}
            className="bg-[#0c1024] border border-cyan-500/40 text-cyan-300 text-xs rounded-lg px-3 py-1 font-mono font-bold focus:outline-none cursor-pointer"
          >
            {Array.from({ length: qubits }).map((_, idx) => (
              <option key={idx} value={idx}>
                q{idx} Bloch Vector
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono">
          <span className="text-gray-400">
            r = <strong className="text-white">{(activeState.r !== undefined ? activeState.r : 1.0).toFixed(2)}</strong>
          </span>
          <span className="text-gray-400">
            θ = <strong className="text-cyan-300">{(activeState.theta || 0).toFixed(2)} rad</strong>
          </span>
          <span className="text-gray-400">
            φ = <strong className="text-purple-300">{(activeState.phi || 0).toFixed(2)} rad</strong>
          </span>
          <button
            onClick={() => setResetRotationKey(k => k + 1)}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 text-[11px] transition-colors"
            title="Reset 3D camera rotation"
          >
            <RotateCw className="w-3 h-3" />
            <span>Reset View</span>
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div className="relative w-full h-80 bg-[#060814]/90 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing select-none">
        
        {/* Pole Markers Overlay */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-[11px] border border-cyan-500/40 shadow-sm backdrop-blur-sm pointer-events-none">
          |0⟩ North Pole (+Z)
        </div>
        
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-pink-500/20 text-pink-300 font-mono font-bold text-[11px] border border-pink-500/40 shadow-sm backdrop-blur-sm pointer-events-none">
          |1⟩ South Pole (-Z)
        </div>

        <div className="absolute top-1/2 left-4 -translate-y-1/2 px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-mono text-[10px] border border-red-500/30 pointer-events-none">
          |+⟩ (+X)
        </div>

        <div className="absolute top-1/2 right-4 -translate-y-1/2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/30 pointer-events-none">
          |+i⟩ (+Y)
        </div>

        {/* 3D Canvas Mount */}
        <div ref={mountRef} className="w-full h-full"></div>

        {/* Interactive Helper Hint */}
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-gray-500 bg-black/40 px-2 py-0.5 rounded pointer-events-none backdrop-blur-xs">
          Drag to rotate 3D
        </div>
      </div>

      {/* State Diagnostics & Entanglement Explanation Card */}
      {isEntangled ? (
        <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-200 text-xs flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-pink-300 flex items-center gap-2 font-mono">
              <span>Entangled / Mixed State (Purity r = {((activeState.r || 0)).toFixed(2)} &lt; 1.0)</span>
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Qubit <strong className="text-pink-300">q{selectedQubit}</strong> is entangled with other qubits in the circuit. In quantum mechanics, an entangled qubit does not possess an individual pure state vector ($|\psi\rangle$); its reduced density matrix is mixed ($\rho = \frac{1}{2} I$), collapsing the Bloch vector to the sphere center ($r \approx 0$).
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs flex items-start space-x-3">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-cyan-300 font-mono">
              Pure State Vector: {activeState.label}
            </div>
            <p className="text-gray-300 text-[11px] leading-relaxed">
              Bloch coordinates: <span className="font-mono text-cyan-300">X = {activeState.x?.toFixed(2)}, Y = {activeState.y?.toFixed(2)}, Z = {activeState.z?.toFixed(2)}</span> with polar angle $\theta = {activeState.theta?.toFixed(2)}$ and azimuthal phase $\phi = {activeState.phi?.toFixed(2)}$ rad.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
