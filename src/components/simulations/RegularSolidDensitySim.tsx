import React, { useState } from 'react';
import { Scale, Ruler, RefreshCw, Award, CheckCircle2, ChevronRight, Calculator, Sparkles } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface MaterialOption {
  id: string;
  name: string;
  density: number; // g/cm3
  color: string;
  gradient: string;
  shadow: string;
  description: string;
}

const MATERIALS: MaterialOption[] = [
  {
    id: 'iron',
    name: 'حديد نقي (Iron)',
    density: 7.8,
    color: '#64748b',
    gradient: 'from-slate-400 via-slate-500 to-slate-700',
    shadow: 'shadow-slate-500/30',
    description: 'يستخدم في البناء والسيارات، ثقيل ومغناطيسي.',
  },
  {
    id: 'copper',
    name: 'نحاس أحمر (Copper)',
    density: 8.9,
    color: '#ea580c',
    gradient: 'from-amber-600 via-orange-600 to-amber-800',
    shadow: 'shadow-orange-500/30',
    description: 'معدن محمر عالي التوصيل للكهرباء والحرارة.',
  },
  {
    id: 'aluminum',
    name: 'ألمنيوم (Aluminum)',
    density: 2.7,
    color: '#cbd5e1',
    gradient: 'from-slate-200 via-slate-300 to-slate-400',
    shadow: 'shadow-slate-300/30',
    description: 'معدن خفيف جداً يستخدم في الطائرات وأواني الطهي.',
  },
  {
    id: 'wood',
    name: 'خشب طبيعي (Wood)',
    density: 0.7,
    color: '#b45309',
    gradient: 'from-amber-700 via-amber-800 to-yellow-900',
    shadow: 'shadow-amber-700/30',
    description: 'خفيف يطفو على الماء، يصنع منه الأثاث.',
  },
  {
    id: 'gold',
    name: 'ذهب نقي 24K (Gold)',
    density: 19.3,
    color: '#eab308',
    gradient: 'from-yellow-300 via-amber-400 to-yellow-600',
    shadow: 'shadow-yellow-400/40',
    description: 'أثقل المعادن المألوفة وأعلاها قيمة ونقاء.',
  },
];

interface Props {
  environment: EnvironmentType;
}

