import React, { useState, useEffect } from 'react';
import { Flame, Snowflake, RefreshCw, ArrowDown, CheckCircle2, AlertTriangle, Info, Gauge } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface Props {
  environment: EnvironmentType;
}

export const BallAndRingSim: React.FC<Props> = ({ environment }) => {
  // Apparatus state
  const [ballTemp, setBallTemp] = useState<number>(25); // Celsius
  const [ringTemp, setRingTemp] = useState<number>(25); // Celsius
  const [isHeatingBall, setIsHeatingBall] = useState<boolean>(false);
  const [isHeatingRing, setIsHeatingRing] = useState<boolean>(false);
  const [ballPosition, setBallPosition] = useState<'above' | 'testing' | 'passed' | 'stuck'>('above');
  const [isCoolingInWater, setIsCoolingInWater] = useState<boolean>(false);

  // Physical dimensions (Gravesande apparatus)
  // Base cold diameters: Ring = 30.0 mm, Ball = 29.5 mm
  // Brass linear thermal expansion alpha = 19 x 10^-6 / °C
  const baseBallDiameter = 29.5;
  const baseRingDiameter = 30.0;
  const alphaBrass = 0.000019;

  const currentBallDiameter = Number(
    (baseBallDiameter * (1 + alphaBrass * (ballTemp - 25) * 50)).toFixed(2)
  );
  const currentRingDiameter = Number(
    (baseRingDiameter * (1 + alphaBrass * (ringTemp - 25) * 50)).toFixed(2)
  );

  const canPass = currentBallDiameter < currentRingDiameter;

  // Heating ball timer
  useEffect(() => {
    let interval: any;
    if (isHeatingBall) {
      interval = setInterval(() => {
        setBallTemp((prev) => Math.min(prev + 15, 380));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isHeatingBall]);

  // Heating ring timer
  useEffect(() => {
    let interval: any;
    if (isHeatingRing) {
      interval = setInterval(() => {
        setRingTemp((prev) => Math.min(prev + 15, 380));
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isHeatingRing]);

  // Handle pass test
  const testPassage = () => {
    setBallPosition('testing');
    setTimeout(() => {
      if (canPass) {
        setBallPosition('passed');
      } else {
        setBallPosition('stuck');
      }
    }, 700);
  };

  // Cool ball in water
  const handleCoolInWater = () => {
    setIsHeatingBall(false);
    setIsCoolingInWater(true);
    setBallPosition('above');
    setTimeout(() => {
      setBallTemp(25);
      setIsCoolingInWater(false);
    }, 1000);
  };

  const resetAll = () => {
    setIsHeatingBall(false);
    setIsHeatingRing(false);
    setBallTemp(25);
    setRingTemp(25);
    setBallPosition('above');
  };

  // Visual ball glow color depending on temperature
  const getBallColor = () => {
    if (ballTemp < 100) return '#d97706'; // brass gold
    if (ballTemp < 220) return '#ea580c'; // warm orange
    return '#dc2626'; // glowing hot red
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: Gravesande Apparatus Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative min-h-[440px] overflow-hidden">
          {/* Header */}
          <div className="w-full flex items-center justify-between text-xs px-1">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500" />
              جهاز الحلقة والكرة (Gravesande's Ring & Ball)
            </span>
            <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              مادة الكرة والحلقة: النحاس الأصفر (Brass)
            </span>
          </div>

          {/* Interactive Mechanical Stage */}
          <div className="relative w-full h-[320px] flex items-center justify-center select-none">
            {/* Stand Base & Vertical Rod */}
            <div className="absolute right-12 top-6 bottom-4 flex flex-col items-center">
              <div className="w-3 h-full bg-slate-600 rounded-full shadow-lg" />
              <div className="w-24 h-4 bg-slate-500 rounded-lg shadow-md -mb-2" />
            </div>

            {/* Horizontal Arm holding Ring */}
            <div className="absolute top-[170px] right-12 w-48 h-2.5 bg-slate-500 shadow-md flex items-center">
              {/* The Brass Ring */}
              <div className="absolute -left-12 -top-3 flex flex-col items-center">
                <div
                  className={`w-24 h-8 rounded-[50%] border-4 shadow-xl transition-all duration-300 flex items-center justify-center ${
                    ringTemp > 100 ? 'border-orange-500 shadow-orange-500/30' : 'border-amber-400'
                  }`}
                  style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    transform: `scale(${1 + ((ringTemp - 25) / 350) * 0.1})`,
                  }}
                >
                  <span className="text-[8px] font-mono font-bold text-slate-400">
                    قطر الحلقة: {currentRingDiameter} mm
                  </span>
                </div>
              </div>
            </div>

            {/* Ball on chain suspended */}
            <div
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-700 ease-in-out z-20"
              style={{
                top:
                  ballPosition === 'above'
                    ? '40px'
                    : ballPosition === 'testing'
                    ? '120px'
                    : ballPosition === 'stuck'
                    ? '140px' // sitting on the ring
                    : '220px', // passed through down
              }}
            >
              {/* Chain */}
              <div className="w-1 h-20 bg-slate-400 shadow flex flex-col justify-between items-center">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                ))}
              </div>

              {/* The Ball */}
              <div className="relative">
                <div
                  className="rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center border-2 border-white/40"
                  style={{
                    width: `${Math.min(50 * (currentBallDiameter / baseBallDiameter), 65)}px`,
                    height: `${Math.min(50 * (currentBallDiameter / baseBallDiameter), 65)}px`,
                    backgroundColor: getBallColor(),
                    boxShadow: ballTemp > 150 ? `0 0 25px ${getBallColor()}` : '0 10px 15px rgba(0,0,0,0.5)',
                  }}
                >
                  {isHeatingBall && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-orange-500/20" />
                  )}
                </div>

                {/* Steam effect if cooling */}
                {isCoolingInWater && (
                  <div className="absolute -top-8 -left-4 text-xs font-bold text-sky-200 animate-bounce">
                    💨 تشششش! (بخار التبريد)
                  </div>
                )}
              </div>
            </div>

            {/* Bunsen Burner Flame below ball when heating */}
            {isHeatingBall && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 animate-pulse">
                {/* Flame tips */}
                <div className="w-8 h-14 bg-gradient-to-t from-blue-500 via-amber-400 to-red-500 rounded-full blur-[2px]" />
                {/* Burner Tube */}
                <div className="w-5 h-16 bg-slate-700 border-x border-slate-500" />
                <div className="w-16 h-3 bg-slate-800 rounded-md" />
              </div>
            )}

            {/* Water Cooling Basin */}
            <div className="absolute bottom-2 left-6 bg-cyan-950/60 border-2 border-cyan-500/40 rounded-xl p-2 flex items-center gap-2 shadow-lg">
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs">
                💧
              </div>
              <span className="text-[10px] text-cyan-200 font-bold">حوض الماء البارد (25°C)</span>
            </div>

            {/* Status Feedback overlay banner */}
            <div className="absolute top-4 left-4 z-30">
              {ballPosition === 'stuck' && (
                <div className="bg-red-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 border border-red-300 animate-bounce">
                  <AlertTriangle className="w-4 h-4" />
                  <span>الكرة علقت! تمدد حجمها بالحرارة ولم تستطع المرور.</span>
                </div>
              )}
              {ballPosition === 'passed' && (
                <div className="bg-emerald-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-1.5 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>عبرت الكرة بنجاح من الحلقة!</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls Footer */}
          <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800">
            {/* Toggle Heat Ball */}
            <button
              onClick={() => {
                setIsHeatingBall(!isHeatingBall);
                if (ballPosition !== 'above') setBallPosition('above');
              }}
              className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                isHeatingBall
                  ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isHeatingBall ? 'إطفاء اللهب' : 'تسخين الكرة باللهب'}</span>
            </button>

            {/* Test Passing through ring */}
            <button
              onClick={testPassage}
              className="py-2 px-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <ArrowDown className="w-4 h-4" />
              <span>محاولة تمرير الكرة</span>
            </button>

            {/* Cool in water */}
            <button
              onClick={handleCoolInWater}
              className="py-2 px-3 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/60 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Snowflake className="w-4 h-4 text-cyan-400" />
              <span>تبريد بالماء البارد</span>
            </button>

            {/* Reset */}
            <button
              onClick={resetAll}
              className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة التجربة</span>
            </button>
          </div>
        </div>

        {/* Right: Real-time Micrometer Gauges, Physics Law, and Real-world link */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Real-time Measurements */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 mb-2.5 flex items-center gap-1.5">
              <Gauge className="w-4 h-4" />
              قياسات الميكروميتر ودرجة الحرارة:
            </h4>

            <div className="space-y-2 text-xs">
              {/* Ball stats */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">حرارة وقطر الكرة المعدنية:</span>
                  <span className="font-mono text-xs text-amber-400 font-bold">{ballTemp} °C</span>
                </div>
                <div className="text-left font-mono">
                  <span className={`text-sm font-black ${ballTemp > 100 ? 'text-red-400' : 'text-slate-200'}`}>
                    {currentBallDiameter} mm
                  </span>
                  <span className="text-[10px] text-slate-400 block">الابتدائي: 29.50 mm</span>
                </div>
              </div>

              {/* Ring stats */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-[11px] block">حرارة وقطر فتحة الحلقة:</span>
                  <span className="font-mono text-xs text-sky-400 font-bold">{ringTemp} °C</span>
                </div>
                <div className="text-left font-mono">
                  <span className="text-sm font-black text-slate-200">{currentRingDiameter} mm</span>
                  <span className="text-[10px] text-slate-400 block">ثابت: 30.00 mm</span>
                </div>
              </div>

              {/* Comparison Check */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  canPass
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-red-950/40 border-red-500/40 text-red-200'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">
                    شرط العبور: قطر الكرة &lt; قطر الحلقة
                  </span>
                  <span className="text-[11px] font-mono">
                    {currentBallDiameter} mm {canPass ? '<' : '>'} {currentRingDiameter} mm
                  </span>
                </div>
                <span className="font-black text-xs px-2 py-1 rounded bg-black/40">
                  {canPass ? 'تمر بسهولة ✓' : 'تعلق ولا تمر ✗'}
                </span>
              </div>
            </div>
          </div>

          {/* Heat Ring Option (Scientific Curiosity) */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-200">
                سؤال علمي ذكي: ماذا لو سخنا الحلقة أيضاً؟
              </span>
              <button
                onClick={() => setIsHeatingRing(!isHeatingRing)}
                className={`text-[10px] font-bold px-2 py-1 rounded border transition ${
                  isHeatingRing
                    ? 'bg-orange-500/30 text-orange-300 border-orange-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {isHeatingRing ? 'إيقاف تسخين الحلقة' : 'تسخين الحلقة المعدنية'}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              عند تسخين الحلقة يتمدد قطر فتحتها أيضاً، مما يسمح للكرة الساخنة بالمرور مجدداً! وهذا يثبت أن التمدد يشمل جميع أجزاء الفتحات المعدنية.
            </p>
          </div>

          {/* Real world link box */}
          <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <b className="block text-amber-300">أين نرى ذلك في حياتنا اليومية؟</b>
              <span>
                في الصيف الحار، تتمدد قضبان السكك الحديدية وأسلاك الكهرباء في الشارع، لذا يترك المهندسون فواصل تمدد بين أجزائها لمنع التوائها وانحنائها.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
