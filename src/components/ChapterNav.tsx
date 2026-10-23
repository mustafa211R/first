import React from 'react';
import { Shapes, Cpu, Flame, CheckCircle, ChevronLeft } from 'lucide-react';
import { ChapterDef, ExperimentDef, ChapterId, ExperimentId } from '../types/physics';
import { CHAPTERS_DATA } from '../data/chaptersData';

interface Props {
  activeChapterId: ChapterId;
  activeExperimentId: ExperimentId;
  onSelectChapter: (chapterId: ChapterId) => void;
  onSelectExperiment: (expId: ExperimentId) => void;
}

export const ChapterNav: React.FC<Props> = ({
  activeChapterId,
  activeExperimentId,
  onSelectChapter,
  onSelectExperiment,
}) => {
  const activeChapter = CHAPTERS_DATA.find((c) => c.id === activeChapterId) || CHAPTERS_DATA[0];

  const getChapterIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'Flame':
        return <Flame className="w-4 h-4 text-red-400" />;
      default:
        return <Shapes className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Chapter Tabs Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {CHAPTERS_DATA.map((chapter) => {
          const isActive = chapter.id === activeChapterId;
          return (
            <button
              key={chapter.id}
              onClick={() => {
                onSelectChapter(chapter.id);
                // Also select the first experiment of this chapter if switching
                if (chapter.id !== activeChapterId) {
                  onSelectExperiment(chapter.experiments[0].id);
                }
              }}
              className={`p-3 rounded-2xl border text-right transition flex items-center gap-3 relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-cyan-400/80 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:border-slate-700'
              }`}
            >
              {/* Colored left bar indicator */}
              <div
                className={`w-1.5 absolute right-0 top-0 bottom-0 bg-gradient-to-b ${chapter.color} ${
                  isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'
                }`}
              />

              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  isActive
                    ? 'bg-slate-850 border-cyan-500/40 shadow-inner'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {getChapterIcon(chapter.iconName)}
              </div>

              <div className="min-w-0 pr-1">
                <span className="text-[10px] font-bold text-slate-400 block -mb-0.5">
                  {chapter.number}
                </span>
                <h3
                  className={`text-xs sm:text-sm font-black truncate ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {chapter.title}
                </h3>
                <span className="text-[10px] text-slate-400 block truncate">
                  {chapter.experiments.length} تجارب تفاعلية
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Experiments Sub-Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap pl-1">
          تجارب {activeChapter.number}:
        </span>

        {activeChapter.experiments.map((exp) => {
          const isSelected = exp.id === activeExperimentId;
          return (
            <button
              key={exp.id}
              onClick={() => onSelectExperiment(exp.id)}
              className={`px-3.5 py-2 rounded-xl border whitespace-nowrap font-bold flex items-center gap-2 transition shrink-0 ${
                isSelected
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{exp.title}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {exp.badge}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
