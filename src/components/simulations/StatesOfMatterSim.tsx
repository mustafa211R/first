import React, { useEffect, useRef, useState } from 'react';
import { Flame, Snowflake, Sparkles, RefreshCw, Volume2, Info, Eye } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  isIon?: boolean;
  charge?: '+' | '-';
}

interface Props {
  environment: EnvironmentType;
}

export const StatesOfMatterSim: React.FC<Props> = ({ environment }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stateType, setStateType] = useState<'solid' | 'liquid' | 'gas' | 'plasma'>('solid');
  const [temperature, setTemperature] = useState<number>(-20); // Celsius
  const [particleCount, setParticleCount] = useState<number>(48);
  const [showBonds, setShowBonds] = useState<boolean>(true);
  const [showVibrations, setShowVibrations] = useState<boolean>(true);

  // Initialize and animate particles
  const particlesRef = useRef<Particle[]>([]);

  // Setup particles based on state
  useEffect(() => {
    const width = 480;
    const height = 340;
    const count = particleCount;
    const newParticles: Particle[] = [];

    if (stateType === 'solid') {
      const rows = 6;
      const cols = Math.ceil(count / rows);
      const startX = width / 2 - (cols * 32) / 2;
      const startY = height - 50 - rows * 32;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (newParticles.length < count) {
            newParticles.push({
              x: startX + c * 32 + (r % 2) * 8,
              y: startY + r * 30,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4,
              radius: 9,
              color: '#38bdf8', // Light blue ice
            });
          }
        }
      }
    } else if (stateType === 'liquid') {
      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: 100 + Math.random() * (width - 200),
          y: height - 40 - Math.random() * 110,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.2,
          radius: 9,
          color: '#0284c7', // Water blue
        });
      }
    } else if (stateType === 'gas') {
      for (let i = 0; i < count; i++) {
        newParticles.push({
          x: 40 + Math.random() * (width - 80),
          y: 40 + Math.random() * (height - 90),
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.5) * 4.5,
          radius: 8,
          color: '#a855f7', // Gas purple
        });
      }
    } else if (stateType === 'plasma') {
      for (let i = 0; i < count; i++) {
        const isIon = i % 2 === 0;
        newParticles.push({
          x: 40 + Math.random() * (width - 80),
          y: 40 + Math.random() * (height - 90),
          vx: (Math.random() - 0.5) * 8.5,
          vy: (Math.random() - 0.5) * 8.5,
          radius: isIon ? 11 : 5,
          color: isIon ? '#ef4444' : '#fbbf24', // Red cations & golden free electrons
          isIon,
          charge: isIon ? '+' : '-',
        });
      }
    }

    particlesRef.current = newParticles;
  }, [stateType, particleCount]);

  // Adjust temperature defaults when switching state
  const handleStateChange = (newState: 'solid' | 'liquid' | 'gas' | 'plasma') => {
    setStateType(newState);
    if (newState === 'solid') setTemperature(-15);
    if (newState === 'liquid') setTemperature(45);
    if (newState === 'gas') setTemperature(130);
    if (newState === 'plasma') setTemperature(5000);
  };

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Draw container flask/chamber
      ctx.save();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(25, 20, width - 50, height - 40, 16);
      ctx.fill();
      ctx.stroke();

      // Draw measurement ticks on side
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      for (let y = 50; y < height - 30; y += 30) {
        ctx.beginPath();
        ctx.moveTo(25, y);
        ctx.lineTo(40, y);
        ctx.stroke();
      }
      ctx.restore();

      const particles = particlesRef.current;
      const speedMultiplier =
        stateType === 'solid'
          ? Math.max(0.1, 0.4 + (temperature + 50) * 0.008)
          : stateType === 'liquid'
          ? Math.max(0.5, 1.2 + (temperature - 20) * 0.015)
          : stateType === 'gas'
          ? Math.max(1.5, 3.5 + (temperature - 100) * 0.02)
          : 6.0;

      // Draw inter-molecular bonds in Solid state
      if (stateType === 'solid' && showBonds) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 42) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
      }

      // Physics update and draw particles
      particles.forEach((p, idx) => {
        if (stateType === 'solid') {
          // Vibrational harmonic motion around base lattice
          p.x += (Math.random() - 0.5) * speedMultiplier * 1.8;
          p.y += (Math.random() - 0.5) * speedMultiplier * 1.8;

          // Gentle spring return force
          const rows = 6;
          const cols = Math.ceil(particles.length / rows);
          const r = Math.floor(idx / cols);
          const c = idx % cols;
          const baseAnchorX = width / 2 - (cols * 32) / 2 + c * 32 + (r % 2) * 8;
          const baseAnchorY = height - 50 - (rows - r) * 30;

          p.x += (baseAnchorX - p.x) * 0.12;
          p.y += (baseAnchorY - p.y) * 0.12;
        } else if (stateType === 'liquid') {
          // Flow within lower basin with gravity and repulsion
          p.vy += 0.18; // gravity
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          // Wall boundaries (basin)
          const leftBound = 40;
          const rightBound = width - 40;
          const bottomBound = height - 35;
          const liquidCeiling = height - 160;

          if (p.x < leftBound + p.radius) {
            p.x = leftBound + p.radius;
            p.vx *= -0.7;
          }
          if (p.x > rightBound - p.radius) {
            p.x = rightBound - p.radius;
            p.vx *= -0.7;
          }
          if (p.y > bottomBound - p.radius) {
            p.y = bottomBound - p.radius;
            p.vy *= -0.4;
            p.vx += (Math.random() - 0.5) * 0.8;
          }
          if (p.y < liquidCeiling) {
            p.vy += 0.3; // surface tension pulls down
          }
        } else {
          // Gas & Plasma: Free rapid flight in full container
          p.x += p.vx * speedMultiplier * 0.6;
          p.y += p.vy * speedMultiplier * 0.6;

          const left = 38;
          const right = width - 38;
          const top = 32;
          const bottom = height - 32;

          if (p.x < left + p.radius) {
            p.x = left + p.radius;
            p.vx = Math.abs(p.vx);
          }
          if (p.x > right - p.radius) {
            p.x = right - p.radius;
            p.vx = -Math.abs(p.vx);
          }
          if (p.y < top + p.radius) {
            p.y = top + p.radius;
            p.vy = Math.abs(p.vy);
          }
          if (p.y > bottom - p.radius) {
            p.y = bottom - p.radius;
            p.vy = -Math.abs(p.vy);
          }
        }

        // Draw particle
        ctx.save();
        if (stateType === 'plasma') {
          // Glowing ionization halo
          const glow = ctx.createRadialGradient(p.x, p.y, 2, p.x, p.y, p.radius * 2);
          glow.addColorStop(0, p.color);
          glow.addColorStop(1, 'rgba(239, 68, 68, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Particle core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // If plasma, show charge symbol (+ or -)
        if (stateType === 'plasma' && p.charge) {
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.charge, p.x, p.y);
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [stateType, temperature, showBonds, showVibrations]);

  // Real-world environment context text
  const getContextSnippet = () => {
    switch (environment) {
      case 'kitchen':
        return 'في المطبخ: مكعب الثلج (صلب) يذوب في الكوب ليصبح ماءً (سائل)، وعند غليه في الإبريق يتصاعد كبخار (غاز).';
      case 'garden':
        return 'في الحديقة: الجليد في الصباح يتلاشى إلى ماء يروي الزهور، ثم تجففه شمس الظهيرة ليتبخر في الجو.';
      case 'street':
        return 'في شوارع المدينة: ترى البلازما في وميض البرق خلال العواصف وفي لافتات النيون الإعلانية المضيئة.';
      default:
        return 'في المعمل: نتحكم في حركة الجزيئات والمسافات البينية وقوى التجاذب بواسطة منظم الحرارة والمكبس.';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Simulation Screen & Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-gradient-to-b from-slate-900 to-slate-950 p-3 shadow-2xl">
        {/* Environment banner */}
        <div className="flex items-center justify-between text-xs px-2 py-1 mb-2 bg-slate-800/60 rounded-lg border border-slate-700/40">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Info className="w-4 h-4" />
            <span>ربط الواقع:</span>
            <span className="text-slate-300 font-normal">{getContextSnippet()}</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-cyan-400">
            <span>درجة الحرارة:</span>
            <span className="font-bold text-sm bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
              {temperature > 0 ? `+${temperature}` : temperature} °C
            </span>
          </div>
        </div>

        {/* Canvas area */}
        <div className="relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={480}
            height={340}
            className="w-full max-w-[540px] h-[300px] md:h-[340px] rounded-xl object-contain block mx-auto"
          />

          {/* Interactive State badges on canvas overlay */}
          <div className="absolute top-5 right-5 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700 text-xs shadow-lg">
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span>الشكل:</span>
              <span className="font-bold text-cyan-400">
                {stateType === 'solid' ? 'ثابت ومحدد' : stateType === 'liquid' ? 'متغير (شكل الوعاء)' : 'متغير كلياً'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span>الحجم:</span>
              <span className="font-bold text-emerald-400">
                {stateType === 'solid' || stateType === 'liquid' ? 'ثابت محدد' : 'متغير يشغل الحيز'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span>المسافات البينية:</span>
              <span className="font-bold text-amber-400">
                {stateType === 'solid' ? 'صغيرة جداً' : stateType === 'liquid' ? 'متوسطة' : 'كبيرة جداً'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <span>قوى التجاذب:</span>
              <span className="font-bold text-purple-400">
                {stateType === 'solid' ? 'كبيرة وقوية جداً' : stateType === 'liquid' ? 'أضعف وتسمح بالحركة' : 'شبه منعدمة'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel: States Switcher & Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
        {/* State Selection Buttons */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2">اختر حالة المادة للملاحظة:</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => handleStateChange('solid')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border font-bold text-xs transition-all ${
                stateType === 'solid'
                  ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-lg shadow-sky-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Snowflake className="w-5 h-5 mb-1 text-sky-400" />
              <span>الصلبة (ثلج)</span>
            </button>
            <button
              onClick={() => handleStateChange('liquid')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border font-bold text-xs transition-all ${
                stateType === 'liquid'
                  ? 'bg-blue-500/20 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="w-5 h-5 mb-1 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">💧</div>
              <span>السائلة (ماء)</span>
            </button>
            <button
              onClick={() => handleStateChange('gas')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border font-bold text-xs transition-all ${
                stateType === 'gas'
                  ? 'bg-purple-500/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Flame className="w-5 h-5 mb-1 text-purple-400" />
              <span>الغازية (بخار)</span>
            </button>
            <button
              onClick={() => handleStateChange('plasma')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border font-bold text-xs transition-all ${
                stateType === 'plasma'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-5 h-5 mb-1 text-amber-400" />
              <span>البلازما (تأين)</span>
            </button>
          </div>
        </div>

        {/* Temperature & Particle Options */}
        <div className="flex flex-col justify-between gap-3">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
              <span>التحكم بالطاقة الحرارية (التسخين / التبريد):</span>
              <span className="text-cyan-400 font-mono">{temperature} °C</span>
            </div>
            <input
              type="range"
              min={-50}
              max={stateType === 'plasma' ? 10000 : 250}
              step={stateType === 'plasma' ? 100 : 5}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>تبريد فائق (-50°C)</span>
              <span>درجة الغرفة (25°C)</span>
              <span>غليان (100°C)</span>
              <span>طاقة حرارية قصوى</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs">
            <button
              onClick={() => setShowBonds(!showBonds)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition ${
                showBonds
                  ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>إظهار الروابط الجزيئية</span>
            </button>

            <button
              onClick={() => {
                setTemperature(stateType === 'solid' ? -15 : stateType === 'liquid' ? 45 : 130);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 font-medium transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة ضبط الحرارة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
