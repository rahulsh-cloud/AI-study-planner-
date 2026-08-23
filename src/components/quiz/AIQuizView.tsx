import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  ChevronRight,
  BookOpen,
  ListOrdered
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { QuizQuestion, DifficultyLevel } from '../../types';

export const AIQuizView: React.FC = () => {
  const { 
    subjects, 
    quizHistory, 
    saveQuizResult, 
    setActiveTab 
  } = useStudy();

  const [activeTabMode, setActiveTabMode] = useState<'create' | 'history'>('create');
  
  // Generator Config
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState<string>('Database Normalization (1NF, 2NF, 3NF, BCNF)');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Active Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [completedResult, setCompletedResult] = useState<{ score: number; percentage: number; timeSpentSecs: number } | null>(null);
  const [quizStartTime, setQuizStartTime] = useState<number>(0);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: currentSubject?.name || 'Computer Science',
          topicName: topicName.trim() || 'Core Subject Concepts',
          difficulty,
          questionCount
        })
      });
      const data = await res.json();
      if (data.success && data.quiz && data.quiz.questions) {
        setActiveQuizQuestions(data.quiz.questions);
        setCurrentQuestionIdx(0);
        setUserAnswers({});
        setShowExplanation(false);
        setShowHint(false);
        setQuizCompleted(false);
        setCompletedResult(null);
        setQuizStartTime(Date.now());
      }
    } catch (e) {
      console.error('Quiz generation error:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    if (userAnswers[currentQuestionIdx] !== undefined) return; // already answered
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: optionIndex }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (!activeQuizQuestions) return;
    if (currentQuestionIdx < activeQuizQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setShowExplanation(userAnswers[currentQuestionIdx + 1] !== undefined);
      setShowHint(false);
    } else {
      // Complete quiz
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = () => {
    if (!activeQuizQuestions) return;
    let correctCount = 0;
    activeQuizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / activeQuizQuestions.length) * 100);
    const timeSpent = Math.max(15, Math.round((Date.now() - quizStartTime) / 1000));

    setCompletedResult({
      score: correctCount,
      percentage,
      timeSpentSecs: timeSpent
    });
    setQuizCompleted(true);

    // Save to context & update syllabus mastery
    saveQuizResult({
      subjectId: currentSubject?.id || 'sub-1',
      subjectName: currentSubject?.name || 'General Subject',
      topicName: topicName.trim() || 'Core Concepts',
      totalQuestions: activeQuizQuestions.length,
      score: correctCount,
      percentage,
      timeSpentSeconds: timeSpent,
      difficulty,
      questions: activeQuizQuestions
    });
  };

  const handleResetQuiz = () => {
    setActiveQuizQuestions(null);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setQuizCompleted(false);
    setCompletedResult(null);
  };

  const currentQ = activeQuizQuestions ? activeQuizQuestions[currentQuestionIdx] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            AI Practice Quiz Arena
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Generate custom conceptual quizzes on any chapter, test your recall, and automatically recalibrate weak spots.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTabMode('create');
              handleResetQuiz();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTabMode === 'create'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Create Quiz
          </button>
          <button
            onClick={() => setActiveTabMode('history')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTabMode === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            Past Results ({quizHistory.length})
          </button>
        </div>
      </div>

      {activeTabMode === 'history' ? (
        /* History View */
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Past Quiz Performance History</h3>
          {quizHistory.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              No completed quizzes recorded yet. Generate your first quiz!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quizHistory.map((q) => (
                <div
                  key={q.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                        {q.subjectName}
                      </span>
                      <span className={`text-xs font-bold font-mono ${
                        q.percentage >= 80 ? 'text-emerald-500' : q.percentage >= 60 ? 'text-blue-500' : 'text-rose-500'
                      }`}>
                        {q.score}/{q.totalQuestions} ({q.percentage}%)
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{q.topicName}</h4>
                    <p className="text-xs text-slate-400 mt-1 capitalize">
                      {q.difficulty} Difficulty • {Math.round(q.timeSpentSeconds / 60)}m {q.timeSpentSeconds % 60}s duration
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Taken on: {new Date(q.takenAt).toLocaleDateString()}</span>
                    <span className="text-emerald-500 font-semibold">+{Math.round(q.percentage * 0.5)} XP Awarded</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeQuizQuestions && !quizCompleted ? (
        /* Active Quiz Taking Interface */
        currentQ && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Question Header & Progress Bar */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>Question {currentQuestionIdx + 1} of {activeQuizQuestions.length}</span>
                <span className="capitalize font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {difficulty} Level
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIdx + 1) / activeQuizQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = userAnswers[currentQuestionIdx] === optIdx;
                const isAnswered = userAnswers[currentQuestionIdx] !== undefined;
                const isCorrect = optIdx === currentQ.correctAnswerIndex;

                let optionStyle = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-blue-500 text-slate-800 dark:text-slate-200';

                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold';
                  } else {
                    optionStyle = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-50 text-slate-500';
                  }
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-lg bg-white/80 dark:bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hint & Explanation Box */}
            {showExplanation && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-blue-700 dark:text-blue-300">
                  <Sparkles className="h-4 w-4" />
                  <span>Concept Explanation</span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowHint(!showHint)}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 flex items-center gap-1"
              >
                <HelpCircle className="h-4 w-4" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>

              {userAnswers[currentQuestionIdx] !== undefined ? (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition"
                >
                  <span>{currentQuestionIdx < activeQuizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <span className="text-xs text-slate-400 italic">Select an option to proceed</span>
              )}
            </div>

            {showHint && currentQ.hint && (
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                💡 <strong>Hint:</strong> {currentQ.hint}
              </p>
            )}
          </div>
        )
      ) : quizCompleted && completedResult ? (
        /* Quiz Completed Score Summary */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Quiz Completed!
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {topicName} • {currentSubject?.name}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Score</span>
              <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {completedResult.score}/{activeQuizQuestions?.length}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">Accuracy</span>
              <span className="text-xl font-extrabold text-emerald-500 font-mono">
                {completedResult.percentage}%
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold">XP Earned</span>
              <span className="text-xl font-extrabold text-amber-500 font-mono">
                +{Math.round(completedResult.percentage * 0.5)} XP
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {completedResult.percentage >= 80
              ? 'Outstanding grasp! Your mastery level on this topic in your syllabus tracker has been elevated.'
              : 'Good effort! Review the questions with lower accuracy and schedule a spaced revision session.'}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetQuiz}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200"
            >
              Check Syllabus Mastery
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Generator Settings Form */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Configure AI Practice Quiz</h2>
              <p className="text-xs text-slate-500">Gemini will generate balanced multiple-choice questions with full explanations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                <option value="easy">Easy (Definitions & Concepts)</option>
                <option value="medium">Medium (Application & Comparisons)</option>
                <option value="hard">Hard (Advanced Numerical / Case Problems)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Chapter / Specific Topic</label>
            <input
              type="text"
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              placeholder="e.g. Normalization (1NF, 2NF, 3NF, BCNF) or AVL Trees"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Number of Questions</span>
              <span className="text-blue-500 font-mono">{questionCount} Questions</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value) || 5)}
              className="w-full accent-blue-500"
            />
          </div>

          <div className="pt-2">
            <button
              id="start-ai-quiz-generation-btn"
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition active:scale-[0.99] disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Questions with Gemini AI...' : 'Generate & Start AI Quiz'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
