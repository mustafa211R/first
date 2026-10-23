import React, { useState, useEffect, useRef } from 'react';
import { Flame, Play, RefreshCw, Timer, CheckCircle2, Info, Eye, ShieldAlert } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface RodMaterial {
  id: string;
  name: string;
  conductivity: number; // W/m.K
  color: string;
  pinFell: boolean;
  fallTime: number | null; // seconds
  heatProgress: number; // 0 to 100%
  description: string;
}

const INITIAL_RODS: RodMaterial[] = [
  {
    id: 'copper',
    name: 'النحاس (Copper)',
    conductivity: 385,
    color: '#ea580c',
    pinFell: false,
    fallTime: null,
    heatProgress: 0,
    description: 'أسرع المعادن توصيلاً للحرارة في التجربة.',
  },
  {
    id: 'aluminum',
    name: 'الألمنيوم (Aluminum)',
    conductivity: 205,
    color: '#94a3b8',
    pinFell: false,
    fallTime: null,
    heatProgress: 0,
    description: 'موصل ممتاز وسريع للحرارة، تصنع منه قدور الطهي.',
  },
  {
    id: 'iron',
    name: 'الحديد (Iron)',
    conductivity: 80,
    color: '#475569',
    pinFell: false,
    fallTime: null,
    heatProgress: 0,
    description: 'موصل متوسط وأبطأ بكثير من النحاس والألمنيوم.',
  },
  {
    id: 'glass',
    name: 'الزجاج (Glass)',
    conductivity: 1.05,
    color: '#06b6d4',
    pinFell: false,
    fallTime: null,
    heatProgress: 0,
    description: 'مادة عازلة ورديئة التوصيل، لا تسقط دبابيسها.',
  },
];

interface Props {
  environment: EnvironmentType;
}

