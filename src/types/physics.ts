export type ChapterId = 'chapter1' | 'chapter2' | 'chapter3';

export type ExperimentId =
  // Chapter 1
  | 'states-of-matter'
  | 'displacement-volume'
  | 'liquid-density'
  | 'regular-density'
  // Chapter 2
  | 'atom-structure'
  | 'electron-configuration'
  // Chapter 3
  | 'ball-and-ring'
  | 'conduction-rods'
  | 'convection-liquid';

export type EnvironmentType = 'lab' | 'kitchen' | 'garden' | 'street';

export interface EnvironmentInfo {
  id: EnvironmentType;
  name: string;
  icon: string;
  description: string;
  bgGradient: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ExperimentStep {
  title: string;
  description: string;
  tip?: string;
}

export interface ExperimentDef {
  id: ExperimentId;
  chapterId: ChapterId;
  title: string;
  subtitle: string;
  badge: string;
  icon: string;
  purpose: string;
  scientificConcept: string;
  apparatus: string[];
  formulaTitle?: string;
  formulaDisplay?: {
    symbolic: string;
    description: string;
    legend: { symbol: string; meaning: string; unit: string }[];
  };
  steps: ExperimentStep[];
  realWorldApplications: {
    title: string;
    environment: EnvironmentType;
    description: string;
  }[];
  conclusion: string;
  quiz: QuizQuestion[];
}

export interface ChapterDef {
  id: ChapterId;
  title: string;
  number: string;
  description: string;
  iconName: string;
  color: string;
  accentBg: string;
  experiments: ExperimentDef[];
}
