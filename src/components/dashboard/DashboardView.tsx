import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  Hourglass, 
  ArrowRight, 
  TrendingUp, 
  Play, 
  BrainCircuit, 
  RotateCw, 
  BookOpen, 
  CheckSquare,
  Plus,
  RefreshCw
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const DashboardView: React.FC = () => {
  const { 
    profile, 
    subjects, 
    exams, 
    tasks, 
    currentStudyPlan, 
    spacedRevisions, 
    gamification, 
    recommendations, 
    refreshRecommendations, 
    isRecommendationsLoading, 
    setActiveTab, 
    openTimer, 
    toggleTaskStatus, 
    adjustMissedTask 
  } = useStudy();

  const [adjustingTaskId, setAdjustingTaskId] = useState<string | null>(null);

  // Overall syllabus completion calculation
  const totalTopics = subjects.reduce((acc, s) => acc + s.topics.length, 0);
  const completedTopics = subjects.reduce((acc, s) => acc + s.topics.filter(t => t.completed).length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Daily study progress
  const targetMinutes = profile.dailyGoalMinutes || 210;
  const studiedMinutes = gamification.todayMinutesStudied || 0;
  const dailyProgressPercent = Math.min(100, Math.round((studiedMinutes / targetMinutes) * 100));

  // Today's tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.slice(0, 5);
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;

  // Urgent Exams (nearest first)
  const sortedExams = [...exams].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());

  // Revisions due
  const dueRevisions = spacedRevisions.filter(r => r.status === 'due_today' || r.status === 'overdue');

  const handleAiAdjust = async (task: any) => {
    setAdjustingTaskId(task.id);
    await adjustMissedTask(task);
    setAdjustingTaskId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Greeting & Quick Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Good Morning, {profile.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            AI has updated your study plan based on your academic goals and upcoming exam deadlines.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            id="dash-start-focus-btn"
            onClick={() => openTimer()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition active:scale-95"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Focus Session</span>
          </button>

          <button
            id="dash-ask-copilot-btn"
            onClick={() => setActiveTab('assistant')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs transition"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 12-Column Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Today's Smart Schedule */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-sm sm:text-base">
                <span>📅 Today's Smart Schedule</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  Optimized
                </span>
              </h2>
              <button 
                onClick={() => setActiveTab('planner')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                Regenerate Plan
              </button>
            </div>

            <div className="p-0 divide-y divide-slate-100 dark:divide-slate-800/80">
              {todayTasks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                  No scheduled tasks for today. Click "Regenerate Plan" to build a fresh schedule.
                </div>
              ) : (
                todayTasks.map((task, idx) => {
                  const isDone = task.status === 'completed';
                  const isMissed = task.status === 'missed';
                  const colorBar = idx % 3 === 0 ? 'bg-indigo-500' : idx % 3 === 1 ? 'bg-amber-500' : 'bg-emerald-500';
                  const tagType = idx % 3 === 0 ? 'Revision' : idx % 3 === 1 ? 'Weak Area' : 'Practice';
                  const tagStyle = idx % 3 === 0 
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-800'
                    : idx % 3 === 1
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-800'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-800';

                  const estimatedTimes = ['09:00 AM', '10:15 AM', '01:00 PM', '03:30 PM', '06:00 PM'];
                  const timeSlot = estimatedTimes[idx] || '08:00 PM';

                  return (
                    <div 
                      key={task.id} 
                      className={`p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isDone ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="w-14 text-center text-[10px] text-slate-400 font-mono shrink-0">
                        {timeSlot.split(' ')[0]}<br/>{timeSlot.split(' ')[1]}
                      </div>
                      <div className={`w-1 ${colorBar} h-10 rounded-full shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-semibold truncate ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {task.subjectName} {task.topicName ? `• ${task.topicName}` : ''}
                        </p>
                      </div>
                      <div className="flex gap-2.5 items-center shrink-0">
                        {isMissed && (
                          <button
                            onClick={() => handleAiAdjust(task)}
                            disabled={adjustingTaskId === task.id}
                            className="px-2 py-1 rounded-md bg-indigo-600 text-white text-[10px] font-bold"
                          >
                            {adjustingTaskId === task.id ? 'Rebalancing...' : 'Reschedule'}
                          </button>
                        )}
                        <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium hidden sm:inline ${tagStyle}`}>
                          {tagType}
                        </span>
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleTaskStatus(task.id)}
                          className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2-Column Split: Syllabus Completion & AI Assistant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Syllabus Completion */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Syllabus Completion</h3>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{overallProgress}%</span>
              </div>
              <div className="space-y-4">
                {subjects.slice(0, 3).map((subj, sIdx) => {
                  const sTopics = subj.topics.length;
                  const sDone = subj.topics.filter(t => t.completed).length;
                  const sPct = sTopics > 0 ? Math.round((sDone / sTopics) * 100) : 50;
                  const barColor = sIdx === 0 ? 'bg-indigo-500' : sIdx === 1 ? 'bg-amber-500' : 'bg-emerald-500';

                  return (
                    <div key={subj.id}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{subj.name}</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{sPct}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all duration-500`} style={{ width: `${sPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Dark Luxury AI Assistant Card */}
            <div className="bg-[#0F172A] p-5 rounded-2xl border border-slate-800 shadow-xl text-white relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <span>💬 AI Assistant</span>
                </h3>
                <div className="bg-slate-800/80 p-3 rounded-lg text-xs leading-relaxed mb-4 text-slate-200 border border-slate-700/60">
                  "You have 2 high-priority exam revisions queued for this week. Would you like me to reserve a 45-minute focus block tonight?"
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveTab('planner')}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] py-2 rounded-lg font-bold transition-all"
                  >
                    Schedule
                  </button>
                  <button 
                    onClick={() => setActiveTab('assistant')}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-[10px] py-2 rounded-lg font-bold transition-all"
                  >
                    Open Tutor
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right 4 Columns */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Exam Countdown */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span>Exam Countdown</span>
              </h3>
              <button 
                onClick={() => setActiveTab('exams')}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {sortedExams.slice(0, 2).map((exam, eIdx) => {
                const examDateObj = new Date(exam.examDate);
                const daysLeft = Math.max(0, Math.ceil((examDateObj.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
                const isUrgent = daysLeft <= 7 || eIdx === 0;

                return (
                  <div
                    key={exam.id}
                    onClick={() => setActiveTab('exams')}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      isUrgent
                        ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/50'
                    }`}
                  >
                    <div className={`text-center px-2.5 border-r ${isUrgent ? 'border-red-200 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'}`}>
                      <span className={`block text-xl font-bold ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {String(daysLeft).padStart(2, '0')}
                      </span>
                      <span className={`block text-[8px] uppercase font-bold tracking-widest ${isUrgent ? 'text-red-500' : 'text-slate-400'}`}>
                        Days
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {exam.subjectName}
                      </p>
                      <p className={`text-[10px] font-semibold uppercase truncate ${isUrgent ? 'text-red-500' : 'text-slate-400'}`}>
                        {isUrgent ? 'High Priority' : exam.examName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              onClick={() => setActiveTab('exams')}
              className="w-full mt-4 text-xs py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-lg transition-all"
            >
              View All Exams
            </button>
          </div>

          {/* AI Insights Card (Vibrant Indigo Hero Block) */}
          <div className="bg-indigo-600 p-5 rounded-2xl shadow-lg shadow-indigo-500/20 text-white flex flex-col justify-between flex-1 min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <span>🧠 AI Insights</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Gemini Active
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs shrink-0">
                    ⚠️
                  </div>
                  <p className="text-xs leading-relaxed text-indigo-50 opacity-95">
                    Your performance in <span className="font-bold underline italic">Data Structures</span> is improving. AI suggests a 30-min active recall quiz tonight.
                  </p>
                </div>

                <div className="flex gap-3">
                  <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs shrink-0">
                    📈
                  </div>
                  <p className="text-xs leading-relaxed text-indigo-50 opacity-95">
                    Great pace! You completed your study goal for yesterday early. <span className="font-bold">+45 XP earned.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/20 text-center">
              <span className="text-[10px] text-indigo-100 font-medium uppercase tracking-widest">
                Next Goal: 30-day streak ({gamification.currentStreak}/30)
              </span>
              <div className="h-1.5 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, Math.round((gamification.currentStreak / 30) * 100))}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
