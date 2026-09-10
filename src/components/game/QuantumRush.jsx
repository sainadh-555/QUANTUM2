import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Heart,
  Zap,
  Flame,
  Globe,
  HelpCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Compass,
  FlaskConical,
  Award,
  ChevronRight
} from 'lucide-react';
import ChallengeModal from './ChallengeModal';
import GameOverModal from './GameOverModal';
import WorldSelectModal, { WORLDS } from './WorldSelectModal';
import { ProgressService } from '../../services/ProgressService';
import { QuestionService } from '../../services/QuestionService';

// Audio Synthesizer using Web Audio API (zero external assets needed)
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  playCollect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch (e) {}
  }

  playCorrect() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
      });
    } catch (e) {}
  }

  playHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {}
  }
}

const synth = new SoundSynth();

export default function QuantumRush({
  onExploreInLab,
  onNavigateLearn,
  injectedStartDemo = false
}) {
  const canvasRef = useRef(null);

  // Game Lifecycle States: 'MENU' | 'PLAYING' | 'CHALLENGE' | 'GAMEOVER'
  const [gameState, setGameState] = useState('MENU');
  const [currentWorldId, setCurrentWorldId] = useState(1);
  const [isWorldSelectOpen, setIsWorldSelectOpen] = useState(false);
  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Session Telemetry
  const [score, setScore] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [qubitsCollected, setQubitsCollected] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState(null); // { token, question }

  // Game Engine Mutable State Refs (avoiding React render lag in 60fps loop)
  const engineRef = useRef({
    lane: 1, // 0: Left, 1: Center, 2: Right
    targetLane: 1,
    laneX: 0, // Interpolated X
    playerY: 0, // For Jump
    isJumping: false,
    jumpVelocity: 0,
    isSliding: false,
    slideTimer: 0,
    invincibleTimer: 0,
    speed: 6.5,
    distance: 0,
    collectibles: [],
    obstacles: [],
    particles: [],
    spawnTimer: 0,
    currentConceptName: 'SUPERPOSITION'
  });

  const requestRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Sync sound setting with synthesizer
  useEffect(() => {
    synth.enabled = soundEnabled;
  }, [soundEnabled]);

  // Handle Demo Mode Trigger from Navbar if provided
  useEffect(() => {
    if (injectedStartDemo && gameState === 'MENU') {
      startGame(2); // Start World 2 (Superposition City) for demo
    }
  }, [injectedStartDemo]);

  // Start a new run
  const startGame = (worldId = currentWorldId) => {
    setCurrentWorldId(worldId);
    const world = WORLDS.find(w => w.id === worldId) || WORLDS[0];

    engineRef.current = {
      lane: 1,
      targetLane: 1,
      laneX: 0,
      playerY: 0,
      isJumping: false,
      jumpVelocity: 0,
      isSliding: false,
      slideTimer: 0,
      invincibleTimer: 0,
      speed: 6.5 * (world.speedFactor || 1.0),
      distance: 0,
      collectibles: [],
      obstacles: [],
      particles: [],
      spawnTimer: 0,
      currentConceptName: world.concepts[0] || 'QUBIT'
    };

    setScore(0);
    setXpEarned(0);
    setLives(3);
    setStreak(0);
    setQubitsCollected(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setActiveChallenge(null);
    setGameState('PLAYING');
  };

  // Keyboard controls
  const handleKeyDown = useCallback((e) => {
    if (gameState !== 'PLAYING') return;

    const eng = engineRef.current;
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      if (eng.targetLane > 0) eng.targetLane -= 1;
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      if (eng.targetLane < 2) eng.targetLane += 1;
    } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
      if (!eng.isJumping && !eng.isSliding) {
        eng.isJumping = true;
        eng.jumpVelocity = 14;
      }
    } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
      if (!eng.isJumping && !eng.isSliding) {
        eng.isSliding = true;
        eng.slideTimer = 35; // frames
      }
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Touch Swipe gestures for Mobile
  const touchStartRef = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e) => {
    if (gameState !== 'PLAYING' || e.changedTouches.length === 0) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    const eng = engineRef.current;

    if (Math.max(absX, absY) > 30) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX < 0 && eng.targetLane > 0) eng.targetLane -= 1;
        if (deltaX > 0 && eng.targetLane < 2) eng.targetLane += 1;
      } else {
        // Vertical swipe
        if (deltaY < 0 && !eng.isJumping && !eng.isSliding) {
          eng.isJumping = true;
          eng.jumpVelocity = 14;
        } else if (deltaY > 0 && !eng.isJumping && !eng.isSliding) {
          eng.isSliding = true;
          eng.slideTimer = 35;
        }
      }
    }
  };

  // Main 60FPS Game Loop
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const updateAndRender = (time) => {
      const eng = engineRef.current;

      // 1. Resize handling
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }
      const W = canvas.width;
      const H = canvas.height;

      // 2. Physics & Logic Update
      eng.distance += eng.speed;
      setScore(s => s + Math.round(eng.speed / 2));

      // Smooth Lane Interpolation (-1: Left, 0: Center, 1: Right)
      const targetNormalizedX = (eng.targetLane - 1);
      eng.laneX += (targetNormalizedX - eng.laneX) * 0.22;

      // Jump Physics
      if (eng.isJumping) {
        eng.playerY += eng.jumpVelocity;
        eng.jumpVelocity -= 0.8; // Gravity
        if (eng.playerY <= 0) {
          eng.playerY = 0;
          eng.isJumping = false;
        }
      }

      // Slide Timer
      if (eng.isSliding) {
        eng.slideTimer--;
        if (eng.slideTimer <= 0) eng.isSliding = false;
      }

      // Invincibility after hit
      if (eng.invincibleTimer > 0) eng.invincibleTimer--;

      // Spawn items (Tokens & Obstacles)
      eng.spawnTimer++;
      if (eng.spawnTimer > 65) {
        eng.spawnTimer = 0;
        const lane = Math.floor(Math.random() * 3);
        const isObstacle = Math.random() < 0.42;

        if (isObstacle) {
          const obstacleTypes = ['barrier', 'gate_wall', 'decoherence'];
          eng.obstacles.push({
            id: Date.now() + Math.random(),
            lane,
            z: 800,
            type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)],
            cleared: false
          });
        } else {
          // Token types mapped to quantum concepts
          const tokenTypes = [
            { type: 'hadamard', symbol: 'H', color: '#00f2fe', label: 'H Gate Token', concept: 'superposition' },
            { type: 'qubit', symbol: 'Q', color: '#a855f7', label: 'Qubit Token', concept: 'qubit' },
            { type: 'cnot', symbol: '⊕', color: '#10b981', label: 'CNOT Token', concept: 'entanglement' },
            { type: 'xgate', symbol: 'X', color: '#f59e0b', label: 'X Gate Token', concept: 'gates' }
          ];
          const chosen = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
          eng.collectibles.push({
            id: Date.now() + Math.random(),
            lane,
            z: 800,
            ...chosen,
            cleared: false
          });
        }
      }

      // Update and filter Collectibles
      for (let i = eng.collectibles.length - 1; i >= 0; i--) {
        const item = eng.collectibles[i];
        item.z -= eng.speed * 1.8;

        // Collision Check: item near player (z between 20 and 70)
        if (item.z > 20 && item.z < 80 && Math.abs(eng.laneX - (item.lane - 1)) < 0.5) {
          // HIT COLLECTIBLE! Trigger Educational Challenge
          synth.playCollect();
          ProgressService.recordTokenCollected(item.type);
          setQubitsCollected(q => q + 1);
          setXpEarned(x => x + 10);

          // Get Question for this concept
          const q = QuestionService.getQuestionForToken(item.type);
          setActiveChallenge({ token: item, question: q });
          eng.collectibles.splice(i, 1);
          setGameState('CHALLENGE'); // PAUSES THE RUN
          return;
        }

        // Out of screen
        if (item.z <= -50) {
          eng.collectibles.splice(i, 1);
        }
      }

      // Update and filter Obstacles
      for (let i = eng.obstacles.length - 1; i >= 0; i--) {
        const obs = eng.obstacles[i];
        obs.z -= eng.speed * 1.8;

        // Collision Check with Obstacle
        if (obs.z > 20 && obs.z < 75 && Math.abs(eng.laneX - (obs.lane - 1)) < 0.45 && !obs.cleared) {
          // Check if jumped over barrier or slided under high gate
          let dodged = false;
          if (obs.type === 'barrier' && eng.playerY > 40) dodged = true;
          if (obs.type === 'gate_wall' && eng.isSliding) dodged = true;

          if (!dodged && eng.invincibleTimer === 0) {
            // Player hit obstacle
            obs.cleared = true;
            synth.playHit();
            eng.invincibleTimer = 60; // 1s invincibility flash

            setLives(prevLives => {
              const newLives = prevLives - 1;
              if (newLives <= 0) {
                // GAME OVER
                ProgressService.recordRunEnd(score, xpEarned, 85);
                setGameState('GAMEOVER');
              }
              return newLives;
            });
          }
        }

        if (obs.z <= -50) {
          eng.obstacles.splice(i, 1);
        }
      }

      // 3. Render 3D Perspective Canvas
      ctx.clearRect(0, 0, W, H);

      // Deep Space / Quantum City Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
      bgGrad.addColorStop(0, '#030511');
      bgGrad.addColorStop(0.5, '#060a22');
      bgGrad.addColorStop(1, '#090e2f');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Perspective Grid Horizon
      const horizonY = H * 0.38;
      const originX = W * 0.5;

      // Draw Glowing Quantum Highway Tracks (3 Lanes)
      const laneWidthBottom = W * 0.28;
      const laneWidthTop = W * 0.08;

      ctx.save();
      // Track Surface
      ctx.beginPath();
      ctx.moveTo(originX - laneWidthTop * 1.5, horizonY);
      ctx.lineTo(originX + laneWidthTop * 1.5, horizonY);
      ctx.lineTo(originX + laneWidthBottom * 1.5, H);
      ctx.lineTo(originX - laneWidthBottom * 1.5, H);
      ctx.closePath();

      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      roadGrad.addColorStop(0, 'rgba(14, 28, 77, 0.4)');
      roadGrad.addColorStop(1, 'rgba(12, 19, 48, 0.95)');
      ctx.fillStyle = roadGrad;
      ctx.fill();

      // Lane Dividers (Neon Lines)
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
      ctx.lineWidth = 2;
      [-1.5, -0.5, 0.5, 1.5].forEach(m => {
        ctx.beginPath();
        ctx.moveTo(originX + laneWidthTop * m, horizonY);
        ctx.lineTo(originX + laneWidthBottom * m, H);
        ctx.stroke();
      });

      // Animated Forward Pulse Lines on Highway
      const pulsePhase = (eng.distance * 1.5) % 80;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      for (let yOffset = pulsePhase; yOffset < H - horizonY; yOffset += 40) {
        const currY = horizonY + yOffset;
        const progress = (currY - horizonY) / (H - horizonY);
        const wAtY = laneWidthTop * 1.5 + (laneWidthBottom * 1.5 - laneWidthTop * 1.5) * progress;
        ctx.beginPath();
        ctx.moveTo(originX - wAtY, currY);
        ctx.lineTo(originX + wAtY, currY);
        ctx.stroke();
      }
      ctx.restore();

      // Perspective Projection Helper: converts (laneX, z) to screen (screenX, screenY, scale)
      const project = (laneNormalized, z) => {
        const depth = Math.max(10, z + 120);
        const scale = 260 / depth;
        const screenY = horizonY + (H - horizonY) * (1 - (z / 800));
        const currentLaneWidth = laneWidthTop + (laneWidthBottom - laneWidthTop) * (1 - (z / 800));
        const screenX = originX + laneNormalized * currentLaneWidth;
        return { screenX, screenY, scale };
      };

      // Draw Collectibles
      eng.collectibles.forEach(item => {
        const { screenX, screenY, scale } = project(item.lane - 1, item.z);
        if (screenY < horizonY || screenY > H) return;

        const size = Math.max(12, 28 * scale);
        ctx.save();
        ctx.translate(screenX, screenY);

        // Glowing outer pulse
        ctx.shadowColor = item.color;
        ctx.shadowBlur = 16 * scale;

        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();

        // Inner Core & Symbol
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#060a1c';
        ctx.font = `bold ${Math.max(10, Math.round(14 * scale))}px 'Space Grotesk', monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.symbol, 0, 1);
        ctx.restore();
      });

      // Draw Obstacles
      eng.obstacles.forEach(obs => {
        const { screenX, screenY, scale } = project(obs.lane - 1, obs.z);
        if (screenY < horizonY || screenY > H) return;

        const obsW = Math.max(20, 64 * scale);
        const obsH = Math.max(16, 40 * scale);

        ctx.save();
        ctx.translate(screenX, screenY);

        if (obs.type === 'barrier') {
          // Low barrier (jump over)
          ctx.shadowColor = '#ef4444';
          ctx.shadowBlur = 12 * scale;
          ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
          ctx.fillRect(-obsW / 2, -obsH, obsW, obsH);

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(8, Math.round(9 * scale))}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('JUMP ↑', 0, -obsH / 2);
        } else if (obs.type === 'gate_wall') {
          // High gate wall (slide under)
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 12 * scale;
          ctx.fillStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.fillRect(-obsW / 2, -obsH * 1.8, obsW, obsH * 0.9);

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(8, Math.round(9 * scale))}px monospace`;
          ctx.textAlign = 'center';
          ctx.fillText('SLIDE ↓', 0, -obsH * 1.3);
        } else {
          // Decoherence Zone (danger field)
          ctx.shadowColor = '#ec4899';
          ctx.shadowBlur = 14 * scale;
          ctx.fillStyle = 'rgba(236, 72, 153, 0.85)';
          ctx.beginPath();
          ctx.arc(0, -obsH / 2, obsW / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // Draw Player Runner Avatar
      const playerScreenX = originX + eng.laneX * laneWidthBottom;
      const playerBaseY = H * 0.88 - eng.playerY;

      ctx.save();
      ctx.translate(playerScreenX, playerBaseY);

      // Invincibility Blink
      if (eng.invincibleTimer % 4 > 1) {
        ctx.globalAlpha = 0.3;
      }

      // Neon Shadow on Highway
      ctx.beginPath();
      ctx.ellipse(0, 8, 22, 7, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 242, 254, 0.35)';
      ctx.fill();

      // Character Representation (Futuristic Cyber Qubit Runner)
      const pColor = eng.isSliding ? '#f59e0b' : '#00f2fe';
      ctx.shadowColor = pColor;
      ctx.shadowBlur = 18;

      if (eng.isSliding) {
        // Sliding posture (streamlined horizontal capsule)
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.roundRect(-24, -14, 48, 18, 9);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = "bold 9px monospace";
        ctx.textAlign = 'center';
        ctx.fillText('SLIDE', 0, -2);
      } else {
        // Running or Jumping Posture (Dynamic Quantum Runner)
        // Torso & Core
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.roundRect(-14, -48, 28, 36, 8);
        ctx.fill();

        // Runner Head / Visor
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, -56, 11, 0, Math.PI * 2);
        ctx.fill();

        // Neon Visor Stripe
        ctx.fillStyle = '#060a1c';
        ctx.fillRect(-8, -58, 16, 4);

        // Core Quantum Ring
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, -32, 7, 0, Math.PI * 2);
        ctx.stroke();

        // Running Legs Animation
        const legSwing = Math.sin(eng.distance * 0.35) * 12;
        ctx.strokeStyle = pColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(-7, -14);
        ctx.lineTo(-9 + legSwing * 0.5, 0);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(7, -14);
        ctx.lineTo(9 - legSwing * 0.5, 0);
        ctx.stroke();
      }
      ctx.restore();

      requestRef.current = requestAnimationFrame(updateAndRender);
    };

    requestRef.current = requestAnimationFrame(updateAndRender);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, score, xpEarned]);

  // Handle Answer submitted in Challenge Modal
  const handleAnswerSubmit = (isCorrect, question) => {
    setQuestionsAnswered(q => q + 1);

    if (isCorrect) {
      synth.playCorrect();
      setCorrectAnswers(c => c + 1);
      setStreak(s => {
        const nextStreak = s + 1;
        if (nextStreak > bestStreak) setBestStreak(nextStreak);
        return nextStreak;
      });

      const earned = (question.xp || 50);
      setXpEarned(x => x + earned);
      ProgressService.addXP(earned, 'Correct Quantum Answer');
    } else {
      synth.playHit();
      setStreak(0);
      setLives(prev => {
        const nextLives = prev - 1;
        if (nextLives <= 0) {
          // Will show game over after modal closes
        }
        return nextLives;
      });
    }
  };

  // Resume game from Challenge
  const handleResumeRun = () => {
    setActiveChallenge(null);
    if (lives <= 0) {
      ProgressService.recordRunEnd(score, xpEarned, 75);
      setGameState('GAMEOVER');
    } else {
      setGameState('PLAYING');
    }
  };

  // Jump from challenge to Quantum Lab
  const handleExploreInLabFromGame = (conceptId) => {
    setActiveChallenge(null);
    setGameState('MENU');
    onExploreInLab?.(conceptId || 'superposition');
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#030511] overflow-hidden flex flex-col select-none">
      
      {/* 1. TOP HUD BAR (During Gameplay & Challenge) */}
      <div className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-none">
        
        {/* Lives Counter */}
        <div className="flex items-center space-x-1.5 bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 pointer-events-auto">
          {[1, 2, 3].map(heartIdx => (
            <Heart
              key={heartIdx}
              className={`w-5 h-5 transition-transform ${
                heartIdx <= lives
                  ? 'text-rose-500 fill-rose-500 scale-100'
                  : 'text-gray-600 scale-90'
              }`}
            />
          ))}
        </div>

        {/* Center: Score & Multiplier */}
        <div className="flex items-center space-x-4">
          <div className="bg-black/60 backdrop-blur-md px-5 py-1.5 rounded-2xl border border-cyan-500/30 flex items-center space-x-2 pointer-events-auto shadow-lg shadow-cyan-500/10">
            <span className="text-xs font-mono text-gray-400 uppercase">SCORE</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-white tracking-wider">
              {score.toLocaleString()}
            </span>
          </div>

          {streak >= 2 && (
            <div className="hidden sm:flex items-center space-x-1 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold animate-pulse pointer-events-auto">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>{streak} STREAK</span>
            </div>
          )}
        </div>

        {/* Right: XP Earned & Audio Controls */}
        <div className="flex items-center space-x-2.5 pointer-events-auto">
          <div className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-xs font-bold shadow-sm">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>+{xpEarned} XP</span>
          </div>

          <button
            onClick={() => setSoundEnabled(s => !s)}
            className="p-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-gray-300 hover:text-white transition-colors"
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>
        </div>

      </div>

      {/* 2. GAME CANVAS */}
      <canvas
        ref={canvasRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full h-full block cursor-pointer active:cursor-grabbing"
      />

      {/* 3. BOTTOM CONCEPT & CONTROLS BAR (During Gameplay) */}
      {gameState === 'PLAYING' && (
        <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
          
          {/* Concept Progress Card */}
          <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 flex items-center space-x-3 pointer-events-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <div className="text-xs font-mono">
              <span className="text-gray-400">ACTIVE WORLD: </span>
              <strong className="text-cyan-300 uppercase">
                {WORLDS.find(w => w.id === currentWorldId)?.name || 'QUBIT VALLEY'}
              </strong>
            </div>
          </div>

          {/* Touch Arrow Controls for Mobile */}
          <div className="flex items-center space-x-2 pointer-events-auto sm:hidden">
            <button
              onClick={() => { if (engineRef.current.targetLane > 0) engineRef.current.targetLane -= 1; }}
              className="p-3 rounded-2xl bg-white/10 active:bg-white/30 text-white border border-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  if (!engineRef.current.isJumping && !engineRef.current.isSliding) {
                    engineRef.current.isJumping = true;
                    engineRef.current.jumpVelocity = 14;
                  }
                }}
                className="p-2.5 rounded-xl bg-white/10 active:bg-white/30 text-white border border-white/20"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (!engineRef.current.isJumping && !engineRef.current.isSliding) {
                    engineRef.current.isSliding = true;
                    engineRef.current.slideTimer = 35;
                  }
                }}
                className="p-2.5 rounded-xl bg-white/10 active:bg-white/30 text-white border border-white/20"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => { if (engineRef.current.targetLane < 2) engineRef.current.targetLane += 1; }}
              className="p-3 rounded-2xl bg-white/10 active:bg-white/30 text-white border border-white/20"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

      {/* 4. GAME START OVERLAY (MENU STATE) */}
      {gameState === 'MENU' && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#070a1a] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 text-center flex flex-col items-center">
            
            {/* Header / Branding */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/30 mb-4">
              <div className="w-full h-full bg-[#070a19] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-400" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wider font-['Space_Grotesk'] uppercase">
              QUANTUM RUSH
            </h1>
            <p className="text-xs sm:text-sm text-cyan-300/90 font-mono mt-1">
              "Run through the quantum world."
            </p>

            {/* Student Level & High Score Telemetry */}
            <div className="w-full grid grid-cols-2 gap-3 my-6 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs font-mono">
              <div>
                <div className="text-gray-400 uppercase text-[10px]">CURRENT LEVEL</div>
                <div className="text-white font-bold text-sm mt-0.5">
                  Level {ProgressService.getLevelInfo().level} &bull; {ProgressService.getLevelInfo().title.split(' ')[0]}
                </div>
              </div>
              <div>
                <div className="text-gray-400 uppercase text-[10px]">HIGH SCORE</div>
                <div className="text-cyan-300 font-bold text-sm mt-0.5">
                  {ProgressService.getState().highScore.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Launch Buttons */}
            <div className="w-full space-y-3">
              <button
                onClick={() => startGame(currentWorldId)}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-black font-extrabold text-sm tracking-wider uppercase font-['Space_Grotesk'] flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-98 transition-all"
              >
                <Play className="w-5 h-5 fill-black" />
                <span>START RUN</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsWorldSelectOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 border border-white/10 transition-colors"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>World Select</span>
                </button>

                <button
                  onClick={() => setIsHowToPlayOpen(true)}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold flex items-center justify-center space-x-1.5 border border-white/10 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <span>How to Play</span>
                </button>
              </div>
            </div>

            {/* Direct SIH Demo Mode Trigger Button */}
            <div className="mt-5 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">SIH Judge Demo:</span>
              <button
                onClick={() => startGame(2)}
                className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-bold underline"
              >
                <span>Launch Superposition City</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. EDUCATIONAL CHALLENGE MODAL (On Token Collection) */}
      {gameState === 'CHALLENGE' && activeChallenge && (
        <ChallengeModal
          token={activeChallenge.token}
          question={activeChallenge.question}
          onAnswer={handleAnswerSubmit}
          onResumeRun={handleResumeRun}
          onExploreInLab={handleExploreInLabFromGame}
          lives={lives}
        />
      )}

      {/* 6. GAME OVER MODAL (Run Complete) */}
      {gameState === 'GAMEOVER' && (
        <GameOverModal
          stats={{
            score,
            xpEarned,
            qubitsCollected,
            questionsAnswered,
            correctAnswers,
            bestStreak
          }}
          onPlayAgain={() => startGame(currentWorldId)}
          onExploreInLab={(concept) => onExploreInLab?.(concept || 'superposition')}
          onLearnHub={() => onNavigateLearn?.()}
        />
      )}

      {/* 7. WORLD SELECT MODAL */}
      <WorldSelectModal
        isOpen={isWorldSelectOpen}
        currentWorld={currentWorldId}
        onSelectWorld={(id) => setCurrentWorldId(id)}
        onClose={() => setIsWorldSelectOpen(false)}
      />

      {/* 8. HOW TO PLAY MODAL */}
      {isHowToPlayOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#080b1e] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-bold text-lg text-white font-['Space_Grotesk'] mb-3">
              How to Play Quantum Rush
            </h3>
            <div className="space-y-3 text-xs text-gray-300 font-sans leading-relaxed">
              <p>
                &bull; <strong className="text-cyan-300">Desktop Controls:</strong> Use <strong className="text-white">← →</strong> to switch between 3 lanes, <strong className="text-white">↑</strong> to Jump over red barriers, and <strong className="text-white">↓</strong> to Slide under yellow gate walls.
              </p>
              <p>
                &bull; <strong className="text-cyan-300">Mobile Controls:</strong> Swipe Left/Right to steer, Swipe Up to jump, and Swipe Down to slide.
              </p>
              <p>
                &bull; <strong className="text-purple-300">Quantum Tokens:</strong> Collecting tokens pauses the run and triggers a quantum quiz challenge. Correct answers grant +50 XP and unlock concepts for exploration in Quantum Lab!
              </p>
            </div>
            <button
              onClick={() => setIsHowToPlayOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs uppercase font-['Space_Grotesk']"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
