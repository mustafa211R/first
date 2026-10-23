import React, { useState } from 'react';
import { Layers, Droplets, RefreshCw, Info, Check, HelpCircle, ArrowDown } from 'lucide-react';
import { EnvironmentType } from '../../types/physics';

interface LiquidLayer {
  id: string;
  name: string;
  density: number; // g/cm3
  color: string;
  textColor: string;
  realWorldDesc: string;
}

interface TestObject {
  id: string;
  name: string;
  density: number; // g/cm3
  mass: number; // g
  volume: number; // cm3
  icon: string;
  color: string;
  border: string;
  dropped: boolean;
}

const DEFAULT_LAYERS: LiquidLayer[] = [
  {
    id: 'alcohol',
    name: 'كحول طبي معقم',
    density: 0.79,
    color: 'from-sky-400/40 to-sky-500/50',
    textColor: 'text-sky-300',
    realWorldDesc: 'معقم منزلي خفيف جداً يطفو فوق جميع السوائل الأخرى.',
  },
  {
    id: 'oil',
    name: 'زيت طعام نباتي',
    density: 0.92,
    color: 'from-amber-400/60 to-yellow-500/70',
    textColor: 'text-amber-300',
    realWorldDesc: 'زيت الطبخ في المطبخ، كثافته أقل من الماء فيطفو عليه دائماً.',
  },
  {
    id: 'water',
    name: 'ماء نقي ملون',
    density: 1.00,
    color: 'from-cyan-500/60 to-blue-600/70',
    textColor: 'text-cyan-300',
    realWorldDesc: 'المعيار الفيزيائي الأساسي للكثافة (1 غرام لكل سنتيمتر مكعب).',
  },
  {
    id: 'honey',
    name: 'عسل نحل طبيعي',
    density: 1.42,
    color: 'from-amber-700/80 to-amber-900/90',
    textColor: 'text-amber-400',
    realWorldDesc: 'سائل لزج ثقيل يستقر دائماً في القاع لكثافته العالية.',
  },
];

const INITIAL_OBJECTS: TestObject[] = [
  {
    id: 'cork',
    name: 'سدادة فلين',
    density: 0.24,
    mass: 2.4,
    volume: 10.0,
    icon: '🪵',
    color: 'bg-amber-200 text-amber-950',
    border: 'border-amber-400',
    dropped: false,
  },
  {
    id: 'wax',
    name: 'قطعة شمع',
    density: 0.85,
    mass: 8.5,
    volume: 10.0,
    icon: '🕯️',
    color: 'bg-amber-100 text-amber-900',
    border: 'border-amber-300',
    dropped: false,
  },
  {
    id: 'plastic',
    name: 'خرزة بلاستيكية',
    density: 0.96,
    mass: 9.6,
    volume: 10.0,
    icon: '🔘',
    color: 'bg-emerald-300 text-emerald-950',
    border: 'border-emerald-500',
    dropped: false,
  },
  {
    id: 'grape',
    name: 'حبة عنب طازجة',
    density: 1.15,
    mass: 11.5,
    volume: 10.0,
    icon: '🍇',
    color: 'bg-purple-300 text-purple-950',
    border: 'border-purple-500',
    dropped: false,
  },
  {
    id: 'iron',
    name: 'مسمار حديدي',
    density: 7.80,
    mass: 78.0,
    volume: 10.0,
    icon: '🔩',
    color: 'bg-slate-400 text-slate-950',
    border: 'border-slate-300',
    dropped: false,
  },
];

interface Props {
  environment: EnvironmentType;
}

