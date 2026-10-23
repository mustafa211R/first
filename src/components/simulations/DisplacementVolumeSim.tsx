import React, { useState } from 'react';
import { Beaker, ArrowDown, ArrowUp, RefreshCw, CheckCircle2, HelpCircle, Layers, Sliders } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface IrregularItem {
  id: string;
  name: string;
  volume: number; // in mL (or cm3)
  mass: number; // in grams
  color: string;
  shapePath: string;
  realWorldDesc: string;
}

const PRESET_OBJECTS: IrregularItem[] = [
  {
    id: 'stone',
    name: 'حجر طبيعي غير منتظم',
    volume: 24,
    mass: 62.4,
    color: '#78716c',
    shapePath: 'M 10,20 Q 25,5 45,15 T 70,35 Q 80,60 55,75 T 20,65 Q 5,45 10,20 Z',
    realWorldDesc: 'حجر تم التقاطه من حديقة المدرسة، لا يمكن قياس أبعاده بمسطرة هندسية.',
  },
  {
    id: 'key',
    name: 'مفتاح باب نحاسي',
    volume: 14,
    mass: 119.0,
    color: '#d97706',
    shapePath: 'M 35,5 C 45,5 55,15 55,25 C 55,32 50,38 43,42 L 43,80 L 32,80 L 32,65 L 22,65 L 22,55 L 32,55 L 32,42 C 25,38 20,32 20,25 C 20,15 30,5 35,5 Z',
    realWorldDesc: 'مفتاح باب المنزل، شكله متعرج وطريقة الإزاحة هي الطريقة الوحيدة لحجمه.',
  },
  {
    id: 'padlock',
    name: 'قفل حديدي قديم',
    volume: 32,
    mass: 252.8,
    color: '#475569',
    shapePath: 'M 25,35 L 25,20 C 25,8 55,8 55,20 L 55,35 L 68,35 L 68,75 L 12,75 L 12,35 Z',
    realWorldDesc: 'قفل خزانة سميك، كتلته مرتفعة وحجمه غير منتظم.',
  },
  {
    id: 'potato',
    name: 'حبة بطاطا صغيرة',
    volume: 42,
    mass: 44.1,
    color: '#b45309',
    shapePath: 'M 20,15 Q 50,5 65,30 Q 75,60 50,75 Q 20,80 15,50 Q 10,25 20,15 Z',
    realWorldDesc: 'خضار من المطبخ بشكل متعرج، تستخدم لتوضيح مفهوم الإزاحة بحجم كبير.',
  },
];

interface Props {
  environment: EnvironmentType;
}

