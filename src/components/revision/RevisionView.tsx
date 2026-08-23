import React, { useState } from 'react';
import { 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  Plus, 
  Layers, 
  Play, 
  HelpCircle,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { SpacedRevisionItem } from '../../types';

export const RevisionView: React.FC = () => {
  const { 
    spacedRevisions, 
    completeRevision, 
    addCustomRevision, 
    subjects, 
    openTimer 
  } = useStudy();

  const [activeTab, setActiveTab] = useState<'due' | 'all' | 'mastered'>('due');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [topicName, setTopicName] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const dueRevisions = spacedRevisions.filter(r => r.nextDueDate <= todayStr && r.status !== 'completed');
  const masteredRevisions = spacedRevisions.filter(r => r.stage >= 6 || r.status === 'completed');

  const handleAddRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    const sub = subjects.find(s => s.id === subjectId);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    addCustomRevision({
      subjectId,
      subjectName: sub?.name || 'General Subject',
      topicId: `custom-top-${Date.now()}`,
      topicName: topicName.trim(),
      stage: 1,
      lastReviewedDate: todayStr,
      nextDueDate: tomorrow.toISOString().split('T')[0],
      intervalDays: 1,
      repetitionsCount: 1,
      status: 'pending',
      easeFactor: 2.5
    });

    setTopicName('');
    setIsAddModalOpen(false);
  };

  const getStageLabel = (stage: number) => {
    switch (stage) {
      case 1: return 'Day 1 (Initial Encoding)';
      case 2: return 'Day 2 (1st Recall)';
      case 3: return 'Day 4 (Consolidation)';
      case 4: return 'Day 7 (Weekly Retention)';
      case 5: return 'Day 14 (Long-term Encoding)';
      case 6: return 'Day 30 (Permanent Mastery)';
      default: return `Stage ${stage}`;
    }
  };

  const displayedList = activeTab === 'due' 
    ? dueRevisions 
    : activeTab === 'mastered' 
    ? masteredRevisions 
    : spacedRevisions;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Forgetting Curve Concept Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Spaced Repetition & Revision Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Scientifically timed active recall sessions based on the Ebbinghaus Forgetting Curve (1, 2, 4, 7, 14, 30 days).
          </p>
        </div>

        <button
          id="add-revision-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Queue New Concept</span>
        </button>
      </div>

      {/* Forgetting curve educational bar */}
      <div className="p-5 rounded-3xl bg-purple-950/40 border border-purple-800/50 text-purple-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-900/60 text-purple-400 border border-purple-700">
            <RotateCw className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">How Spaced Repetition Prevents 80% Knowledge Decay</h3>
            <p className="text-[11px] text-purple-300 mt-0.5">
              Reviewing at progressively expanding intervals locks mathematical theorems and programming concepts into permanent long-term memory.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold shrink-0">
          <div className="text-center">
            <span className="text-rose-400 text-base block font-extrabold">{dueRevisions.length}</span>
            <span className="text-[10px] text-slate-400 font-sans">Due Today</span>
          </div>
          <div className="text-center">
            <span className="text-purple-400 text-base block font-extrabold">{spacedRevisions.length}</span>
            <span className="text-[10px] text-slate-400 font-sans">In Pipeline</span>
          </div>
          <div className="text-center">
            <span className="text-emerald-400 text-base block font-extrabold">{masteredRevisions.length}</span>
            <span className="text-[10px] text-slate-400 font-sans">Mastered</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('due')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'due'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Due for Review ({dueRevisions.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'all'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          All Scheduled ({spacedRevisions.length})
        </button>
        <button
          onClick={() => setActiveTab('mastered')}
          className={`px-4 py-2 rounded-2xl text-xs font-semibold transition ${
            activeTab === 'mastered'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
          }`}
        >
          Mastered Concepts ({masteredRevisions.length})
        </button>
      </div>

      {/* 3. Revisions List */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">All revisions are caught up!</p>
            <p>Topics marked complete in your syllabus tracker will automatically queue here.</p>
          </div>
        ) : (
          displayedList.map((rev) => {
            const isDue = rev.nextDueDate <= todayStr;
            const progressPercent = Math.min(100, Math.round((rev.stage / 6) * 100));

            return (
              <div
                key={rev.id}
                className={`p-5 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDue
                    ? 'bg-purple-50/40 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/60 shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-mono">
                      {rev.subjectName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Stage {rev.stage} of 6 • {getStageLabel(rev.stage)}
                    </span>
                    {isDue && (
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                        ⚡ Due Today
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rev.topicName}
                  </h3>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Last reviewed: {rev.lastReviewedDate}</span>
                    <span>•</span>
                    <span>Next Due: {rev.nextDueDate}</span>
                    <span>•</span>
                    <span>Repetitions: {rev.repetitionsCount}</span>
                  </div>

                  {/* Stage Progress Meter */}
                  <div className="w-full max-w-xs h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openTimer(rev.subjectId, rev.topicName)}
                    className="p-2 rounded-xl text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="15m Quick Recall Timer"
                  >
                    <Play className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => completeRevision(rev.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold shadow-md shadow-purple-500/25 transition active:scale-95"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Complete Recall (+30 XP)</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Custom Revision Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Queue Concept for Spaced Repetition
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddRevisionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Concept / Formula / Theorem *</label>
                <input
                  type="text"
                  required
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. Master Theorem for Recurrence Relations"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                >
                  Start Recall Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