export const ConductionRodsSim: React.FC<Props> = ({ environment }) => {
  const [rods, setRods] = useState<RodMaterial[]>(INITIAL_RODS);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [heatPower, setHeatPower] = useState<number>(1.0);
  const [showThermalView, setShowThermalView] = useState<boolean>(true);

  const timerRef = useRef<any>(null);

  // Simulation step loop
  useEffect(() => {
    if (isHeating) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          const newTime = Number((prev + 0.1).toFixed(1));

          // Update each rod's heat progression
          setRods((currentRods) =>
            currentRods.map((rod) => {
              if (rod.pinFell) return rod;

              // Progression speed scaled by conductivity and power
              const speed = (rod.conductivity / 385) * 2.2 * heatPower;
              const newProgress = Math.min(rod.heatProgress + speed, 100);

              // Wax melts at 75% progress to the pin
              if (newProgress >= 75 && !rod.pinFell) {
                return {
                  ...rod,
                  heatProgress: newProgress,
                  pinFell: true,
                  fallTime: newTime,
                };
              }

              return { ...rod, heatProgress: newProgress };
            })
          );

          return newTime;
        });
      }, 100);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isHeating, heatPower]);

  const handleStart = () => {
    setIsHeating(true);
  };

  const handlePause = () => {
    setIsHeating(false);
  };

  const handleReset = () => {
    setIsHeating(false);
    setElapsedTime(0);
    setRods(INITIAL_RODS);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: Thermal Conduction Apparatus Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative min-h-[440px] overflow-hidden">
          {/* Header */}
          <div className="w-full flex items-center justify-between text-xs px-1 mb-2">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              جهاز مقارنة التوصيل الحراري في المعادن
            </span>
            <div className="flex items-center gap-1.5 font-mono text-cyan-300 bg-slate-800/80 px-2.5 py-0.5 rounded-lg border border-slate-700">
              <Timer className="w-3.5 h-3.5 text-cyan-400" />
              <span>الزمن: {elapsedTime.toFixed(1)} ثانية</span>
            </div>
          </div>

          {/* Rods Layout Stage */}
          <div className="w-full my-auto flex flex-col gap-5 py-4 px-2">
            {rods.map((rod, index) => (
              <div key={rod.id} className="flex items-center gap-3 relative">
                {/* Rod Name & Conductivity */}
                <div className="w-28 text-right shrink-0">
                  <span className="text-xs font-bold block text-slate-200">{rod.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    k = {rod.conductivity} W/m·K
                  </span>
                </div>

                {/* Central Heat Source Dot on Right */}
                <div className="relative">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      isHeating
                        ? 'bg-red-500 border-amber-300 animate-ping shadow-lg'
                        : 'bg-slate-700 border-slate-500'
                    }`}
                  />
                  {index === 1 && isHeating && (
                    <div className="absolute -top-6 -right-2 text-[10px] font-bold text-amber-400 whitespace-nowrap">
                      موضع اللهب المركزي 🔥
                    </div>
                  )}
                </div>

                {/* The Metal Rod Bar */}
                <div className="relative flex-1 h-5 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow-inner">
                  {/* Base Metal Color Texture */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{ backgroundColor: rod.color }}
                  />

                  {/* Heat Propagation Gradient Wave */}
                  <div
                    className="absolute top-0 right-0 bottom-0 transition-all duration-100 bg-gradient-to-l from-red-600 via-orange-500 to-amber-300"
                    style={{
                      width: `${rod.heatProgress}%`,
                      opacity: showThermalView ? 0.85 : 0.4,
                    }}
                  />

                  {/* Wax Spot & Pin marker at 75% distance */}
                  <div
                    className="absolute top-0 bottom-0 w-3 bg-amber-100/90 border-x border-amber-300"
                    style={{ right: '75%' }}
                    title="قطعة شمع البرافين المثبتة للدبوس"
                  />
                </div>

                {/* The Pin with drop physics animation */}
                <div className="relative w-8 h-10 flex items-center justify-center shrink-0">
                  <div
                    className={`transition-all duration-500 ${
                      rod.pinFell
                        ? 'translate-y-5 rotate-90 opacity-60 text-slate-500'
                        : 'translate-y-0 text-amber-300 animate-pulse'
                    }`}
                  >
                    {/* Metal Pin Graphic */}
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-900 shadow" />
                      <div className="w-0.5 h-5 bg-slate-300" />
                    </div>
                  </div>

                  {rod.pinFell && (
                    <span className="absolute -top-3 text-[9px] font-mono font-bold text-emerald-400 bg-slate-950 px-1 rounded border border-emerald-500/40 whitespace-nowrap">
                      سقط ({rod.fallTime}s)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Toolbar */}
          <div className="w-full flex items-center justify-between pt-3 border-t border-slate-800">
            <div className="flex gap-2">
              {!isHeating ? (
                <button
                  onClick={handleStart}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>بدء التسخين ومراقبة التوصيل</span>
                </button>
              ) : (
                <button
                  onClick={handlePause}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
                >
                  <span>إيقاف مؤقت</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition"
                title="إعادة ضبط التجربة"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => setShowThermalView(!showThermalView)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition ${
                showThermalView
                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>مستشعر الحرارة بالأشعة</span>
            </button>
          </div>
        </div>

        {/* Right: Scientific Analysis & Ranking Table */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Results Ranking Table */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              ترتيب سرعة سقوط الدبابيس (جودة التوصيل):
            </h4>

            <div className="space-y-1.5 text-xs">
              {rods.map((rod, idx) => (
                <div
                  key={rod.id}
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    rod.pinFell
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[11px] text-slate-300">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-200">{rod.name.split(' ')[0]}</span>
                  </div>

                  <span className="font-mono text-xs font-bold">
                    {rod.pinFell ? `${rod.fallTime} ثانية ✓` : 'لم يسقط بعد...'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 p-2 bg-slate-900 rounded-lg text-[11px] text-slate-300 border border-slate-800">
              <b>الترتيب الاستنتاجي: </b>
              <span className="text-amber-400 font-bold">
                النحاس &gt; الألمنيوم &gt; الحديد &gt; الزجاج (عازل)
              </span>
            </div>
          </div>

          {/* Real world Kitchen application */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
              <Info className="w-4 h-4 text-amber-400" />
              لماذا تصنع أواني الطبخ من معادن مختلفة؟
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              تصنع قاعدة مقلاة الطبخ من النحاس أو الألمنيوم لنقل حرارة الموقد إلى الطعام بسرعة وبشكل متجانس، بينما تصنع المقابض من مواد رديئة التوصيل (كالخشب أو البلاستيك المقوى) حتى نتمكن من إمساكها بأمان دون حروق.
            </p>
          </div>

          {/* Science tip */}
          <div className="p-2.5 bg-blue-950/30 border border-blue-500/30 rounded-xl text-[11px] text-blue-200 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              في التوصيل الحراري، تنتقل الطاقة عبر اهتزاز الذرات وتصادم الإلكترونات الحرة دون انتقال المادة نفسها من مكانها.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
