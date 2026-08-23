import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Play, 
  AlertCircle, 
  Filter,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Task, PriorityLevel, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    deleteTask, 
    toggleTaskStatus, 
    adjustMissedTask, 
    subjects, 
    openTimer 
  } = useStudy();

  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed' | 'urgent' | 'ai'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustingId, setAdjustingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleOpenAdd = () => {
    setTitle('');
    setNotes('');
    setIsAddModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sub = subjects.find(s => s.id === subjectId);

    addTask({
      title: title.trim(),
      subjectId,
      subjectName: sub?.name || 'General Study',
      estimatedMinutes: Number(estimatedMinutes) || 45,
      priority,
      status: 'pending',
      dueDate,
      notes: notes.trim() || undefined,
      isAiGenerated: false
    });

    setIsAddModalOpen(false);
  };

  const handleAiAutoGenerateTasks = () => {
    // Generate 3 strategic tasks
    const generated: Array<Omit<Task, 'id'>> = [
      {
        title: 'Revise BCNF Decomposition Algorithms & Lossless Joins',
        subjectId: subjects[0]?.id || 'sub-1',
        subjectName: subjects[0]?.name || 'Database Systems',
        estimatedMinutes: 45,
        priority: 'urgent',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0],
        notes: 'AI Identified: 40% quiz score and midterm in 12 days.',
        isAiGenerated: true
      },
      {
        title: 'Solve 5 Tree Rotation & Balancing Coding Questions',
        subjectId: subjects[1]?.id || 'sub-2',
        subjectName: subjects[1]?.name || 'Data Structures',
        estimatedMinutes: 50,
        priority: 'high',
        status: 'pending',
        dueDate: new Date().toISOString().split('T')[0],
        notes: 'AI Identified: High exam weightage (30%).',
        isAiGenerated: true
      }
    ];

    generated.forEach(t => addTask(t));
  };

  const handleAiRebalance = async (task: Task) => {
    setAdjustingId(task.id);
    await adjustMissedTask(task);
    setAdjustingId(null);
  };

  const filteredTasks = tasks.filter(t => {
    if (activeFilter === 'pending') return t.status !== 'completed';
    if (activeFilter === 'completed') return t.status === 'completed';
    if (activeFilter === 'urgent') return t.priority === 'urgent';
    if (activeFilter === 'ai') return t.isAiGenerated;
    return true;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Daily Academic Task Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {completedCount} of {tasks.length} tasks completed today. Use AI auto-rebalance for missed items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="ai-generate-daily-tasks-btn"
            onClick={handleAiAutoGenerateTasks}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-300 text-xs font-semibold hover:bg-purple-100 transition"
          >
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>AI Suggest Tasks</span>
          </button>

          <button
            id="add-task-modal-btn"
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {(['all', 'pending', 'completed', 'urgent', 'ai'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition ${
              activeFilter === filter
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {filter === 'ai' ? '✨ AI Generated' : filter}
          </button>
        ))}
      </div>

      {/* 3. Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
            <CheckSquare className="h-8 w-8 text-slate-400 mx-auto" />
            <p>No tasks match the active filter.</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isMissed = task.status === 'missed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-70'
                    : isMissed
                    ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500/40'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`mt-0.5 h-5 w-5 rounded-lg border flex items-center justify-center transition shrink-0 ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 dark:border-slate-600 hover:border-blue-500'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="h-4 w-4 fill-current" />}
                  </button>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-mono">
                        {task.subjectName}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {task.estimatedMinutes} mins
                      </span>
                      {task.priority === 'urgent' && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                          Urgent
                        </span>
                      )}
                      {task.isAiGenerated && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300">
                          AI Prioritized
                        </span>
                      )}
                    </div>

                    <h3 className={`text-xs sm:text-sm font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {task.title}
                    </h3>

                    {task.notes && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 italic">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {isMissed && (
                    <button
                      onClick={() => handleAiRebalance(task)}
                      disabled={adjustingId === task.id}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{adjustingId === task.id ? 'Rebalancing...' : 'AI Reschedule'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => openTimer(task.subjectId, task.title)}
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Start Timer"
                  >
                    <Play className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Delete Task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create New Study Task</h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveTask} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Solve 10 Previous Year Questions on DBMS Indexing"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Est. Minutes</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 45)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Notes / Key Concepts</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Focus on B+ Tree node split algorithms."
                  className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
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
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
