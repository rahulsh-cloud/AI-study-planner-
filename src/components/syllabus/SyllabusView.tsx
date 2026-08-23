import React, { useState } from 'react';
import { 
  ListTree, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Search, 
  Filter, 
  Sparkles, 
  BookOpen, 
  Trash2, 
  Play, 
  Flame, 
  TrendingUp,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { SyllabusTopic, DifficultyLevel } from '../../types';

export const SyllabusView: React.FC = () => {
  const { 
    subjects, 
    toggleTopicCompleted, 
    addTopic, 
    deleteTopic, 
    openTimer, 
    setActiveTab 
  } = useStudy();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed' | 'weak'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);

  // Add Topic Form
  const [topicName, setTopicName] = useState('');
  const [unitName, setUnitName] = useState('Unit 1');
  const [estimatedHours, setEstimatedHours] = useState(3);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [isGeneratingAIBreakdown, setIsGeneratingAIBreakdown] = useState(false);

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];

  if (!currentSubject) {
    return (
      <div className="p-12 text-center text-slate-500">
        No subjects available. Add a subject first in "My Subjects".
      </div>
    );
  }

  // Group topics by Unit
  const filteredTopics = currentSubject.topics.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.unit.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === 'completed') return t.completed;
    if (filterStatus === 'pending') return !t.completed;
    if (filterStatus === 'weak') return (t.masteryScore || 50) < 60;
    return true;
  });

  const unitsMap: { [unit: string]: SyllabusTopic[] } = {};
  filteredTopics.forEach(t => {
    const u = t.unit || 'General Topics';
    if (!unitsMap[u]) unitsMap[u] = [];
    unitsMap[u].push(t);
  });

  const totalTopicsCount = currentSubject.topics.length;
  const completedCount = currentSubject.topics.filter(t => t.completed).length;
  const progressPercent = totalTopicsCount > 0 ? Math.round((completedCount / totalTopicsCount) * 100) : 0;

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicName.trim()) return;

    addTopic(currentSubject.id, {
      name: topicName.trim(),
      unit: unitName.trim() || 'Unit 1',
      completed: false,
      estimatedHours: Number(estimatedHours) || 3,
      difficulty,
      masteryScore: 40
    });

    setTopicName('');
    setIsAddTopicModalOpen(false);
  };

  const handleGenerateAIBreakdown = async () => {
    setIsGeneratingAIBreakdown(true);
    try {
      // Add standard AI-generated subtopics for the current subject
      const standardSubtopics = [
        { name: `${currentSubject.name}: Theoretical Foundations & Key Axioms`, unit: 'Unit 4 (AI Advanced)', hours: 4, diff: 'medium' as DifficultyLevel },
        { name: `${currentSubject.name}: Case Studies, Practical Lab Numerical & Problems`, unit: 'Unit 4 (AI Advanced)', hours: 5, diff: 'hard' as DifficultyLevel },
        { name: `${currentSubject.name}: University Previous Year Questions (PYQs) Solved`, unit: 'Unit 5 (Exam Prep)', hours: 6, diff: 'hard' as DifficultyLevel }
      ];

      standardSubtopics.forEach(st => {
        addTopic(currentSubject.id, {
          name: st.name,
          unit: st.unit,
          completed: false,
          estimatedHours: st.hours,
          difficulty: st.diff,
          masteryScore: 35
        });
      });
    } catch {
      // ignore
    } finally {
      setIsGeneratingAIBreakdown(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header & Subject Switcher Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Syllabus & Curriculum Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Check off syllabus topics, track mastery levels, and automatically trigger spaced repetition schedules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ai-generate-syllabus-breakdown-btn"
            onClick={handleGenerateAIBreakdown}
            disabled={isGeneratingAIBreakdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>{isGeneratingAIBreakdown ? 'Expanding...' : 'AI Syllabus Booster'}</span>
          </button>

          <button
            id="add-custom-topic-btn"
            onClick={() => setIsAddTopicModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Subject Chips / Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map((sub) => {
          const isSelected = sub.id === currentSubject.id;
          const subDone = sub.topics.filter(t => t.completed).length;
          const subPct = sub.topics.length > 0 ? Math.round((subDone / sub.topics.length) * 100) : 0;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{sub.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {subPct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Progress Overview for Selected Subject */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                {currentSubject.code}
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{currentSubject.name}</h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {currentSubject.teacher ? `Taught by ${currentSubject.teacher}` : 'Core Academic Course'} • {completedCount} of {totalTopicsCount} topics completed
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div>
              <span className="text-[11px] text-slate-400 block">Syllabus Completion</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">{progressPercent}%</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Difficulty</span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">{currentSubject.difficulty}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block">Status Tag</span>
              <span className={`text-xs font-bold ${
                currentSubject.strengthLevel === 'weak' ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {currentSubject.strengthLevel === 'weak' ? 'Needs Focus' : 'On Track'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search topics, units, chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'pending', 'completed', 'weak'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                filterStatus === status
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {status === 'weak' ? 'Weak Areas (<60%)' : status}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Units & Topics List */}
      <div className="space-y-6">
        {Object.keys(unitsMap).length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No topics found matching your criteria. Try adjusting the search or filter.
          </div>
        ) : (
          Object.entries(unitsMap).map(([unitTitle, topics]) => {
            const unitCompleted = topics.filter(t => t.completed).length;

            return (
              <div
                key={unitTitle}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
              >
                {/* Unit Header */}
                <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">{unitTitle}</h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {unitCompleted}/{topics.length} Done
                  </span>
                </div>

                {/* Topics in this unit */}
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {topics.map((topic) => {
                    const isWeak = (topic.masteryScore || 50) < 60;

                    return (
                      <div
                        key={topic.id}
                        className={`p-4 flex items-center justify-between gap-4 transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30 ${
                          topic.completed ? 'bg-slate-50/40 dark:bg-slate-900/30 opacity-80' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <button
                            id={`toggle-topic-${topic.id}`}
                            onClick={() => toggleTopicCompleted(currentSubject.id, topic.id)}
                            className={`h-5 w-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                              topic.completed
                                ? 'bg-emerald-600 border-emerald-600 text-white'
                                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                            }`}
                          >
                            {topic.completed && <CheckCircle2 className="h-4 w-4 fill-current" />}
                          </button>

                          <div className="min-w-0">
                            <p className={`text-xs font-semibold ${
                              topic.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
                            }`}>
                              {topic.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-slate-400">
                                Est: {topic.estimatedHours} hrs
                              </span>
                              <span className="text-[10px] text-slate-400">•</span>
                              <span className="text-[10px] text-slate-400 capitalize">
                                {topic.difficulty} Difficulty
                              </span>
                              {isWeak && (
                                <>
                                  <span className="text-[10px] text-slate-400">•</span>
                                  <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-200 dark:border-rose-900">
                                    Low Mastery ({topic.masteryScore}%)
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Mastery Meter */}
                          <div className="hidden sm:flex flex-col items-end mr-2">
                            <span className="text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                              {topic.masteryScore || 50}% Mastery
                            </span>
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                              <div
                                className={`h-full rounded-full ${
                                  (topic.masteryScore || 50) >= 80
                                    ? 'bg-emerald-500'
                                    : (topic.masteryScore || 50) >= 60
                                    ? 'bg-blue-500'
                                    : 'bg-rose-500'
                                }`}
                                style={{ width: `${topic.masteryScore || 50}%` }}
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => openTimer(currentSubject.id, topic.name)}
                            className="p-1.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Start Focus Timer for this topic"
                          >
                            <Play className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteTopic(currentSubject.id, topic.id)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                            title="Delete Topic"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Topic Modal */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Add Topic to {currentSubject.code}
              </h3>
              <button onClick={() => setIsAddTopicModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddTopicSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Topic / Chapter Name *
                </label>
                <input
                  type="text"
                  required
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                  placeholder="e.g. B-Trees & B+ Tree Indexing"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit / Module
                  </label>
                  <input
                    type="text"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="e.g. Unit 3"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Est. Study Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={estimatedHours}
                    onChange={(e) => setEstimatedHours(parseInt(e.target.value) || 3)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
