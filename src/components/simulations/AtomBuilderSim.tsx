import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Minus, RefreshCw, Zap, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface ElementInfo {
  z: number;
  symbol: string;
  name: string;
  nameEn: string;
  defaultNeutrons: number;
  period: number;
  group: number;
  realWorldUse: string;
}

const ELEMENTS_TABLE: Record<number, ElementInfo> = {
  1: { z: 1, symbol: 'H', name: 'الهيدروجين', nameEn: 'Hydrogen', defaultNeutrons: 0, period: 1, group: 1, realWorldUse: 'أخف الغازات ووقود النجوم والماء في الطبيعة.' },
  2: { z: 2, symbol: 'He', name: 'الهيليوم', nameEn: 'Helium', defaultNeutrons: 2, period: 1, group: 18, realWorldUse: 'غاز خامل آمن يستخدم في ملء بالونات الاحتفالات.' },
  3: { z: 3, symbol: 'Li', name: 'الليثيوم', nameEn: 'Lithium', defaultNeutrons: 4, period: 2, group: 1, realWorldUse: 'معدن قلوي خفيف تصنع منه بطاريات الهواتف الذكية.' },
  4: { z: 4, symbol: 'Be', name: 'البريليوم', nameEn: 'Beryllium', defaultNeutrons: 5, period: 2, group: 2, realWorldUse: 'معدن صلب وخفيف يستعمل في صناعة مرايا التلسكوبات الفضائية.' },
  5: { z: 5, symbol: 'B', name: 'البورون', nameEn: 'Boron', defaultNeutrons: 6, period: 2, group: 13, realWorldUse: 'يدخل في صناعة زجاج البايركس المقاوم للحرارة بالمطبخ.' },
  6: { z: 6, symbol: 'C', name: 'الكربون', nameEn: 'Carbon', defaultNeutrons: 6, period: 2, group: 14, realWorldUse: 'أساس الحياة والمركبات العضوية وألماس الفحم وأشجار الحديقة.' },
  7: { z: 7, symbol: 'N', name: 'النيتروجين', nameEn: 'Nitrogen', defaultNeutrons: 7, period: 2, group: 15, realWorldUse: 'يشكل 78% من هواء الغلاف الجوي الذي نتنفسه.' },
  8: { z: 8, symbol: 'O', name: 'الأكسجين', nameEn: 'Oxygen', defaultNeutrons: 8, period: 2, group: 16, realWorldUse: 'ضروري لتنفس الكائنات الحية والاحتراق في المنازل.' },
  9: { z: 9, symbol: 'F', name: 'الفلور', nameEn: 'Fluorine', defaultNeutrons: 10, period: 2, group: 17, realWorldUse: 'يدخل في معجون الأسنان لحمايتها من التسوس.' },
  10: { z: 10, symbol: 'Ne', name: 'النيون', nameEn: 'Neon', defaultNeutrons: 10, period: 2, group: 18, realWorldUse: 'غاز خامل يضيء باللون البرتقالي الساطع في لوحات الشوارع.' },
  11: { z: 11, symbol: 'Na', name: 'الصوديوم', nameEn: 'Sodium', defaultNeutrons: 12, period: 3, group: 1, realWorldUse: 'معدن نشط يتحد مع الكلور ليكوّن ملح الطعام المنزلي.' },
  12: { z: 12, symbol: 'Mg', name: 'المغنيسيوم', nameEn: 'Magnesium', defaultNeutrons: 12, period: 3, group: 2, realWorldUse: 'معدن خفيف يدخل في ألعاب الأعياد النارية وهياكل السيارات.' },
  13: { z: 13, symbol: 'Al', name: 'الألمنيوم', nameEn: 'Aluminum', defaultNeutrons: 14, period: 3, group: 13, realWorldUse: 'يصنع منه ورق القصدير وأواني الطهي وإطارات النوافذ.' },
  14: { z: 14, symbol: 'Si', name: 'السيليكون', nameEn: 'Silicon', defaultNeutrons: 14, period: 3, group: 14, realWorldUse: 'الركيزة الأساسية لصناعة الرقائق الإلكترونية والكمبيوتر.' },
  15: { z: 15, symbol: 'P', name: 'الفوسفور', nameEn: 'Phosphorus', defaultNeutrons: 16, period: 3, group: 15, realWorldUse: 'يدخل في رؤوس أعواد الثقاب وأسمدة نباتات الحديقة.' },
  16: { z: 16, symbol: 'S', name: 'الكبريت', nameEn: 'Sulfur', defaultNeutrons: 16, period: 3, group: 16, realWorldUse: 'معدن أصفر يدخل في صناعة الأدوية والبارود والبطاريات.' },
  17: { z: 17, symbol: 'Cl', name: 'الكلور', nameEn: 'Chlorine', defaultNeutrons: 18, period: 3, group: 17, realWorldUse: 'غاز أصفر مخضر يعقم مياه المسابح ومياه الشرب بالمدينة.' },
  18: { z: 18, symbol: 'Ar', name: 'الأرجون', nameEn: 'Argon', defaultNeutrons: 22, period: 3, group: 18, realWorldUse: 'غاز خامل يملأ المصابيح الكهربائية المتوهجة لحماية الفتيل.' },
};

