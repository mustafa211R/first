import React, { useState } from 'react';
import { ChapterId, ExperimentId, EnvironmentType } from './types/physics';
import { CHAPTERS_DATA, ENVIRONMENTS } from './data/chaptersData';
import { Header } from './components/Header';
import { ChapterNav } from './components/ChapterNav';
import { ExperimentGuidePanel } from './components/ExperimentGuidePanel';
import { SandboxTools } from './components/SandboxTools';

// Simulation components
import { StatesOfMatterSim } from './components/simulations/StatesOfMatterSim';
import { DisplacementVolumeSim } from './components/simulations/DisplacementVolumeSim';
import { DensityLiquidLayerSim } from './components/simulations/DensityLiquidLayerSim';
import { RegularSolidDensitySim } from './components/simulations/RegularSolidDensitySim';
import { AtomBuilderSim } from './components/simulations/AtomBuilderSim';
import { BallAndRingSim } from './components/simulations/BallAndRingSim';
import { ConductionRodsSim } from './components/simulations/ConductionRodsSim';
import { ConvectionLiquidSim } from './components/simulations/ConvectionLiquidSim';

export default function App() {
  const [currentEnvironment, setCurrentEnvironment] = useState<EnvironmentType>('lab');
  const [activeChapterId, setActiveChapterId] = useState<ChapterId>('chapter1');
  const [activeExperimentId, setActiveExperimentId] = useState<ExperimentId>('states-of-matter');

  const activeChapter = CHAPTERS_DATA.find((c) => c.id === activeChapterId) || CHAPTERS_DATA[0];
  const activeExperiment =
    activeChapter.experiments.find((e) => e.id === activeExperimentId) ||
    activeChapter.experiments[0];

  const currentEnvInfo =
    ENVIRONMENTS.find((e) => e.id === currentEnvironment) || ENVIRONMENTS[0];

  // Render the matching interactive simulation
  const renderSimulation = () => {
    switch (activeExperiment.id) {
      case 'states-of-matter':
        return <StatesOfMatterSim environment={currentEnvironment} />;
      case 'displacement-volume':
        return <DisplacementVolumeSim environment={currentEnvironment} />;
      case 'liquid-density':
        return <DensityLiquidLayerSim environment={currentEnvironment} />;
      case 'regular-density':
        return <RegularSolidDensitySim environment={currentEnvironment} />;
      case 'atom-structure':
      case 'electron-configuration':
        return <AtomBuilderSim environment={currentEnvironment} />;
      case 'ball-and-ring':
        return <BallAndRingSim environment={currentEnvironment} />;
      case 'conduction-rods':
        return <ConductionRodsSim environment={currentEnvironment} />;
      case 'convection-liquid':
        return <ConvectionLiquidSim environment={currentEnvironment} />;
      default:
        return <StatesOfMatterSim environment={currentEnvironment} />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-b ${currentEnvInfo.bgGradient} text-slate-100 flex flex-col transition-colors duration-700 selection:bg-cyan-500 selection:text-slate-950 font-sans`}
    >
      {/* Top Application Header */}
      <Header
        currentEnvironment={currentEnvironment}
        onSelectEnvironment={setCurrentEnvironment}
      />

      {/* Main Lab Canvas & Guide Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 space-y-5">
        {/* Chapter & Experiment Tabs Navigation */}
        <ChapterNav
          activeChapterId={activeChapterId}
          activeExperimentId={activeExperimentId}
          onSelectChapter={setActiveChapterId}
          onSelectExperiment={setActiveExperimentId}
        />

        {/* Current Experiment Title & Context Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/60 backdrop-blur border border-slate-800/80 px-4 py-3 rounded-2xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h2 className="text-base sm:text-lg font-black text-white">
                {activeExperiment.title}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{activeExperiment.subtitle}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
              {activeExperiment.badge}
            </span>
          </div>
        </div>

        {/* Live Interactive Physics Simulation Container */}
        <section aria-label="منطقة المحاكاة التفاعلية">
          {renderSimulation()}
        </section>

        {/* Comprehensive Guide, Steps, Calculations, Quiz, & Printable Report */}
        <section aria-label="دليل التجربة والمفاهيم">
          <ExperimentGuidePanel
            experiment={activeExperiment}
            environment={currentEnvironment}
          />
        </section>
      </main>

      {/* Floating Sandbox Tools & Calculator */}
      <SandboxTools />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500 mt-10">
        <p>
          مختبر فيزياء الأول المتوسط التفاعلي • مخصص للتعليم المنهجي وفق وزارة التربية • محاكاة قائمة على المعايير الفيزيائية
        </p>
      </footer>
    </div>
  );
}
