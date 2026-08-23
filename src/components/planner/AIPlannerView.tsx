import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Play, 
  TrendingUp, 
  AlertCircle, 
  Flame, 
  Layers, 
  RotateCw,
  Sliders
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { TimetableBlock } from '../../types';

export const AIPlannerView: React.FC = () => {
  const { 
    profile, 
    subjects, 
    exams, 
    currentStudyPlan, 
    generateAIStudyPlan, 
    isGeneratingPlan, 
    openTimer, 
    setTimetableBlocks, 
    addNotification, 
    setActiveTab 
  } = useStudy();

  const [daysCount, setDaysCount] = useState<number>(7);
  const [preferences, setPreferences] = useState<string>('Heavy focus on weak topics (DBMS Normalization & OS Deadlocks). Prefer 50-minute deep study blocks.');
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [appliedNotice, setAppliedNotice] = useState<boolean>(false);

  const handleGenerate = async () => {
    await generateAIStudyPlan(daysCount, preferences);
    setActiveDayIndex(0);
  };

  const handleApplyToTimetable = () => {
    if (!currentStudyPlan || !currentStudyPlan.dailyPlans) return;

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
    const newBlocks: TimetableBlock[] = [];

    currentStudyPlan.dailyPlans.forEach((day, idx) => {
      const dayName = daysOfWeek[idx % 7];
      day.studySlots.forEach((slot, sIdx) => {
        newBlocks.push({
          id: `tt-ai-${Date.now()}-${sIdx}-${idx}`,
          dayOfWeek: dayName,
          startTime: slot.timeWindow ? slot.timeWindow.split('-')[0].trim() : '18:00',
          endTime: slot.timeWindow ? slot.timeWindow.split('-')[1]?.trim() || '19:00' : '19:00',
          subjectId: slot.subject,
          subjectName: slot.subject,
          topicName: slot.topic,
          activityType: 'study',
          colorHex: '#3b82f6',
          isCompleted: false
        });
      });
    });

    if (newBlocks.length > 0) {
      setTimetableBlocks(newBlocks);
      setAppliedNotice(true);
      addNotification({
        type: 'ai_insight',
        title: 'Timetable Synced with AI Plan',
        message: 'Your weekly timetable schedule was updated with the latest AI study slots.',
        priority: 'medium',
        actionUrl: 'timetable'
      });
      setTimeout(() => setAppliedNotice(false), 4000);
    }
  };

  const currentDailyPlan = currentStudyPlan?.dailyPlans?.[activeDayIndex] || currentStudyPlan?.dailyPlans?.[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Generator Control Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                AI Master Study Planner
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono border border-blue-700">
                  Gemini Pro
                </span>
              </h1>
              <p className="text-xs text-slate-300">
                Synthesizes subject syllabi, approaching exams, and weak spots into an optimal timetable.
              </p>
            </div>
          </div>

          {/* Days selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-800/90 border border-slate-700">
            {[3, 7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDaysCount(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  daysCount === d
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        {/* Preferences Prompt */}
        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-blue-400" />
              <span>Custom Strategy & Timing Constraints</span>
            </label>
            <input
              type="text"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="e.g. Focus 70% on DBMS Normalization and OS Deadlocks, study in the evening after 6 PM"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>🎯 Enrolled Subjects: <strong className="text-white">{subjects.length}</strong></span>
              <span>•</span>
              <span>⏳ Approaching Exams: <strong className="text-white">{exams.length}</strong></span>
              <span>•</span>
              <span>🕒 Daily Target: <strong className="text-white">{profile.dailyStudyHours || 3.5} hrs</strong></span>
            </div>

            <button
              id="generate-ai-plan-action-btn"
              onClick={handleGenerate}
              disabled={isGeneratingPlan}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition active:scale-95 disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingPlan ? 'animate-spin' : ''}`} />
              <span>{isGeneratingPlan ? 'Synthesizing Plan with Gemini...' : 'Generate AI Study Plan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Generated Plan Display */}
      {currentStudyPlan ? (
        <div className="space-y-6">
          {/* Summary & Strategy Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <TrendingUp className="h-4 w-4" />
                <span>Executive Study Plan Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {currentStudyPlan.summary}
              </p>
              {currentStudyPlan.focusStrategy && (
                <div className="mt-3 p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-800 dark:text-blue-300">
                  <span className="font-bold">Key Focus Strategy:</span> {currentStudyPlan.focusStrategy}
                </div>
              )}
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-1">
                  Actions
                </span>
                <p className="text-xs text-slate-500">
                  Apply this generated schedule directly to your interactive weekly calendar.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <button
                  id="apply-plan-to-timetable-btn"
                  onClick={handleApplyToTimetable}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Sync to Weekly Timetable</span>
                </button>
                {appliedNotice && (
                  <p className="text-[11px] text-emerald-500 font-semibold text-center animate-in fade-in">
                    ✓ Applied to Weekly Timetable!
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Daily Tabs Header */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {currentStudyPlan.dailyPlans?.map((day, idx) => (
              <button
                key={day.dayNumber || idx}
                onClick={() => setActiveDayIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeDayIndex === idx
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Day {day.dayNumber || idx + 1}</span>
                <span className="text-[10px] text-slate-400">({day.totalEstimatedMinutes || 180}m)</span>
              </button>
            ))}
          </div>

          {/* Active Day Slots List */}
          {currentDailyPlan && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Day {currentDailyPlan.dayNumber} Schedule & Syllabus Allocation
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentDailyPlan.focusTheme || 'Core Syllabus Deep Study & Practice'} • {currentDailyPlan.studySlots?.length || 0} Slots
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 font-mono font-bold bg-blue-50 dark:bg-blue-950/50 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-800">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{currentDailyPlan.totalEstimatedMinutes || 180} mins total</span>
                </div>
              </div>

              {/* Slot Cards */}
              <div className="space-y-3">
                {currentDailyPlan.studySlots?.map((slot, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/50 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono">
                          {slot.subject}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {slot.timeWindow || `${slot.durationMinutes || 45} mins`}
                        </span>
                        {slot.priority === 'urgent' && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                            Urgent Weak Topic
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {slot.topic}
                      </h4>

                      {slot.strategicReason && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          💡 AI Strategy: {slot.strategicReason}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openTimer(slot.subject, slot.topic)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition active:scale-95"
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>Start Slot</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Active AI Plan Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the "Generate AI Study Plan" button above. Gemini will construct a personalized day-by-day roadmap tailored to your course load.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGeneratingPlan}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 inline-flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Study Plan Now</span>
          </button>
        </div>
      )}
    </div>
  );
};
