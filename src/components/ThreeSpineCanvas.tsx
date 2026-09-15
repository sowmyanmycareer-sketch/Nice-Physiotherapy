import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { ANATOMICAL_HOTSPOTS } from "../data/clinicData";
import { AnatomicalHotspot } from "../types";
import { 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Activity, 
  Sparkles, 
  Eye, 
  Layers, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";

interface ThreeSpineCanvasProps {
  onSelectHotspot?: (hotspot: AnatomicalHotspot) => void;
  selectedHotspotId?: string;
  onOpenAiTriageWithArea?: (areaName: string) => void;
}

export const ThreeSpineCanvas: React.FC<ThreeSpineCanvasProps> = ({
  onSelectHotspot,
  selectedHotspotId,
  onOpenAiTriageWithArea,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const discsRef = useRef<THREE.Mesh[]>([]);
  const l5DiscRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Interaction State
  const [activeMode, setActiveMode] = useState<"spine" | "full" | "traction">("spine");
  const [viewStyle, setViewStyle] = useState<"medical" | "hologram" | "wireframe">("hologram");
  const [isTractionActive, setIsTractionActive] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<AnatomicalHotspot>(
    ANATOMICAL_HOTSPOTS.find((h) => h.id === "l5-spine") || ANATOMICAL_HOTSPOTS[2]
  );
  const [cameraView, setCameraView] = useState<"posterior" | "lateral" | "l5-zoom" | "anterior">("posterior");

  // Mouse & Touch Orbit State
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // Sync prop changes
  useEffect(() => {
    if (selectedHotspotId) {
      const match = ANATOMICAL_HOTSPOTS.find((h) => h.id === selectedHotspotId);
      if (match) setActiveHotspot(match);
    }
  }, [selectedHotspotId]);

  // Handle building the 3D scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.5);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xdcfce7, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x14b8a6, 1.2);
    dirLight2.position.set(-5, -3, 3);
    scene.add(dirLight2);

    const backLight = new THREE.PointLight(0x38bdf8, 2, 10);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    // MODEL GROUP
    const rootGroup = new THREE.Group();
    modelGroupRef.current = rootGroup;
    scene.add(rootGroup);

    // BUILD 3D SPINE & ANATOMICAL KINEMATICS
    const buildSpine = () => {
      // Clear prior
      while (rootGroup.children.length > 0) {
        rootGroup.remove(rootGroup.children[0]);
      }
      discsRef.current = [];
      l5DiscRef.current = null;

      // Color scheme based on viewStyle
      let boneColor = 0xe2e8f0;
      let discColor = 0x38bdf8;
      let l5Color = 0xf43f5e; // Highlighted pathology (Sirisha T case)
      let nerveColor = 0xfacc15;
      let isWire = viewStyle === "wireframe";

      if (viewStyle === "hologram") {
        boneColor = 0x0ea5e9;
        discColor = 0x2dd4bf;
        l5Color = 0xf43f5e;
      } else if (viewStyle === "medical") {
        boneColor = 0xf8fafc;
        discColor = 0x7dd3fc;
        l5Color = 0xef4444;
      }

      const boneMaterial = new THREE.MeshStandardMaterial({
        color: boneColor,
        roughness: 0.35,
        metalness: viewStyle === "hologram" ? 0.3 : 0.1,
        wireframe: isWire,
        transparent: true,
        opacity: viewStyle === "hologram" ? 0.88 : 1.0,
      });

      const discMaterial = new THREE.MeshStandardMaterial({
        color: discColor,
        roughness: 0.2,
        metalness: 0.1,
        wireframe: isWire,
        transparent: true,
        opacity: 0.9,
      });

      const l5DiscMaterial = new THREE.MeshStandardMaterial({
        color: l5Color,
        roughness: 0.2,
        emissive: 0xef4444,
        emissiveIntensity: 0.45,
        wireframe: isWire,
      });

      const nerveMaterial = new THREE.MeshBasicMaterial({
        color: nerveColor,
        wireframe: isWire,
      });

      // 1. Cervical Section (C1 to C7)
      const cervicalGroup = new THREE.Group();
      cervicalGroup.name = "cervical";
      for (let i = 0; i < 7; i++) {
        const y = 2.4 - i * 0.14;
        const radius = 0.22 - i * 0.005;
        // Vertebral body
        const vertGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 0.09, 20);
        const vertMesh = new THREE.Mesh(vertGeo, boneMaterial);
        vertMesh.position.set(0, y, 0);
        cervicalGroup.add(vertMesh);

        // Spinous process (posterior spine protrusion)
        const spinousGeo = new THREE.ConeGeometry(0.08, 0.28, 6);
        const spinousMesh = new THREE.Mesh(spinousGeo, boneMaterial);
        spinousMesh.rotation.x = Math.PI / 2 + 0.3;
        spinousMesh.position.set(0, y, -0.22);
        cervicalGroup.add(spinousMesh);

        // Disc between vertebrae
        if (i < 6) {
          const discGeo = new THREE.CylinderGeometry(radius * 0.92, radius * 0.92, 0.045, 18);
          const discMesh = new THREE.Mesh(discGeo, discMaterial);
          discMesh.position.set(0, y - 0.065, 0);
          cervicalGroup.add(discMesh);
          discsRef.current.push(discMesh);
        }
      }
      rootGroup.add(cervicalGroup);

      // 2. Thoracic Section (T1 to T12)
      const thoracicGroup = new THREE.Group();
      thoracicGroup.name = "thoracic";
      for (let i = 0; i < 12; i++) {
        const y = 1.35 - i * 0.15;
        const radius = 0.26 + i * 0.012;
        // Kyphotic curvature offset along Z
        const zCurve = Math.sin((i / 11) * Math.PI) * -0.15;

        const vertGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 0.1, 20);
        const vertMesh = new THREE.Mesh(vertGeo, boneMaterial);
        vertMesh.position.set(0, y, zCurve);
        thoracicGroup.add(vertMesh);

        // Spinous process
        const spinousGeo = new THREE.ConeGeometry(0.1, 0.34, 6);
        const spinousMesh = new THREE.Mesh(spinousGeo, boneMaterial);
        spinousMesh.rotation.x = Math.PI / 2 + 0.45;
        spinousMesh.position.set(0, y, zCurve - 0.28);
        thoracicGroup.add(spinousMesh);

        // Transverse processes (left & right)
        const transGeo = new THREE.BoxGeometry(0.55 + i * 0.02, 0.05, 0.08);
        const transMesh = new THREE.Mesh(transGeo, boneMaterial);
        transMesh.position.set(0, y, zCurve - 0.05);
        thoracicGroup.add(transMesh);

        // Disc
        if (i < 11) {
          const discGeo = new THREE.CylinderGeometry(radius * 0.94, radius * 0.94, 0.048, 18);
          const discMesh = new THREE.Mesh(discGeo, discMaterial);
          discMesh.position.set(0, y - 0.075, zCurve);
          thoracicGroup.add(discMesh);
          discsRef.current.push(discMesh);
        }
      }
      rootGroup.add(thoracicGroup);

      // 3. Lumbar Section (L1 to L5) - Lordotic curvature
      const lumbarGroup = new THREE.Group();
      lumbarGroup.name = "lumbar";
      for (let i = 0; i < 5; i++) {
        const y = -0.45 - i * 0.17;
        const radius = 0.4 + i * 0.025;
        // Lordosis curve forwards (+Z)
        const zCurve = Math.sin((i / 4) * Math.PI) * 0.12;

        const vertGeo = new THREE.CylinderGeometry(radius, radius * 1.05, 0.12, 22);
        const vertMesh = new THREE.Mesh(vertGeo, boneMaterial);
        vertMesh.position.set(0, y, zCurve);
        lumbarGroup.add(vertMesh);

        // Massive lumbar spinous process
        const spinousGeo = new THREE.BoxGeometry(0.12, 0.14, 0.38);
        const spinousMesh = new THREE.Mesh(spinousGeo, boneMaterial);
        spinousMesh.position.set(0, y, zCurve - 0.32);
        lumbarGroup.add(spinousMesh);

        // Lumbar transverse processes
        const transGeo = new THREE.BoxGeometry(0.78, 0.07, 0.1);
        const transMesh = new THREE.Mesh(transGeo, boneMaterial);
        transMesh.position.set(0, y, zCurve);
        lumbarGroup.add(transMesh);

        // Lumbar Disc
        const isL5Disc = i === 4; // L5-S1 disc!
        const discGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, 0.065, 20);
        const discMesh = new THREE.Mesh(discGeo, isL5Disc ? l5DiscMaterial : discMaterial);
        discMesh.position.set(0, y - 0.09, zCurve);
        lumbarGroup.add(discMesh);
        discsRef.current.push(discMesh);

        if (isL5Disc) {
          l5DiscRef.current = discMesh;

          // Add glowing herniation ring indicator
          const herniaRingGeo = new THREE.TorusGeometry(radius * 0.98, 0.04, 12, 24);
          const herniaRingMat = new THREE.MeshBasicMaterial({ color: 0xff1744 });
          const herniaRing = new THREE.Mesh(herniaRingGeo, herniaRingMat);
          herniaRing.rotation.x = Math.PI / 2;
          herniaRing.position.set(0, y - 0.09, zCurve);
          lumbarGroup.add(herniaRing);

          // L5 Nerve Roots exiting laterally
          const nerveGeoL = new THREE.CylinderGeometry(0.02, 0.015, 0.5, 8);
          const nerveMeshL = new THREE.Mesh(nerveGeoL, nerveMaterial);
          nerveMeshL.rotation.z = Math.PI / 3;
          nerveMeshL.position.set(-0.35, y - 0.12, zCurve);
          lumbarGroup.add(nerveMeshL);

          const nerveGeoR = new THREE.CylinderGeometry(0.02, 0.015, 0.5, 8);
          const nerveMeshR = new THREE.Mesh(nerveGeoR, nerveMaterial);
          nerveMeshR.rotation.z = -Math.PI / 3;
          nerveMeshR.position.set(0.35, y - 0.12, zCurve);
          lumbarGroup.add(nerveMeshR);
        }
      }
      rootGroup.add(lumbarGroup);

      // 4. Sacrum and Coccyx triangular base
      const sacrumGeo = new THREE.ConeGeometry(0.55, 0.8, 8);
      const sacrumMesh = new THREE.Mesh(sacrumGeo, boneMaterial);
      sacrumMesh.rotation.x = Math.PI; // pointing down
      sacrumMesh.position.set(0, -1.65, 0.05);
      rootGroup.add(sacrumMesh);

      // 5. Full Body Kinetic Context (Pelvis, Ribs, Shoulders if in 'full' or 'traction' mode)
      if (activeMode === "full" || activeMode === "traction") {
        // Iliac Pelvic Wings
        const wingLGeo = new THREE.TorusGeometry(0.48, 0.12, 10, 20, Math.PI * 0.9);
        const wingL = new THREE.Mesh(wingLGeo, boneMaterial);
        wingL.rotation.y = Math.PI / 4;
        wingL.rotation.z = -Math.PI / 6;
        wingL.position.set(-0.55, -1.4, 0.1);
        rootGroup.add(wingL);

        const wingRGeo = new THREE.TorusGeometry(0.48, 0.12, 10, 20, Math.PI * 0.9);
        const wingR = new THREE.Mesh(wingRGeo, boneMaterial);
        wingR.rotation.y = -Math.PI / 4;
        wingR.rotation.z = Math.PI / 6;
        wingR.position.set(0.55, -1.4, 0.1);
        rootGroup.add(wingR);

        // Clavicle & Shoulder Girdle
        const clavicleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 12);
        const clavicle = new THREE.Mesh(clavicleGeo, boneMaterial);
        clavicle.rotation.z = Math.PI / 2;
        clavicle.position.set(0, 1.8, 0.15);
        rootGroup.add(clavicle);

        // Shoulder joint spheres
        const shoulderLGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const shoulderL = new THREE.Mesh(shoulderLGeo, boneMaterial);
        shoulderL.position.set(-0.85, 1.75, 0.05);
        rootGroup.add(shoulderL);

        const shoulderRGeo = new THREE.SphereGeometry(0.16, 16, 16);
        const shoulderR = new THREE.Mesh(shoulderRGeo, boneMaterial);
        shoulderR.position.set(0.85, 1.75, 0.05);
        rootGroup.add(shoulderR);

        // Rib Cage contours
        for (let r = 0; r < 5; r++) {
          const ribY = 1.3 - r * 0.22;
          const ribScale = 0.75 + Math.sin((r / 4) * Math.PI) * 0.35;
          const ribGeo = new THREE.TorusGeometry(ribScale, 0.035, 8, 24, Math.PI * 1.3);
          const ribMesh = new THREE.Mesh(ribGeo, boneMaterial);
          ribMesh.rotation.x = Math.PI / 2 + 0.15;
          ribMesh.rotation.z = -Math.PI * 0.15;
          ribMesh.position.set(0, ribY, 0.05);
          rootGroup.add(ribMesh);
        }
      }

      // Add ambient healing particle cloud
      const particleCount = 180;
      const particleGeo = new THREE.BufferGeometry();
      const posArray = new Float32Array(particleCount * 3);
      for (let p = 0; p < particleCount * 3; p += 3) {
        posArray[p] = (Math.random() - 0.5) * 3.5;
        posArray[p + 1] = (Math.random() - 0.5) * 5.0;
        posArray[p + 2] = (Math.random() - 0.5) * 3.0;
      }
      particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
      const particleMat = new THREE.PointsMaterial({
        size: 0.045,
        color: 0x2dd4bf,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(particleGeo, particleMat);
      particlesRef.current = particles;
      rootGroup.add(particles);
    };

    buildSpine();

    // ANIMATION LOOP
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Slow gentle auto-rotation when user is not dragging
      if (!isDragging.current && rootGroup) {
        rootGroup.rotation.y += 0.0035;
      }

      // Decompression traction dynamic wave animation
      if (isTractionActive && discsRef.current.length > 0) {
        discsRef.current.forEach((disc, idx) => {
          const wave = Math.sin(elapsedTime * 2.5 + idx * 0.25) * 0.08 + 1.0;
          disc.scale.set(wave, 1.0, wave);
        });

        // Highlighted pulse on L5-S1
        if (l5DiscRef.current) {
          const l5Pulse = Math.sin(elapsedTime * 4) * 0.2 + 1.0;
          l5DiscRef.current.scale.set(l5Pulse * 1.15, l5Pulse, l5Pulse * 1.15);
        }
      }

      // Particle floating drift
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.05;
        particlesRef.current.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [activeMode, viewStyle, isTractionActive]);

  // Handle Preset Camera Angles
  const setCameraPreset = useCallback(
    (preset: "posterior" | "lateral" | "l5-zoom" | "anterior") => {
      setCameraView(preset);
      if (!modelGroupRef.current || !cameraRef.current) return;

      const group = modelGroupRef.current;
      const camera = cameraRef.current;

      if (preset === "posterior") {
        group.rotation.set(0, 0, 0);
        camera.position.set(0, 0.4, 5.5);
      } else if (preset === "anterior") {
        group.rotation.set(0, Math.PI, 0);
        camera.position.set(0, 0.4, 5.5);
      } else if (preset === "lateral") {
        group.rotation.set(0, Math.PI / 2, 0);
        camera.position.set(0, 0.4, 5.5);
      } else if (preset === "l5-zoom") {
        group.rotation.set(-0.1, 0.2, 0);
        camera.position.set(0, -1.0, 2.8); // Macro focus on L4-L5-S1
      }
    },
    []
  );

  // Mouse Orbit Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !modelGroupRef.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Touch Handlers for Mobile responsiveness
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      previousMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2 && cameraRef.current) {
      // Pinch to zoom
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchDistanceRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging.current && modelGroupRef.current) {
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      modelGroupRef.current.rotation.y += deltaX * 0.01;
      modelGroupRef.current.rotation.x += deltaY * 0.01;

      previousMousePosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    } else if (e.touches.length === 2 && touchDistanceRef.current && cameraRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const diff = newDist - touchDistanceRef.current;

      cameraRef.current.position.z = Math.max(
        2.2,
        Math.min(7.5, cameraRef.current.position.z - diff * 0.01)
      );
      touchDistanceRef.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    touchDistanceRef.current = null;
  };

  // Zoom controls
  const handleZoom = (direction: "in" | "out") => {
    if (!cameraRef.current) return;
    const factor = direction === "in" ? -0.6 : 0.6;
    cameraRef.current.position.z = Math.max(
      2.0,
      Math.min(7.5, cameraRef.current.position.z + factor)
    );
  };

  const resetRotation = () => {
    if (!modelGroupRef.current || !cameraRef.current) return;
    modelGroupRef.current.rotation.set(0, 0, 0);
    cameraRef.current.position.set(0, 0.4, 5.5);
    setCameraView("posterior");
  };

  const handleHotspotClick = (spot: AnatomicalHotspot) => {
    setActiveHotspot(spot);
    if (onSelectHotspot) onSelectHotspot(spot);

    if (spot.id === "l5-spine") {
      setCameraPreset("l5-zoom");
    } else if (spot.id === "cervical") {
      if (modelGroupRef.current && cameraRef.current) {
        cameraRef.current.position.set(0, 1.8, 3.2);
      }
    } else {
      setCameraPreset("posterior");
    }
  };

  return (
    <div className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl flex flex-col">
      {/* Top Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Anatomical Status Badge */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs text-teal-300 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
          <span className="font-medium tracking-wide">3D Spine & Biomechanics Simulator</span>
        </div>

        {/* View Mode & Preset Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-slate-700/60 shadow-lg">
          <button
            onClick={() => setViewStyle(viewStyle === "hologram" ? "medical" : viewStyle === "medical" ? "wireframe" : "hologram")}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Toggle Visual Shading"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span className="capitalize">{viewStyle}</span>
          </button>

          <button
            onClick={() => setIsTractionActive(!isTractionActive)}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-xl transition ${
              isTractionActive
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                : "text-slate-400 hover:text-white"
            }`}
            title="Toggle Spinal Decompression Traction Simulation"
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>Traction {isTractionActive ? "ON" : "OFF"}</span>
          </button>

          <div className="h-4 w-px bg-slate-700 mx-0.5" />

          {/* Preset Camera Angles */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setCameraPreset("posterior")}
              className={`px-2 py-1 text-xs rounded-lg transition ${
                cameraView === "posterior" ? "bg-teal-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              Posterior
            </button>
            <button
              onClick={() => setCameraPreset("lateral")}
              className={`px-2 py-1 text-xs rounded-lg transition ${
                cameraView === "lateral" ? "bg-teal-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              Lateral
            </button>
            <button
              onClick={() => setCameraPreset("l5-zoom")}
              className={`px-2 py-1 text-xs rounded-lg transition ${
                cameraView === "l5-zoom" ? "bg-rose-500 text-white font-semibold shadow-sm" : "text-rose-400 hover:text-rose-300"
              }`}
              title="Focus on L4-L5 Lumbar Disc (Sirisha T Review)"
            >
              L5 Disc Focus
            </button>
          </div>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Floating Camera Utilities (Zoom, Reset, Orbit Guide) */}
      <div className="absolute right-4 bottom-24 md:bottom-28 z-20 flex flex-col gap-2">
        <button
          onClick={() => handleZoom("in")}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 shadow-lg backdrop-blur-md transition active:scale-95"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4 text-teal-400" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 shadow-lg backdrop-blur-md transition active:scale-95"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4 text-teal-400" />
        </button>
        <button
          onClick={resetRotation}
          className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 shadow-lg backdrop-blur-md transition active:scale-95"
          title="Reset View"
        >
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* 3D Hotspots Selector Pill Ribbon */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-800 p-3 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Select Anatomy to Inspect:
              </span>
              {activeHotspot.id === "l5-spine" && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30">
                  Highlighted in Google Reviews
                </span>
              )}
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline-flex items-center gap-1">
              <Rotate3d className="w-3.5 h-3.5 text-teal-400" /> Drag to rotate · Pinch to zoom
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ANATOMICAL_HOTSPOTS.map((spot) => {
              const isSelected = activeHotspot.id === spot.id;
              const isL5 = spot.id === "l5-spine";
              return (
                <button
                  key={spot.id}
                  onClick={() => handleHotspotClick(spot)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? isL5
                        ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 ring-1 ring-rose-400"
                        : "bg-teal-500 text-slate-950 font-semibold shadow-md shadow-teal-500/20"
                      : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50"
                  }`}
                >
                  {isL5 && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  {spot.name}
                </button>
              );
            })}
          </div>

          {/* Active Hotspot Clinical Detail Card */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-teal-400 text-sm">{activeHotspot.name}</span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-300">{activeHotspot.commonIssues}</span>
              </div>
              <p className="text-slate-400 text-[11px] line-clamp-1">{activeHotspot.description}</p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenAiTriageWithArea && onOpenAiTriageWithArea(activeHotspot.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold hover:brightness-110 shadow-sm transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-900" />
                <span>AI Clinical Assessment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