interface Props {
  environment: EnvironmentType;
}

export const AtomBuilderSim: React.FC<Props> = ({ environment }) => {
  // Protons, Neutrons, Electrons counts
  const [protons, setProtons] = useState<number>(6); // Carbon by default
  const [neutrons, setNeutrons] = useState<number>(6);
  const [electrons, setElectrons] = useState<number>(6);

  // Derived physics
  const atomicNumber = protons; // Z
  const massNumber = protons + neutrons; // A
  const netCharge = protons - electrons; // Positive, 0, or Negative

  // Current Element lookup
  const currentElement = ELEMENTS_TABLE[atomicNumber] || {
    z: atomicNumber,
    symbol: atomicNumber > 0 ? `E${atomicNumber}` : '?',
    name: atomicNumber > 0 ? `عنصر افتراضي ${atomicNumber}` : 'فراغ ذري',
    nameEn: 'Element',
    defaultNeutrons: atomicNumber,
    period: 1,
    group: 1,
    realWorldUse: 'عنصر قيد البناء والتكوين المخبري.',
  };

  // Nuclear stability condition
  const isStable =
    atomicNumber === 0
      ? true
      : atomicNumber === 1
      ? neutrons <= 1
      : neutrons >= atomicNumber - 1 && neutrons <= atomicNumber + Math.ceil(atomicNumber * 0.35);

  // Calculate electron distribution across shells:
  // K shell: max 2
  // L shell: max 8
  // M shell: max 8
  const shellK = Math.min(electrons, 2);
  const shellL = Math.min(Math.max(0, electrons - 2), 8);
  const shellM = Math.min(Math.max(0, electrons - 10), 8);

  // Preset quick jump to curriculum elements
  const selectPreset = (z: number) => {
    const elem = ELEMENTS_TABLE[z];
    if (elem) {
      setProtons(elem.z);
      setNeutrons(elem.defaultNeutrons);
      setElectrons(elem.z); // Neutral atom
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: Interactive Rutherford-Bohr Atom Canvas Display */}
        <div className="lg:col-span-7 flex flex-col items-center justify-between p-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative min-h-[420px] overflow-hidden">
          {/* Header indicator bar */}
          <div className="w-full flex items-center justify-between text-xs px-2 mb-1 z-20">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              نموذج رذرفورد - بور المداري للذرة
            </span>
            {/* Charge Badge */}
            <span
              className={`px-2 py-0.5 rounded-full font-bold text-[11px] border flex items-center gap-1 ${
                netCharge === 0
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : netCharge > 0
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>
                {netCharge === 0
                  ? 'ذرة متعادلة كهربائياً (0)'
                  : netCharge > 0
                  ? `أيون موجب (+${netCharge})`
                  : `أيون سالب (${netCharge})`}
              </span>
            </span>
          </div>

          {/* Atom Graphic Visualization */}
          <div className="relative w-full h-[320px] flex items-center justify-center select-none">
            {/* SVG Orbital Shells */}
            <svg viewBox="-180 -180 360 360" className="w-[310px] h-[310px]">
              {/* Shell M (Outer, radius 140) */}
              {electrons > 10 && (
                <circle
                  cx="0"
                  cy="0"
                  r="140"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
              )}

              {/* Shell L (Middle, radius 95) */}
              {electrons > 2 && (
                <circle
                  cx="0"
                  cy="0"
                  r="95"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.5"
                />
              )}

              {/* Shell K (Inner, radius 55) */}
              {electrons > 0 && (
                <circle
                  cx="0"
                  cy="0"
                  r="55"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />
              )}

              {/* Central Nucleus (Protons + Neutrons cluster) */}
              <g className="cursor-pointer">
                {/* Nucleus Background Glow */}
                <circle cx="0" cy="0" r="28" fill="rgba(239, 68, 68, 0.15)" filter="blur(6px)" />

                {/* Nucleus Boundary */}
                <circle
                  cx="0"
                  cy="0"
                  r="24"
                  fill="rgba(15, 23, 42, 0.9)"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />

                {/* Draw Nucleons */}
                {Array.from({ length: Math.min(protons + neutrons, 24) }).map((_, idx) => {
                  const isProton = idx < protons;
                  const angle = (idx * 137.5 * Math.PI) / 180;
                  const dist = Math.min(16, 4 + Math.sqrt(idx) * 3);
                  const nx = Math.cos(angle) * dist;
                  const ny = Math.sin(angle) * dist;

                  return (
                    <circle
                      key={idx}
                      cx={nx}
                      cy={ny}
                      r="4"
                      fill={isProton ? '#ef4444' : '#3b82f6'}
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                  );
                })}

                {/* Center text if nucleus is empty or very dense */}
                {protons === 0 && (
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    نواة فارغة
                  </text>
                )}
              </g>

              {/* Render Electrons on Orbitals */}
              {/* Shell K Electrons (up to 2) */}
              {Array.from({ length: shellK }).map((_, i) => {
                const angle = (i * (360 / shellK) * Math.PI) / 180;
                const ex = Math.cos(angle) * 55;
                const ey = Math.sin(angle) * 55;
                return (
                  <g key={`k-${i}`}>
                    <circle cx={ex} cy={ey} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1" />
                    <text x={ex} y={ey + 2.5} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">-</text>
                  </g>
                );
              })}

              {/* Shell L Electrons (up to 8) */}
              {Array.from({ length: shellL }).map((_, i) => {
                const angle = (i * (360 / shellL) * Math.PI) / 180;
                const ex = Math.cos(angle) * 95;
                const ey = Math.sin(angle) * 95;
                return (
                  <g key={`l-${i}`}>
                    <circle cx={ex} cy={ey} r="4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                    <text x={ex} y={ey + 2.5} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">-</text>
                  </g>
                );
              })}

              {/* Shell M Electrons (up to 8) */}
              {Array.from({ length: shellM }).map((_, i) => {
                const angle = (i * (360 / shellM) * Math.PI) / 180;
                const ex = Math.cos(angle) * 140;
                const ey = Math.sin(angle) * 140;
                return (
                  <g key={`m-${i}`}>
                    <circle cx={ex} cy={ey} r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1" />
                    <text x={ex} y={ey + 2.5} textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">-</text>
                  </g>
                );
              })}
            </svg>

            {/* Orbit Label Legend */}
            <div className="absolute bottom-2 left-2 flex flex-col gap-1 text-[10px] font-mono bg-slate-900/90 p-2 rounded-lg border border-slate-800">
              <span className="text-emerald-400">المدار K (الأول): {shellK} / 2 e⁻</span>
              <span className="text-sky-400">المدار L (الثاني): {shellL} / 8 e⁻</span>
              <span className="text-purple-400">المدار M (الثالث): {shellM} / 8 e⁻</span>
            </div>

            {/* Nucleus stability indicator */}
            <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[11px] bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
              {isStable ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">النواة مستقرة</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300 font-bold">نظير غير مستقر (مشع)</span>
                </>
              )}
            </div>
          </div>

          {/* Particle dispenser toolbar */}
          <div className="w-full grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-800">
            {/* Protons dispenser */}
            <div className="p-2 rounded-xl bg-slate-950/80 border border-red-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-red-400 block">بروتونات (p⁺)</span>
                <span className="text-xs font-mono font-bold text-white">{protons}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setProtons((p) => Math.max(0, p - 1))}
                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setProtons((p) => Math.min(18, p + 1))}
                  className="w-6 h-6 rounded-md bg-red-600 hover:bg-red-500 text-white flex items-center justify-center font-bold text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Neutrons dispenser */}
            <div className="p-2 rounded-xl bg-slate-950/80 border border-blue-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 block">نيوترونات (n⁰)</span>
                <span className="text-xs font-mono font-bold text-white">{neutrons}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setNeutrons((n) => Math.max(0, n - 1))}
                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setNeutrons((n) => Math.min(24, n + 1))}
                  className="w-6 h-6 rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center font-bold text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Electrons dispenser */}
            <div className="p-2 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 block">إلكترونات (e⁻)</span>
                <span className="text-xs font-mono font-bold text-white">{electrons}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setElectrons((e) => Math.max(0, e - 1))}
                  className="w-6 h-6 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold text-xs"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setElectrons((e) => Math.min(18, e + 1))}
                  className="w-6 h-6 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold text-xs"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Periodic Table Card & Atomic Calculations */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3">
          {/* Identity Card from Periodic Table */}
          <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 p-4 rounded-xl border border-purple-500/30">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider block">
                  بطاقة العنصر من الجدول الدوري
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                  <span>{currentElement.name}</span>
                  <span className="text-xs font-mono text-purple-300 font-normal">({currentElement.nameEn})</span>
                </h3>
              </div>

              {/* Chemical Symbol Big Box */}
              <div className="w-14 h-14 rounded-xl bg-purple-900/60 border-2 border-purple-400 flex flex-col items-center justify-center shadow-lg">
                <span className="text-[10px] font-mono text-purple-200">{atomicNumber}</span>
                <span className="text-xl font-black text-white leading-none">{currentElement.symbol}</span>
                <span className="text-[9px] font-mono text-purple-300">{massNumber}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-purple-800/40 text-xs">
              <div className="p-2 bg-slate-950/70 rounded-lg">
                <span className="text-slate-400 text-[11px] block">العدد الذري (Z):</span>
                <span className="font-mono text-base font-extrabold text-cyan-400">{atomicNumber}</span>
                <span className="text-[10px] text-slate-400 block">= عدد البروتونات</span>
              </div>

              <div className="p-2 bg-slate-950/70 rounded-lg">
                <span className="text-slate-400 text-[11px] block">عدد الكتلة (A):</span>
                <span className="font-mono text-base font-extrabold text-amber-400">{massNumber}</span>
                <span className="text-[10px] text-slate-400 block">= بروتونات + نيوترونات</span>
              </div>
            </div>

            {/* Real world snippet */}
            <div className="mt-3 p-2 bg-slate-950/60 rounded-lg text-[11px] text-slate-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400 shrink-0" />
              <span>{currentElement.realWorldUse}</span>
            </div>
          </div>

          {/* Quick Preset Selector for Curriculum Elements */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300 block mb-2">
              عناصر منهج الأول المتوسط (اختر للمشاهدة المباشرة):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 text-xs">
              {[
                { z: 1, name: 'هيدروجين (H)' },
                { z: 2, name: 'هيليوم (He)' },
                { z: 6, name: 'كربون (C)' },
                { z: 7, name: 'نيتروجين (N)' },
                { z: 8, name: 'أكسجين (O)' },
                { z: 10, name: 'نيون (Ne)' },
                { z: 11, name: 'صوديوم (Na)' },
                { z: 13, name: 'ألمنيوم (Al)' },
              ].map((item) => (
                <button
                  key={item.z}
                  onClick={() => selectPreset(item.z)}
                  className={`py-1.5 px-2 rounded-lg border text-center transition font-semibold truncate ${
                    atomicNumber === item.z
                      ? 'bg-purple-500/20 border-purple-400 text-purple-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Reset button */}
          <button
            onClick={() => selectPreset(6)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الذرة (الكربون C-6)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
