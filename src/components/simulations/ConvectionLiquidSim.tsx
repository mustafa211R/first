import React, { useState, useEffect, useRef } from 'react';
import { Waves, Flame, RefreshCw, Eye, Info, Wind, Droplets } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface DyeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  radius: number;
}

interface Props {
  environment: EnvironmentType;
}

export const ConvectionLiquidSim: React.FC<Props> = ({ environment }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHeating, setIsHeating] = useState<boolean>(true);
  const [heatIntensity, setHeatIntensity] = useState<number>(2); // 1 to 3
  const [showFlowVectors, setShowFlowVectors] = useState<boolean>(true);
  const [dyeCount, setDyeCount] = useState<number>(1);

  const particlesRef = useRef<DyeParticle[]>([]);

  // Spawn new dye particles at bottom center
  const addDyeCrystal = () => {
    const newParticles: DyeParticle[] = [];
    for (let i = 0; i < 90; i++) {
      newParticles.push({
        x: 170 + (Math.random() - 0.5) * 20,
        y: 260 + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.2 - Math.random() * 0.3,
        alpha: 0.85,
        radius: 3 + Math.random() * 3,
      });
    }
    particlesRef.current = [...particlesRef.current, ...newParticles];
    setDyeCount((c) => c + 1);
  };

  // Reset dye
  const handleReset = () => {
    particlesRef.current = [];
    addDyeCrystal();
  };

  // Initial seed
  useEffect(() => {
    addDyeCrystal();
  }, []);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const centerX = 170;
    const flaskRadius = 120;
    const flaskCenterY = 170;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Glass Flask Body
      ctx.save();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';

      // Spherical bulb of flask
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius, 0.45 * Math.PI, 2.55 * Math.PI, false);
      // Flask neck
      ctx.lineTo(centerX + 30, 30);
      ctx.lineTo(centerX - 30, 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Water background tint inside flask
      ctx.fillStyle = 'rgba(14, 116, 144, 0.25)';
      ctx.beginPath();
      ctx.arc(centerX, flaskCenterY, flaskRadius - 4, 0.45 * Math.PI, 2.55 * Math.PI, false);
      ctx.lineTo(centerX + 26, 40);
      ctx.lineTo(centerX - 26, 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Flow Vector Arrows if enabled
      if (showFlowVectors && isHeating) {
        ctx.save();
        ctx.lineWidth = 2;

        // Rising central warm current (RED)
        ctx.strokeStyle = '#ef4444';
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(centerX, 250);
        ctx.lineTo(centerX, 100);
        ctx.stroke();
        // Arrow head
        ctx.beginPath();
        ctx.moveTo(centerX, 85);
        ctx.lineTo(centerX - 6, 100);
        ctx.lineTo(centerX + 6, 100);
        ctx.fill();

        // Right sinking cool current (BLUE)
        ctx.strokeStyle = '#38bdf8';
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(centerX + 60, 160, 45, 1.2 * Math.PI, 0.4 * Math.PI, false);
        ctx.stroke();

        // Left sinking cool current (BLUE)
        ctx.beginPath();
        ctx.arc(centerX - 60, 160, 45, 0.6 * Math.PI, 1.8 * Math.PI, false);
        ctx.stroke();

        // Legend on canvas
        ctx.font = 'bold 9px Cairo, sans-serif';
        ctx.fillStyle = '#f87171';
        ctx.fillText('تيار صاعد (ساخن أقل كثافة)', centerX + 10, 110);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('تيار هابط (بارد أعلى كثافة)', centerX + 55, 210);
        ctx.restore();
      }

      // Update & Draw Dye Particles
      const particles = particlesRef.current;
      const speedFactor = isHeating ? heatIntensity * 0.9 : 0.15;

      particles.forEach((p) => {
        if (isHeating) {
          // Convection field physics:
          // Near center line (|x - centerX| < 35): strong upward buoyancy
          // Near top (y < 110): outward spread
          // Near edges: downward sink
          // Near bottom: inward return
          const dx = p.x - centerX;
          const dy = p.y - flaskCenterY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (Math.abs(dx) < 35 && p.y > 90) {
            // Rising column
            p.vy -= 0.12 * speedFactor;
            p.vx += (Math.random() - 0.5) * 0.1;
          } else if (p.y <= 100) {
            // Spreading outward at the top
            p.vx += (dx >= 0 ? 0.2 : -0.2) * speedFactor;
            p.vy = 0.1;
          } else if (p.y > 100 && p.y < 240) {
            // Sinking along outer perimeter
            p.vy += 0.08 * speedFactor;
            // keep inside flask curved wall
            if (dist > flaskRadius - 15) {
              p.vx = (dx > 0 ? -0.3 : 0.3) * speedFactor;
            }
          } else if (p.y >= 240) {
            // Returning towards the center bottom to heat up again!
            p.vx += (dx > 0 ? -0.15 : 0.15) * speedFactor;
            p.vy = -0.05;
          }

          // Apply velocity with damping
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.94;
          p.vy *= 0.94;
        } else {
          // Slow diffusive settling when heat is off
          p.y += 0.1;
          p.x += (Math.random() - 0.5) * 0.2;
        }

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Purple permanganate dye color
        ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`;
        ctx.fill();
        ctx.restore();
      });

      // Bottom Potassium Permanganate Crystal Node
      ctx.save();
      ctx.fillStyle = '#7e22ce'; // Deep purple crystal
      ctx.beginPath();
      ctx.roundRect(centerX - 10, 264, 20, 8, 4);
      ctx.fill();
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Flame below if heating
      if (isHeating) {
        ctx.save();
        const flameHeight = 25 * heatIntensity;
        const grad = ctx.createLinearGradient(centerX, 320, centerX, 320 - flameHeight);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(0.3, '#f59e0b');
        grad.addColorStop(1, '#ef4444');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(centerX - 14, 320);
        ctx.quadraticCurveTo(centerX, 320 - flameHeight - (Math.random() * 6), centerX + 14, 320);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [isHeating, heatIntensity, showFlowVectors]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: Flask Canvas Sim */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between p-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative min-h-[440px]">
          {/* Header */}
          <div className="w-full flex items-center justify-between text-xs px-1 mb-1">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-purple-400" />
              تيارات الحمل الحراري في الدورق الكروي
            </span>
            <span className="text-[11px] text-slate-300 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              الصبغة: بلورة برمنغنات البوتاسيوم البنفسجية
            </span>
          </div>

          {/* Canvas */}
          <div className="relative flex justify-center my-auto">
            <canvas
              ref={canvasRef}
              width={340}
              height={330}
              className="max-w-full h-[320px] rounded-xl object-contain block mx-auto select-none"
            />
          </div>

          {/* Controls below canvas */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => setIsHeating(!isHeating)}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isHeating
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-500/20'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isHeating ? 'إطفاء الموقد' : 'تشغيل الموقد'}</span>
            </button>

            <button
              onClick={addDyeCrystal}
              className="py-2 px-2.5 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Droplets className="w-4 h-4 text-purple-400" />
              <span>إضافة صبغة بالقاع</span>
            </button>

            <button
              onClick={() => setShowFlowVectors(!showFlowVectors)}
              className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                showFlowVectors
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>أسهم التيارات</span>
            </button>

            <button
              onClick={handleReset}
              className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تفريغ وماء نقي</span>
            </button>
          </div>
        </div>

        {/* Right: Explanation & Real-world environmental connections */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Flame Intensity Slider */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>شدة لهب التسخين:</span>
              <span className="text-amber-400 font-mono">
                {heatIntensity === 1 ? 'هادئ' : heatIntensity === 2 ? 'متوسط' : 'قوي وسريع'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={1}
              value={heatIntensity}
              disabled={!isHeating}
              onChange={(e) => setHeatIntensity(Number(e.target.value))}
              className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>تيار هادئ</span>
              <span>تيار متوسط</span>
              <span>دوران حراري فائق</span>
            </div>
          </div>

          {/* Scientific Mechanism Breakdown */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <h4 className="font-bold text-cyan-400 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              كيف تتكون تيارات الحمل في السوائل والغازات؟
            </h4>
            <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <b className="text-red-400">1. التيار الصاعد: </b>
                يسخن السائل في القاع فيتمدد وتقل كثافته، فيرتفع إلى الأعلى حاملاً الصبغة البنفسجية معه.
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <b className="text-sky-400">2. التيار الهابط: </b>
                عند وصول السائل للسطح يفقد جزءاً من حرارته للهواء، فتبرد جزيئاته وتزداد كثافته ويهبط على الجوانب.
              </div>
            </div>
          </div>

          {/* Real-world Life Links */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs space-y-2">
            <span className="font-bold text-amber-300 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-amber-400" />
              تطبيقات الحمل الحراري في البيئة والحياة:
            </span>
            <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
              <li>
                <b>مكيفات الهواء والمدافئ: </b>
                يوضع المكيف في أعلى الجدار لأن الهواء البارد ثقيل فيهبط ليبرد الغرفة، بينما توضع المدفأة على الأرض لأن الهواء الساخن خفيف فيرتفع.
              </li>
              <li>
                <b>نسيم البحر والبر: </b>
                تسخن رمال الشاطئ نهاراً أسرع من البحر فيرتفع الهواء فوقها، ويهب هواء البحر البارد ليحل محله.
              </li>
              <li>
                <b>غليان السوائل في المطبخ: </b>
                تقليب الحساء أو الحليب المغلي ينتج تماماً عن هذه التيارات الدائرية المستمرة.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