export const DisplacementVolumeSim: React.FC<Props> = ({ environment }) => {
  const [initialWater, setInitialWater] = useState<number>(50); // V1 in mL
  const [selectedItem, setSelectedItem] = useState<IrregularItem>(PRESET_OBJECTS[0]);
  const [isSubmerged, setIsSubmerged] = useState<boolean>(false);
  const [customMode, setCustomMode] = useState<boolean>(false);
  const [customVolume, setCustomVolume] = useState<number>(25);
  const [customMass, setCustomMass] = useState<number>(65);

  const activeVolume = customMode ? customVolume : selectedItem.volume;
  const activeMass = customMode ? customMass : selectedItem.mass;

  // Final water level (V2)
  const currentWaterLevel = isSubmerged ? initialWater + activeVolume : initialWater;
  const isOverflowing = currentWaterLevel > 100;

  // Cylinder visual calculation (0 to 100 mL mapped to cylinder height)
  const cylinderHeight = 280;
  const waterHeightPx = (Math.min(currentWaterLevel, 100) / 100) * (cylinderHeight - 30);

  return (
    <div className="flex flex-col gap-4">
      {/* Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: Interactive Apparatus Visual (Cylinder + String + Object) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative overflow-hidden min-h-[380px]">
          {/* Cylinder Top Title & Warning */}
          <div className="w-full flex items-center justify-between text-xs px-2 mb-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Beaker className="w-4 h-4 text-cyan-400" />
              مخبار مدرج سعة 100 mL
            </span>
            {isOverflowing && (
              <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded text-[11px] animate-pulse">
                تحذير: السائل فاض عن سعة المخبار!
              </span>
            )}
          </div>

          {/* Main Visual: Graduated Cylinder and Object suspended on cord */}
          <div className="relative w-64 h-[320px] flex items-end justify-center select-none">
            {/* The Glass Cylinder */}
            <div className="relative w-28 h-[280px] border-x-4 border-b-4 border-slate-600/70 bg-sky-950/20 backdrop-blur-sm rounded-b-2xl shadow-inner flex flex-col justify-end overflow-hidden">
              {/* Measurement Ticks (0 to 100 mL) */}
              <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-2 pointer-events-none text-[9px] font-mono font-bold text-slate-400 z-20">
                {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10].map((val) => (
                  <div key={val} className="flex items-center gap-1 justify-end">
                    <span className={val === currentWaterLevel ? 'text-amber-400 font-extrabold text-[11px]' : ''}>
                      {val}
                    </span>
                    <div
                      className={`h-0.5 ${
                        val % 20 === 0
                          ? 'w-3.5 bg-slate-300'
                          : 'w-2 bg-slate-500'
                      } ${val === currentWaterLevel ? 'bg-amber-400 w-4' : ''}`}
                    />
                  </div>
                ))}
              </div>

              {/* Water Fill with Meniscus and Waves */}
              <div
                className="w-full bg-gradient-to-t from-cyan-600/70 via-sky-500/60 to-cyan-400/80 transition-all duration-700 ease-out relative flex items-start justify-center"
                style={{ height: `${waterHeightPx}px` }}
              >
                {/* Surface Meniscus Line */}
                <div className="w-full h-3 border-t-2 border-cyan-200/90 rounded-[50%] -mt-1 shadow-md bg-cyan-300/30" />

                {/* Submerged object inside water */}
                {isSubmerged && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center transition-all duration-500">
                    {/* Hanging String inside water */}
                    <div className="w-0.5 h-16 bg-amber-200/80 -mt-16" />
                    {/* SVG Object shape */}
                    <svg viewBox="0 0 80 80" className="w-12 h-12 drop-shadow-lg">
                      <path d={selectedItem.shapePath} fill={selectedItem.color} stroke="#1e293b" strokeWidth="2" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Cylinder Solid Base Stand */}
            <div className="absolute -bottom-2 w-36 h-3 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-lg shadow-md z-10" />

            {/* Floating / Suspended Object above water when NOT submerged */}
            {!isSubmerged && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer transition-all duration-500 z-30 group"
                   onClick={() => setIsSubmerged(true)}>
                {/* String above */}
                <div className="w-0.5 h-12 bg-amber-400/80 group-hover:bg-amber-300" />
                {/* Object with bounce effect */}
                <div className="relative animate-bounce">
                  <svg viewBox="0 0 80 80" className="w-14 h-14 drop-shadow-xl">
                    <path d={selectedItem.shapePath} fill={selectedItem.color} stroke="#334155" strokeWidth="2" />
                  </svg>
                  <span className="absolute -top-6 -right-8 bg-slate-900 text-amber-400 text-[10px] px-2 py-0.5 rounded border border-amber-500/40 whitespace-nowrap">
                    انقر للغمر في الماء ↓
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger Controls */}
          <div className="mt-3 flex gap-2">
            {!isSubmerged ? (
              <button
                onClick={() => setIsSubmerged(true)}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition active:scale-95"
              >
                <ArrowDown className="w-4 h-4" />
                <span>غمر الجسم برفق في المخبار</span>
              </button>
            ) : (
              <button
                onClick={() => setIsSubmerged(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 transition active:scale-95"
              >
                <ArrowUp className="w-4 h-4" />
                <span>سحب الجسم من المخبار</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsSubmerged(false);
                setInitialWater(50);
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition"
              title="إعادة ضبط"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Real-time Physics Measurements & Mathematical Formula Card */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3">
          {/* Live Data Display Board */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              سجل القياسات المخبرية المباشرة:
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">مستوى الماء الأولي (V₁):</span>
                <span className="text-base font-mono font-bold text-sky-400">{initialWater} mL</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">قبل وضع الجسم</span>
              </div>

              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[11px]">مستوى الماء النهائي (V₂):</span>
                <span className={`text-base font-mono font-bold ${isSubmerged ? 'text-amber-400' : 'text-slate-400'}`}>
                  {isSubmerged ? `${currentWaterLevel} mL` : '---'}
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  {isSubmerged ? 'بعد الغمر الكامل' : 'في انتظار الغمر'}
                </span>
              </div>
            </div>

            {/* Subtraction and Output Box */}
            <div className="mt-3 p-3 bg-gradient-to-r from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-cyan-300 font-bold">حجم الجسم المحسوب (V = V₂ - V₁):</span>
                <span className="font-mono text-base font-extrabold text-cyan-200">
                  {isSubmerged ? `${activeVolume} cm³` : '0 cm³'}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center justify-center gap-2">
                <span>{isSubmerged ? `${currentWaterLevel} mL` : 'V₂'}</span>
                <span>-</span>
                <span>{initialWater} mL</span>
                <span>=</span>
                <span className="text-cyan-300 font-bold">{isSubmerged ? `${activeVolume} mL = ${activeVolume} cm³` : '?'}</span>
              </div>

              {/* Bonus Density calculation */}
              <div className="mt-2.5 pt-2 border-t border-cyan-800/40 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  كتلة الجسم (m): <b className="text-slate-200">{activeMass} g</b>
                </span>
                <span className="text-amber-300 font-bold text-[11px]">
                  الكثافة (ρ = m/V):{' '}
                  <b className="font-mono text-xs">
                    {(activeMass / activeVolume).toFixed(2)} g/cm³
                  </b>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Object Chooser or Custom Adjuster */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                اختر جسماً غير منتظم للتجربة:
              </span>
              <button
                onClick={() => setCustomMode(!customMode)}
                className={`text-[10px] px-2 py-0.5 rounded border transition flex items-center gap-1 ${
                  customMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>{customMode ? 'وضع العناصر الجاهزة' : 'تخصيص جسم حر'}</span>
              </button>
            </div>

            {!customMode ? (
              <div className="grid grid-cols-2 gap-2">
                {PRESET_OBJECTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedItem(item);
                      setIsSubmerged(false);
                    }}
                    className={`p-2 rounded-xl border text-right transition flex items-center gap-2 ${
                      selectedItem.id === item.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      <svg viewBox="0 0 80 80" className="w-6 h-6">
                        <path d={item.shapePath} fill={item.color} />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-slate-200">{item.name}</p>
                      <p className="text-[10px] font-mono text-cyan-400">{item.volume} cm³ | {item.mass} g</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>حجم الجسم المخصص:</span>
                    <span className="font-mono text-cyan-400 font-bold">{customVolume} cm³</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={45}
                    value={customVolume}
                    onChange={(e) => {
                      setCustomVolume(Number(e.target.value));
                      setIsSubmerged(false);
                    }}
                    className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-slate-300 mb-1">
                    <span>كتلة الجسم المخصص:</span>
                    <span className="font-mono text-amber-400 font-bold">{customMass} g</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={200}
                    value={customMass}
                    onChange={(e) => setCustomMass(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Initial Water Level Adjuster */}
            <div className="mt-3 pt-2.5 border-t border-slate-800">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>تعديل مستوى الماء الأولي بالمخبار (V₁):</span>
                <span className="font-mono text-sky-400 font-bold">{initialWater} mL</span>
              </div>
              <input
                type="range"
                min={30}
                max={70}
                step={5}
                value={initialWater}
                disabled={isSubmerged}
                onChange={(e) => setInitialWater(Number(e.target.value))}
                className="w-full accent-sky-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
