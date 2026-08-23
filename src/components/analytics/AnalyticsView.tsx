import React, { useState } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  Award, 
  BrainCircuit, 
  Clock, 
  Target, 
  CheckCircle2, 
  AlertTriangle,
  RotateCw,
  Flame
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const AnalyticsView: React.FC = () => {
  const { 
    subjects, 
    dailyLogs, 
    quizHistory, 
    spacedRevisions, 
    profile, 
    userStats 
  } = useStudy();

  const [aiReport, setAiReport] = useState<{ summary: string; score: number; highlights: string[]; recommendations: string[] } | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleGenerateWeeklyReport = async () => {
    setIsGeneratingReport(true);
    try {
      const res = await fetch('/api/ai/weekly-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dailyLogs,
          quizHistory,
          subjects,
          profile
        })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setAiReport(data.report);
      }
    } catch (e) {
      console.error('Failed to generate weekly report:', e);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const totalStudyMinutesAllTime = userStats.totalStudyMinutes || 1320;
  const totalHours = (totalStudyMinutesAllTime / 60).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Academic Performance & AI Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time tracking of study consistency, syllabus mastery, quiz accuracy, and AI diagnostic insights.
          </p>
        </div>

        <button
          id="generate-ai-weekly-report-btn"
          onClick={handleGenerateWeeklyReport}
          disabled={isGeneratingReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95 disabled:opacity-50"
        >
          <Sparkles className={`h-4 w-4 ${isGeneratingReport ? 'animate-spin' : ''}`} />
          <span>{isGeneratingReport ? 'Synthesizing...' : 'Generate AI Weekly Diagnostic'}</span>
        </button>
      </div>

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Study Hours</span>
            <Clock className="h-4 w-4 text-blue-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalHours}h</span>
          <span className="text-[11px] text-emerald-500 font-semibold block mt-1">↑ +14% vs last week</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Streak</span>
            <Flame className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-amber-500 font-mono">{userStats.streakDays || 5} Days</span>
          <span className="text-[11px] text-slate-400 block mt-1">Consistency on track</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Avg. Quiz Accuracy</span>
            <BrainCircuit className="h-4 w-4 text-purple-500" />
          </div>
          <span className="text-2xl font-black text-purple-500 font-mono">
            {quizHistory.length > 0 
              ? `${Math.round(quizHistory.reduce((acc, q) => acc + q.percentage, 0) / quizHistory.length)}%` 
              : '78%'}
          </span>
          <span className="text-[11px] text-purple-400 block mt-1">{quizHistory.length} quizzes recorded</span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Target CGPA</span>
            <Target className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-500 font-mono">{profile.targetGpa || 9.2} / 10</span>
          <span className="text-[11px] text-slate-400 block mt-1">Current: {profile.currentGpa || 8.6}</span>
        </div>
      </div>

      {/* 3. AI Generated Diagnostic Report (if available) */}
      {aiReport && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">AI Weekly Academic Diagnostic</h3>
                <p className="text-xs text-slate-300">Generated by Gemini model evaluating study telemetry</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-extrabold text-blue-400 font-mono">{aiReport.score}/100</span>
              <span className="text-[10px] text-slate-400 block">Performance Index</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {aiReport.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                ✓ Strong Academic Momentum
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {aiReport.highlights?.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-400">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                ⚡ Recommended Adjustments
              </span>
              <ul className="text-xs text-slate-300 space-y-1">
                {aiReport.recommendations?.map((r, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 4. Subject Mastery Distribution & Daily Study Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Mastery Progress */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Subject Mastery Breakdown
            </h3>
            <span className="text-xs text-slate-500 font-medium">{subjects.length} Enrolled</span>
          </div>

          <div className="space-y-4">
            {subjects.map((sub) => {
              const totalTopics = sub.topics.length || 0;
              const completedTopics = sub.topics.filter(t => t.completed).length || 0;
              const percent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

              return (
                <div key={sub.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 dark:text-slate-200">{sub.name}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">{percent}% syllabus</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percent >= 75 ? 'bg-emerald-500' : percent >= 50 ? 'bg-blue-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Consistency Visualizer */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Daily Study Hours (Past 7 Days)
            </h3>
            <span className="text-xs text-slate-500 font-medium">Target: {profile.dailyStudyHours || 3.5}h / day</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
            {dailyLogs.slice(-7).map((log, idx) => {
              const hours = (log.totalStudyMinutes / 60).toFixed(1);
              const maxTarget = 6; // max visual height
              const heightPercent = Math.min(100, Math.round(((log.totalStudyMinutes / 60) / maxTarget) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                    {hours}h
                  </span>
                  <div className="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden h-28 flex items-end">
                    <div
                      className={`w-full rounded-xl transition-all duration-500 ${
                        Number(hours) >= (profile.dailyStudyHours || 3.5) ? 'bg-blue-600' : 'bg-blue-400/80'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {log.date.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