export const DensityLiquidLayerSim: React.FC<Props> = ({ environment }) => {
  const [objects, setObjects] = useState<TestObject[]>(INITIAL_OBJECTS);
  const [selectedObject, setSelectedObject] = useState<TestObject | null>(null);

  // Toggle drop status of an object
  const toggleDrop = (id: string) => {
    setObjects((prev) =>
      prev.map((obj) => (obj.id === id ? { ...obj, dropped: !obj.dropped } : obj))
    );
  };

  const dropAll = () => {
    setObjects((prev) => prev.map((obj) => ({ ...obj, dropped: true })));
  };

  const resetAll = () => {
    setObjects(INITIAL_OBJECTS);
    setSelectedObject(null);
  };

  // Calculate object vertical position (% from top) in the liquid column based on density
  // Layers from top to bottom:
  // 0% - 25%: Alcohol (density 0.79)
  // 25% - 50%: Oil (density 0.92)
  // 50% - 75%: Water (density 1.00)
  // 75% - 100%: Honey (density 1.42)
  const calculateYPosition = (density: number): number => {
    if (density < 0.79) {
      // Floats on alcohol surface
      return 6 + (density / 0.79) * 12;
    } else if (density < 0.92) {
      // Sinks in alcohol, floats on oil
      const ratio = (density - 0.79) / (0.92 - 0.79);
      return 25 + ratio * 20;
    } else if (density < 1.00) {
      // Sinks in oil, floats on water
      const ratio = (density - 0.92) / (1.00 - 0.92);
      return 50 + ratio * 20;
    } else if (density < 1.42) {
      // Sinks in water, floats on honey
      const ratio = (density - 1.00) / (1.42 - 1.00);
      return 75 + ratio * 15;
    } else {
      // Sinks through honey to bottom floor
      return 92;
    }
  };

  const getSettlingExplanation = (obj: TestObject) => {
    if (obj.density < 0.79) {
      return `تطفو على سطح الكحول الطبي لأن كثافتها (${obj.density} g/cm³) أقل من كثافة الكحول (0.79 g/cm³).`;
    } else if (obj.density < 0.92) {
      return `تغوص في الكحول ولكنها تطفو فوق زيت الطعام لأن كثافتها (${obj.density} g/cm³) أكبر من الكحول وأقل من الزيت (0.92 g/cm³).`;
    } else if (obj.density < 1.00) {
      return `تغوص في الزيت ولكنها تطفو فوق الماء لأن كثافتها (${obj.density} g/cm³) أكبر من الزيت وأقل من الماء (1.00 g/cm³).`;
    } else if (obj.density < 1.42) {
      return `تغوص في الماء ولكنها تطفو فوق العسل لأن كثافتها (${obj.density} g/cm³) أكبر من الماء وأقل من العسل (1.42 g/cm³).`;
    } else {
      return `تغوص إلى قاع الأنبوب تحت العسل لأن كثافة الحديد (${obj.density} g/cm³) أكبر بكثير من كثافة العسل (1.42 g/cm³).`;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-xl">
        {/* Left: The Visual Density Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-3 bg-gradient-to-b from-slate-950 to-slate-900 rounded-xl border border-slate-800 relative min-h-[420px]">
          <div className="w-full flex items-center justify-between text-xs px-2 mb-2">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-amber-400" />
              عمود كثافة السوائل (Density Tower)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">ρ = m / V</span>
          </div>

          {/* Glass Column Cylinder */}
          <div className="relative w-40 h-[340px] border-4 border-slate-600/80 bg-slate-950/40 rounded-b-3xl shadow-2xl overflow-hidden flex flex-col justify-end">
            {/* The 4 Liquid Layers from top to bottom */}
            {DEFAULT_LAYERS.map((layer, index) => (
              <div
                key={layer.id}
                className={`relative w-full h-1/4 bg-gradient-to-b ${layer.color} border-b border-white/10 flex items-center justify-start px-2 transition-all duration-300`}
              >
                <div className="text-[10px] font-bold z-10 drop-shadow">
                  <span className={`${layer.textColor} block font-semibold`}>{layer.name}</span>
                  <span className="text-[9px] font-mono opacity-80 text-white">{layer.density} g/cm³</span>
                </div>
              </div>
            ))}

            {/* Dropped Objects Floating/Sinking inside Column */}
            {objects
              .filter((obj) => obj.dropped)
              .map((obj, i) => {
                const topPercent = calculateYPosition(obj.density);
                // Spread out horizontally slightly to avoid overlap
                const leftPositions = [35, 60, 45, 25, 50];
                const leftPercent = leftPositions[i % leftPositions.length];

                return (
                  <div
                    key={obj.id}
                    onClick={() => setSelectedObject(obj)}
                    style={{
                      top: `${topPercent}%`,
                      left: `${leftPercent}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 flex flex-col items-center group transition-all duration-700 ease-out`}
                    title={`${obj.name}: انقر لعرض التحليل`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full border-2 ${obj.border} ${obj.color} flex items-center justify-center text-sm shadow-xl transform group-hover:scale-125 transition-transform`}
                    >
                      {obj.icon}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Heavy Base Plate */}
          <div className="w-48 h-3.5 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 rounded-lg shadow-lg -mt-1" />

          {/* Quick Buttons below column */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={dropAll}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1 transition"
            >
              <ArrowDown className="w-3.5 h-3.5" />
              <span>إسقاط جميع الأجسام</span>
            </button>
            <button
              onClick={resetAll}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs transition"
              title="إعادة ضبط العمود"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Object Tray, Inspector, and Scientific Analysis */}
        <div className="lg:col-span-7 flex flex-col justify-between gap-3">
          {/* Objects Tray */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Droplets className="w-4 h-4" />
                سلة الأجسام المختبرية (انقر للإسقاط في العمود):
              </span>
              <span className="text-[11px] text-slate-400">
                المسقطة: {objects.filter((o) => o.dropped).length} من {objects.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {objects.map((obj) => (
                <div
                  key={obj.id}
                  onClick={() => {
                    toggleDrop(obj.id);
                    setSelectedObject(obj);
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    obj.dropped
                      ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{obj.icon}</span>
                    <div>
                      <p className="text-xs font-bold">{obj.name}</p>
                      <p className="text-[10px] font-mono text-cyan-400">الكثافة: {obj.density} g/cm³</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      obj.dropped
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {obj.dropped ? 'في السائل ✓' : 'إسقاط ↓'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Object Detailed Physical Analysis Card */}
          <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-3.5 rounded-xl border border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              تفسير سلوك المادة (لماذا طفت أو غاصت؟):
            </h4>

            {selectedObject ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                  <span className="text-2xl">{selectedObject.icon}</span>
                  <div>
                    <span className="font-bold text-slate-100">{selectedObject.name}</span>
                    <span className="text-slate-400 text-[11px] block">
                      الكتلة: {selectedObject.mass} g | الحجم: {selectedObject.volume} cm³ | الكثافة: {selectedObject.density} g/cm³
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-950/30 border border-amber-500/30 rounded-lg text-amber-200 text-xs leading-relaxed">
                  <b>النتيجة العلمية: </b>
                  {getSettlingExplanation(selectedObject)}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 py-3 text-center">
                انقر على أي جسم من السلة أعلاه أو في عمود السوائل لرؤية التحليل الفيزيائي لعمق استقراره وقوى الطفو المؤثرة عليه.
              </p>
            )}
          </div>

          {/* Rule of thumb summary */}
          <div className="p-2.5 bg-cyan-950/30 border border-cyan-800/40 rounded-xl text-[11px] text-cyan-200 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 font-bold">
              !
            </div>
            <span>
              <b>قاعدة عامة: </b>
              المادة الأقل كثافة تطفو للأعلى دائماً، بينما المادة الأكبر كثافة تغوص للأسفل. لا تمتزج هذه السوائل تلقائياً بسبب اختلاف كثافتها وقواها الجزيئية.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
