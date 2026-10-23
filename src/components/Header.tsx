import React, { useState } from 'react';
import {
  FlaskConical,
  UtensilsCrossed,
  SunMedium,
  Building2,
  Sparkles,
  Maximize2,
  Minimize2,
  HelpCircle,
  X,
  Compass,
} from 'lucide-react';
import { EnvironmentType, EnvironmentInfo } from '../types/physics';
import { ENVIRONMENTS } from '../data/chaptersData';

interface Props {
  currentEnvironment: EnvironmentType;
  onSelectEnvironment: (env: EnvironmentType) => void;
}

export const Header: React.FC<Props> = ({ currentEnvironment, onSelectEnvironment }) => {
  const [showEnvModal, setShowEnvModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeEnvInfo = ENVIRONMENTS.find((e) => e.id === currentEnvironment) || ENVIRONMENTS[0];

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const getEnvIcon = (id: EnvironmentType) => {
    switch (id) {
      case 'kitchen':
        return <UtensilsCrossed className="w-4 h-4 text-amber-400" />;
      case 'garden':
        return <SunMedium className="w-4 h-4 text-emerald-400" />;
      case 'street':
        return <Building2 className="w-4 h-4 text-cyan-400" />;
      default:
        return <FlaskConical className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-xl px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <span className="text-xl">⚛️</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black text-white tracking-wide">
                  مختبر فيزياء الأول المتوسط
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                  تفاعلي حي
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden xs:block">
                الفصول: خواص المادة • تركيب الذرة • الحرارة وتأثيرها
              </p>
            </div>
          </div>

          {/* Environment Switcher & Quick Utilities */}
          <div className="flex items-center gap-2">
            {/* Real-world Environment Switcher Button */}
            <button
              onClick={() => setShowEnvModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-xs font-bold text-slate-200 transition shadow-sm active:scale-95"
              title="تغيير بيئة التجربة (المعمل، المطبخ، الحديقة، الشارع)"
            >
              <div className="p-1 rounded-lg bg-slate-800">{getEnvIcon(currentEnvironment)}</div>
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 block -mb-0.5">البيئة المحيطة:</span>
                <span className="text-xs text-amber-300 font-bold">{activeEnvInfo.name}</span>
              </div>
            </button>

            {/* Help / Guide button */}
            <button
              onClick={() => setShowHelpModal(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition"
              title="دليل استخدام المختبر"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition hidden sm:block"
              title="ملء الشاشة"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Environment Chooser Modal */}
      {showEnvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white">اختر بيئة المحاكاة الواقعية</h3>
              </div>
              <button
                onClick={() => setShowEnvModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              اختر السياق المكاني الذي ترغب في ربط تجاربك به لتفهم كيف تتجلى القوانين الفيزيائية في بيئتنا الحقيقية:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ENVIRONMENTS.map((env) => {
                const isSelected = env.id === currentEnvironment;
                return (
                  <div
                    key={env.id}
                    onClick={() => {
                      onSelectEnvironment(env.id);
                      setShowEnvModal(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-950/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                        {getEnvIcon(env.id)}
                      </div>
                      <span className="text-xs font-bold text-white">{env.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{env.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-black text-white">دليل استخدام المختبر الافتراضي</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <b className="text-cyan-300 block mb-0.5">1. تصفح الفصول والتجارب:</b>
                استخدم الشريط العلوي للانتقال بين الفصول الثلاثة (خواص المادة، تركيب الذرة، الحرارة وتأثيرها).
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <b className="text-amber-300 block mb-0.5">2. التفاعل والتعديل المباشر:</b>
                في كل تجربة يمكنك التعديل والتحكم الكامل في المتغيرات: درجات الحرارة، أبعاد الأجسام، كتلها، نوع المادة، أو عدد الجسيمات الذرية.
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <b className="text-emerald-300 block mb-0.5">3. خطوات العمل والتقرير العلمي:</b>
                تحت كل تجربة ستجد دليلاً مفصلاً يضم: خطوات العمل، القوانين الرياضية، التطبيقات الحياتية، كويز تفاعلي، وتقرير قابل للطباعة والتصدير.
              </div>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg transition"
            >
              فهمت، لنبدأ التجربة الآن!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