export const RegularSolidDensitySim: React.FC<Props> = ({ environment }) => {
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialOption>(MATERIALS[0]);
  const [length, setLength] = useState<number>(3.0); // cm
  const [width, setWidth] = useState<number>(2.0); // cm
  const [height, setHeight] = useState<number>(2.0); // cm
  const [isPlacedOnScale, setIsPlacedOnScale] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [mysteryMode, setMysteryMode] = useState<boolean>(false);
  const [mysteryGuess, setMysteryGuess] = useState<string>('');
  const [mysteryResult, setMysteryResult] = useState<'correct' | 'wrong' | null>(null);

  // Physical calculations
  const volume = Number((length * width * height).toFixed(2)); // cm3
  const calculatedMass = Number((selectedMaterial.density * volume).toFixed(1)); // grams

  // Visual scaling of 3D-like block
  const blockScaleX = 25 * length;
  const blockScaleY = 20 * height;
  const blockScaleZ = 15 * width;

  const handleMysteryGuess = (matId: string) => {
    setMysteryGuess(matId);
    if (matId === selectedMaterial.id) {
      setMysteryResult('correct');
    } else {
      setMysteryResult('wrong');
    }
  };

  const startNewMystery = () => {
    const randomMat = MATERIALS[Math.floor(Math.random() * MATERIALS.length)];
    setSelectedMaterial(randomMat);
    setLength(Math.floor(Math.random() * 3 + 2));
    setWidth(Math.floor(Math.random() * 3 + 2));
    setHeight(Math.floor(Math.random() * 3 + 2));
    setMysteryMode(true);
    setMysteryGuess('');
    setMysteryResult(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: Workbench with Sensitive Digital Balance & Isometric Block */}
        <div className="lg:col-span-6 flex flex-col items-center justify-between p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-xl border border-slate-800 relative min-h-[420px] overflow-hidden">
          {/* Header toolbar */}
          <div className="w-full flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-400" />
              الميزان الحساس الرقمي والمسطرة المترية
            </span>
            <button
              onClick={() => {
                if (mysteryMode) {
                  setMysteryMode(false);
                  setMysteryResult(null);
                } else {
                  startNewMystery();
                }
              }}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition ${
                mysteryMode
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{mysteryMode ? 'إلغاء وضع التحدي' : 'تحدي استكشاف المعدن المجهول!'}</span>
            </button>
          </div>

          {/* Isometric 3D Model Stage */}
          <div className="relative w-full h-56 flex flex-col items-center justify-center my-2">
            {/* Virtual Ruler placed next to block */}
            {showRuler && (
              <div className="absolute top-2 left-4 w-44 h-8 bg-amber-100 rounded border border-amber-400 shadow-md flex flex-col justify-between px-1 py-0.5 select-none text-[8px] font-mono text-amber-950 z-20">
                <div className="flex justify-between border-b border-amber-400/60 pb-0.5">
                  {[0, 1, 2, 3, 4, 5, 6].map((cm) => (
                    <span key={cm} className="font-bold">{cm} cm</span>
                  ))}
                </div>
                {/* Millimeter fine ticks */}
                <div className="flex justify-between h-2 items-end">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-[1px] bg-amber-900 ${i % 5 === 0 ? 'h-2' : 'h-1'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* The Isometric Solid Block */}
            <div
              className={`relative cursor-pointer transition-all duration-300 flex items-center justify-center ${
                selectedMaterial.shadow
              }`}
              style={{
                width: `${Math.min(blockScaleX + blockScaleZ, 180)}px`,
                height: `${Math.min(blockScaleY + blockScaleZ * 0.5, 140)}px`,
              }}
              onClick={() => setIsPlacedOnScale(!isPlacedOnScale)}
            >
              {/* Pseudo-3D SVG Prism */}
              <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-2xl">
                {/* Top face */}
                <polygon
                  points="100,20 170,50 100,75 30,45"
                  fill={mysteryMode ? '#64748b' : selectedMaterial.color}
                  opacity="0.9"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Left face */}
                <polygon
                  points="30,45 100,75 100,140 30,110"
                  fill={mysteryMode ? '#475569' : selectedMaterial.color}
                  opacity="0.75"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                {/* Right face */}
                <polygon
                  points="100,75 170,50 170,115 100,140"
                  fill={mysteryMode ? '#334155' : selectedMaterial.color}
                  opacity="0.6"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Dimensions callout overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-[10px] font-mono font-bold text-white drop-shadow">
                <span>L: {length} cm</span>
                <span>W: {width} cm | H: {height} cm</span>
              </div>
            </div>
          </div>

          {/* Sensitive Digital Balance Unit */}
          <div className="w-full max-w-[340px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 p-3 rounded-2xl border-2 border-slate-600 shadow-2xl flex flex-col items-center">
            {/* Stainless Steel Weighing Pan */}
            <div className="w-48 h-3 bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 rounded-full shadow-inner mb-2 border border-slate-400" />

            {/* Scale Digital LCD Display */}
            <div className="w-44 bg-emerald-950/80 border-2 border-emerald-500/60 rounded-xl p-2 flex items-center justify-between shadow-inner">
              <span className="text-[10px] text-emerald-400 font-mono">DIGITAL SCALE</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-xl font-black text-emerald-300 tracking-wider">
                  {isPlacedOnScale ? calculatedMass.toFixed(1) : '0.0'}
                </span>
                <span className="text-xs font-bold text-emerald-400">g</span>
              </div>
            </div>

            {/* Scale Control buttons */}
            <div className="w-full flex items-center justify-between mt-2 px-2 text-[10px]">
              <button
                onClick={() => setIsPlacedOnScale(!isPlacedOnScale)}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-500 font-semibold"
              >
                {isPlacedOnScale ? 'رفع الجسم من الميزان' : 'وضع الجسم على الميزان'}
              </button>
              <button
                onClick={() => setShowRuler(!showRuler)}
                className="px-2 py-0.5 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-500 font-semibold flex items-center gap-1"
              >
                <Ruler className="w-3 h-3 text-amber-400" />
                <span>{showRuler ? 'إخفاء المسطرة' : 'إظهار المسطرة'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Calculations, Material Selection, and Mystery Challenge */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-3">
          {/* Mathematical Calculations Board */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-cyan-400 mb-2.5 flex items-center gap-1.5">
              <Calculator className="w-4 h-4" />
              الخطوات الحسابية لتعيين الكثافة:
            </h4>

            <div className="space-y-2 text-xs">
              {/* Step 1: Volume */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">1. حساب الحجم الهندسي (V):</span>
                  <span className="text-[11px] font-mono text-slate-300">
                    V = {length} × {width} × {height} =
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-sky-400">{volume} cm³</span>
              </div>

              {/* Step 2: Mass */}
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">2. قياس الكتلة بالميزان (m):</span>
                  <span className="text-[11px] text-slate-400">قراءة الميزان الحساس الرقمي</span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400">{calculatedMass} g</span>
              </div>

              {/* Step 3: Density Equation */}
              <div className="p-3 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-emerald-300 font-bold block">3. الكثافة (ρ = m ÷ V):</span>
                  <span className="text-[11px] font-mono text-slate-300">
                    {calculatedMass} g ÷ {volume} cm³ =
                  </span>
                </div>
                <span className="font-mono text-base font-extrabold text-emerald-300">
                  {mysteryMode && !mysteryResult
                    ? '؟؟؟ g/cm³'
                    : `${(calculatedMass / volume).toFixed(1)} g/cm³`}
                </span>
              </div>
            </div>
          </div>

          {/* Dimension Adjustment Sliders */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              تعديل أبعاد الجسم بالمسطرة المترية:
            </span>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>الطول (L):</span>
                  <span className="font-mono text-amber-400">{length} cm</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={0.5}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>العرض (W):</span>
                  <span className="font-mono text-amber-400">{width} cm</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.5}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                  <span>الارتفاع (H):</span>
                  <span className="font-mono text-amber-400">{height} cm</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.5}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Material Chooser or Mystery Quiz */}
          {!mysteryMode ? (
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-xs font-bold text-slate-300 block mb-2">
                اختر مادة المكعب من الجدول المرجعي:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => setSelectedMaterial(mat)}
                    className={`p-2 rounded-lg border text-right transition ${
                      selectedMaterial.id === mat.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: mat.color }}
                      />
                      <span className="text-xs font-bold truncate">{mat.name.split(' ')[0]}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 block mt-0.5">
                      {mat.density} g/cm³
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Mystery Challenge guessing interface */
            <div className="bg-purple-950/30 p-3 rounded-xl border border-purple-500/40">
              <span className="text-xs font-bold text-purple-300 block mb-1">
                تحدي: احسب الكثافة من قراءة الميزان والأبعاد وخمن نوع المادة!
              </span>
              <p className="text-[11px] text-slate-300 mb-2">
                الكثافة = {calculatedMass} g ÷ {volume} cm³ = {(calculatedMass / volume).toFixed(1)} g/cm³. ما هي هذه المادة؟
              </p>

              <div className="grid grid-cols-3 gap-1.5">
                {MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    onClick={() => handleMysteryGuess(mat.id)}
                    className={`p-2 rounded-lg border text-xs font-bold transition ${
                      mysteryGuess === mat.id
                        ? mysteryResult === 'correct'
                          ? 'bg-emerald-500/30 border-emerald-400 text-emerald-200'
                          : 'bg-red-500/30 border-red-400 text-red-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {mat.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {mysteryResult && (
                <div
                  className={`mt-2 p-2 rounded-lg text-xs font-bold flex items-center justify-between ${
                    mysteryResult === 'correct'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-300 border border-red-500/40'
                  }`}
                >
                  <span>
                    {mysteryResult === 'correct'
                      ? `أحسنت! إجابة صحيحة، المادة هي ${selectedMaterial.name} وكثافتها ${selectedMaterial.density} g/cm³.`
                      : 'إجابة غير صحيحة، راجع الكثافة المحسوبة وطابقها مع الجدول.'}
                  </span>
                  <button
                    onClick={startNewMystery}
                    className="underline text-[11px] hover:text-white"
                  >
                    تحدٍ جديد
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
