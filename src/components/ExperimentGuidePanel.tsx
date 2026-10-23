import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Calculator,
  Compass,
  Award,
  FileText,
  Printer,
  Sparkles,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ExperimentDef, EnvironmentType } from '../types/physics';

interface Props {
  experiment: ExperimentDef;
  environment: EnvironmentType;
}

type TabType = 'overview' | 'steps' | 'math' | 'realworld' | 'quiz' | 'report';

export const ExperimentGuidePanel: React.FC<Props> = ({ experiment, environment }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Student Report inputs
  const [studentName, setStudentName] = useState<string>('طالب متميز');
  const [studentSchool, setStudentSchool] = useState<string>('مدرسة المتفوقين للبنين/البنات');
  const [reportNote, setReportNote] = useState<string>('تم إجراء التجربة بنجاح ومطابقة النتائج المخبرية مع القوانين الفيزيائية.');

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    experiment.quiz.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score++;
    });
    return score;
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden mt-4">
      {/* Navigation Tabs Header */}
      <div className="flex border-b border-slate-800 bg-slate-950/70 overflow-x-auto scrollbar-none text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الغرض والمفهوم العلمي</span>
        </button>

        <button
          onClick={() => setActiveTab('steps')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'steps'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>خطوات العمل المنهجية ({completedSteps.length}/{experiment.steps.length})</span>
        </button>

        {experiment.formulaDisplay && (
          <button
            onClick={() => setActiveTab('math')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
              activeTab === 'math'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>القوانين والقياسات</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('realworld')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'realworld'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>في حياتنا وبيئتنا</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>اختبر فهمك (كويز)</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition whitespace-nowrap ${
            activeTab === 'report'
              ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>تقرير التجربة (PDF)</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Purpose card */}
            <div className="p-4 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 rounded-xl border border-cyan-500/30">
              <h4 className="text-sm font-bold text-cyan-300 mb-1.5 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                الغرض والفائدة من التجربة:
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {experiment.purpose}
              </p>
            </div>

            {/* Concept breakdown */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                المفهوم الفيزيائي العلمي (شرح كتاب الفيزياء الأول المتوسط):
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {experiment.scientificConcept}
              </p>
            </div>

            {/* Apparatus Checklist */}
            <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2">الأدوات والمواد المستخدمة:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {experiment.apparatus.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-xs sm:text-sm text-emerald-200">
              <b>الاستنتاج النهائي: </b>
              {experiment.conclusion}
            </div>
          </div>
        )}

        {/* Tab 2: Step-by-Step Procedure */}
        {activeTab === 'steps' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>انقر على الخطوة لتحديد إنجازها أثناء تطبيق التجربة في المحاكي:</span>
              <span className="font-bold text-cyan-400">
                مكتمل: {completedSteps.length} من {experiment.steps.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {experiment.steps.map((step, idx) => {
                const isDone = completedSteps.includes(idx);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition ${
                      isDone
                        ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                        : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs transition ${
                          isDone
                            ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="flex-1">
                        <h4 className={`text-xs sm:text-sm font-bold ${isDone ? 'text-cyan-300 line-through opacity-90' : 'text-slate-100'}`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {step.description}
                        </p>
                        {step.tip && (
                          <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/30 px-2 py-1 rounded-md inline-block">
                            💡 نصيحة مخبرية: {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Mathematical Formulas (Without TeX) */}
        {activeTab === 'math' && experiment.formulaDisplay && (
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-slate-950 to-slate-900 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 mb-2">
                {experiment.formulaTitle || 'الصيغة الرياضية والقانون الفيزيائي:'}
              </h4>

              {/* Big Equation Banner (Clear HTML & Unicode) */}
              <div className="p-4 rounded-xl bg-slate-900 border-2 border-cyan-500/40 text-center shadow-inner my-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-cyan-300 tracking-wider">
                  {experiment.formulaDisplay.symbolic}
                </span>
                <p className="text-xs text-slate-400 mt-1.5">
                  {experiment.formulaDisplay.description}
                </p>
              </div>

              {/* Legend of Variables */}
              <div className="mt-4">
                <h5 className="text-xs font-bold text-slate-300 mb-2">دلالات الرموز ووحدات القياس الدولية:</h5>
                <div className="space-y-1.5 text-xs">
                  {experiment.formulaDisplay.legend.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                          {item.symbol}
                        </span>
                        <span className="text-slate-200">{item.meaning}</span>
                      </div>
                      <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                        {item.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Real-world Applications */}
        {activeTab === 'realworld' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs text-slate-300">
              الفيزياء ليست مجرد نظريات في الكتاب، بل هي القوانين التي تحكم بيتنا، شوارعنا، وحدائقنا!
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {experiment.realWorldApplications.map((app, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">
                        {app.environment === 'kitchen' ? '🍳' : app.environment === 'garden' ? '🌳' : '🏙️'}
                      </span>
                      <span className="text-xs font-bold text-amber-400">
                        {app.environment === 'kitchen'
                          ? 'في المطبخ والمنزل'
                          : app.environment === 'garden'
                          ? 'في الحديقة والشمس'
                          : 'في الشارع والعمارة'}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-100 mb-1.5">{app.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{app.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Interactive Self-Assessment Quiz */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-300 font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                اختبر معلوماتك في هذه التجربة
              </span>
              {quizSubmitted && (
                <span className="font-bold text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-lg">
                  نتيجتك: {calculateQuizScore()} من {experiment.quiz.length}
                </span>
              )}
            </div>

            <div className="space-y-4">
              {experiment.quiz.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-slate-950/80 rounded-xl border border-slate-800">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-200 mb-3 flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-xs shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <span>{q.question}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {q.options.map((option, optIdx) => {
                      const isSelected = userAnswers[qIdx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      let btnStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-red-500/20 border-red-400 text-red-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold';
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(qIdx, optIdx)}
                          className={`p-3 rounded-xl border text-right transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{option}</span>
                          {quizSubmitted && isCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                          {quizSubmitted && isSelected && !isCorrect && (
                            <span className="text-red-400 font-bold">✗</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-3 p-2.5 bg-slate-900/90 rounded-lg text-xs text-slate-300 border border-slate-800">
                      <b className="text-amber-400">التفسير العلمي: </b>
                      {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(userAnswers).length < experiment.quiz.length}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black rounded-xl text-xs shadow-lg transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  تصحيح الإجابات وعرض النتيجة
                </button>
              ) : (
                <button
                  onClick={resetQuiz}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition border border-slate-700"
                >
                  إعادة الاختبار من جديد
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: Printable Lab Report */}
        {activeTab === 'report' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">
                أنشئ تقريراً علمياً مخبرياً رسمياً يمكن طباعته أو حفظه كـ PDF لتسليمه للمعلم:
              </span>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التقرير (Print / PDF)</span>
              </button>
            </div>

            {/* Editable student info inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">اسم الطالب / الطالبة:</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-bold focus:border-cyan-400 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">اسم المدرسة أو الفصل:</label>
                <input
                  type="text"
                  value={studentSchool}
                  onChange={(e) => setStudentSchool(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 font-bold focus:border-cyan-400 outline-none"
                />
              </div>
            </div>

            {/* Printable Document Preview Paper */}
            <div
              id="printable-report"
              className="p-6 bg-slate-950 border-2 border-slate-700 rounded-2xl text-slate-200 text-xs space-y-4 shadow-2xl relative"
            >
              {/* Report Header */}
              <div className="border-b-2 border-slate-700 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-white">تقرير تجربة فيزياء الأول المتوسط</h2>
                  <p className="text-[11px] text-cyan-400 font-bold mt-0.5">{experiment.title}</p>
                </div>
                <div className="text-left text-[10px] font-mono text-slate-400">
                  <p>التاريخ: {new Date().toLocaleDateString('ar-EG')}</p>
                  <p>المختبر الافتراضي التفاعلي</p>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="grid grid-cols-2 gap-2 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                <div>
                  <span className="text-slate-400">اسم مجري التجربة: </span>
                  <b className="text-white">{studentName}</b>
                </div>
                <div>
                  <span className="text-slate-400">المؤسسة التعليمية: </span>
                  <b className="text-white">{studentSchool}</b>
                </div>
              </div>

              {/* Experiment Goal & Concept */}
              <div>
                <b className="text-cyan-300 block mb-1">1. الغرض من التجربة:</b>
                <p className="text-slate-300 leading-relaxed text-[11px]">{experiment.purpose}</p>
              </div>

              {/* Apparatus */}
              <div>
                <b className="text-cyan-300 block mb-1">2. الأجهزة والمواد المخبرية:</b>
                <p className="text-slate-300 text-[11px]">{experiment.apparatus.join(' • ')}</p>
              </div>

              {/* Conclusion & Personal Notes */}
              <div>
                <b className="text-cyan-300 block mb-1">3. الاستنتاج العلمي والملاحظات:</b>
                <p className="text-slate-300 text-[11px] leading-relaxed mb-2">{experiment.conclusion}</p>
                <textarea
                  value={reportNote}
                  onChange={(e) => setReportNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:border-cyan-400 outline-none"
                  rows={2}
                />
              </div>

              {/* Teacher Signature Stamp Area */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>توقيع مدرس/مدرسة المادة: .......................................</span>
                <span className="font-bold text-emerald-400">الدرجة المقدرة: [ ممتاز / 10 ]</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
