import React, { useState } from 'react';
import {
  Wrench,
  Calculator,
  Scale,
  Beaker,
  Thermometer,
  Flame,
  Table,
  X,
  ChevronRight,
  Sliders,
  Check,
} from 'lucide-react';

export const SandboxTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTool, setActiveTool] = useState<'calc' | 'table' | 'converter' | null>('calc');

  // Mini Density Calculator state
  const [calcMass, setCalcMass] = useState<number>(78);
  const [calcVolume, setCalcVolume] = useState<number>(10);
  const calculatedDensity = calcVolume > 0 ? (calcMass / calcVolume).toFixed(2) : '0';

  // Unit Converter state
  const [mLValue, setMLValue] = useState<number>(250);

  return (
    <>
      {/* Floating Toolbar Trigger Button on Bottom-Right */}
      <div className="fixed bottom-5 left-5 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-2xl shadow-2xl transition-all duration-300 transform active:scale-95 group border-2 border-amber-300"
        >
          <Wrench className="w-4 h-4" />
          <span className="text-xs">حقيبة أدوات وحاسبة الفيزياء</span>
        </button>
      </div>

      {/* Slide-over or Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">حقيبة الأدوات والتحويلات المخبرية</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tool Nav Pills */}
            <div className="flex gap-2 border-b border-slate-800 pb-2 text-xs font-bold">
              <button
                onClick={() => setActiveTool('calc')}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                  activeTool === 'calc'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>حاسبة الكثافة (ρ = m/V)</span>
              </button>

              <button
                onClick={() => setActiveTool('table')}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                  activeTool === 'table'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>جدول كثافات المواد</span>
              </button>

              <button
                onClick={() => setActiveTool('converter')}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                  activeTool === 'converter'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>محول الوحدات</span>
              </button>
            </div>

            {/* Tool 1: Interactive Density Calculator */}
            {activeTool === 'calc' && (
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-300 font-bold block">
                  أدخل الكتلة والحجم لحساب الكثافة فوراً:
                </span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">الكتلة (m) بالغرام:</label>
                    <input
                      type="number"
                      value={calcMass}
                      onChange={(e) => setCalcMass(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 font-bold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">الحجم (V) بالسنتيمتر المكعب:</label>
                    <input
                      type="number"
                      value={calcVolume}
                      onChange={(e) => setCalcVolume(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">الكثافة الناتجة (ρ):</span>
                    <span className="text-[11px] font-mono text-slate-300">
                      ρ = {calcMass} ÷ {calcVolume}
                    </span>
                  </div>
                  <span className="font-mono text-lg font-black text-cyan-300">
                    {calculatedDensity} g/cm³
                  </span>
                </div>
              </div>
            )}

            {/* Tool 2: Reference Density Table */}
            {activeTool === 'table' && (
              <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs max-h-56 overflow-y-auto">
                <span className="text-slate-300 font-bold block mb-1">
                  جدول الكثافات المرجعية للمواد الشائعة (عند 20°C):
                </span>
                <table className="w-full text-right border-collapse text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="py-1">المادة</th>
                      <th className="py-1">الحالة</th>
                      <th className="py-1 text-left">الكثافة (g/cm³)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    <tr>
                      <td className="py-1.5 font-bold">الذهب الخالص</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-amber-400 font-bold">19.30</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">الرصاص</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-slate-300">11.30</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">النحاس</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-orange-400">8.90</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">الحديد الصلب</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-slate-300">7.80</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">الألمنيوم</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-slate-300">2.70</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">عسل النحل</td>
                      <td>سائل</td>
                      <td className="text-left font-mono text-amber-500">1.42</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold text-cyan-300">الماء النقي</td>
                      <td>سائل</td>
                      <td className="text-left font-mono text-cyan-400 font-bold">1.00</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">زيت الطعام</td>
                      <td>سائل</td>
                      <td className="text-left font-mono text-yellow-400">0.92</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">الثلج (ماء متجمد)</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-sky-300">0.917</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">الكحول الطبي</td>
                      <td>سائل</td>
                      <td className="text-left font-mono text-sky-400">0.79</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">خشب الصنوبر</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-amber-700">0.50</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 font-bold">الفلين</td>
                      <td>صلب</td>
                      <td className="text-left font-mono text-amber-200 font-bold">0.24</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Tool 3: Quick Unit Converter */}
            {activeTool === 'converter' && (
              <div className="space-y-3 bg-slate-950/80 p-4 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-300 font-bold block">تحويل الحجوم والسعات:</span>
                <div>
                  <label className="text-slate-400 block mb-1">القيمة بالمليلتر (mL):</label>
                  <input
                    type="number"
                    value={mLValue}
                    onChange={(e) => setMLValue(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 font-mono text-cyan-300 font-bold outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">بالسنتيمتر المكعب (cm³):</span>
                    <span className="font-mono text-cyan-300 font-bold text-sm">{mLValue} cm³</span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">(1 mL = 1 cm³)</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">باللتر (L):</span>
                    <span className="font-mono text-amber-300 font-bold text-sm">
                      {(mLValue / 1000).toFixed(3)} L
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">(1 L = 1000 mL)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
