import React, { useState } from 'react';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  BarChart2, 
  ListTree,
  X
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { Subject, DifficultyLevel } from '../../types';

export const SubjectsView: React.FC = () => {
  const { subjects, addSubject, updateSubject, deleteSubject, setActiveTab } = useStudy();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [credits, setCredits] = useState(4);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [weightage, setWeightage] = useState(25);
  const [strengthLevel, setStrengthLevel] = useState<'weak' | 'moderate' | 'strong'>('moderate');
  const [targetPercentage, setTargetPercentage] = useState(90);

  const resetForm = () => {
    setName('');
    setCode('');
    setTeacher('');
    setCredits(4);
    setDifficulty('medium');
    setWeightage(25);
    setStrengthLevel('moderate');
    setTargetPercentage(90);
    setEditingSubject(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setCode(sub.code);
    setTeacher(sub.teacher || '');
    setCredits(sub.credits || 4);
    setDifficulty(sub.difficulty);
    setWeightage(sub.weightage);
    setStrengthLevel(sub.strengthLevel);
    setTargetPercentage(sub.targetPercentage || 90);
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name,
        code: code || name.slice(0, 3).toUpperCase() + '-101',
        teacher,
        credits: Number(credits),
        difficulty,
        weightage: Number(weightage),
        strengthLevel,
        targetPercentage: Number(targetPercentage)
      });
    } else {
      addSubject({
        name,
        code: code || name.slice(0, 3).toUpperCase() + '-101',
        teacher,
        credits: Number(credits),
        difficulty,
        weightage: Number(weightage),
        strengthLevel,
        targetPercentage: Number(targetPercentage),
        colorHex: '#3b82f6',
        topics: [
          {
            id: `top-${Date.now()}-1`,
            name: 'Unit 1: Fundamentals & Core Architecture',
            unit: 'Unit 1',
            completed: false,
            estimatedHours: 4,
            masteryScore: 60,
            difficulty: 'easy'
          },
          {
            id: `top-${Date.now()}-2`,
            name: 'Unit 2: Theoretical Models & Problem Formulations',
            unit: 'Unit 2',
            completed: false,
            estimatedHours: 6,
            masteryScore: 40,
            difficulty: 'medium'
          },
          {
            id: `top-${Date.now()}-3`,
            name: 'Unit 3: Advanced Optimization & Applied Cases',
            unit: 'Unit 3',
            completed: false,
            estimatedHours: 8,
            masteryScore: 30,
            difficulty: 'hard'
          }
        ]
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Enrolled Academic Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Track syllabus progress, manage weightages, and configure AI weakness prioritization.
          </p>
        </div>

        <button
          id="add-subject-btn"
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const totalTopics = sub.topics.length;
          const doneTopics = sub.topics.filter(t => t.completed).length;
          const percent = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;
          const avgMastery = totalTopics > 0 
            ? Math.round(sub.topics.reduce((acc, t) => acc + (t.masteryScore || 50), 0) / totalTopics)
            : 50;

          return (
            <div
              key={sub.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Badges row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {sub.code}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      sub.strengthLevel === 'weak'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                        : sub.strengthLevel === 'strong'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40'
                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40'
                    }`}>
                      {sub.strengthLevel === 'weak' ? '⚠️ Weak Area' : sub.strengthLevel === 'strong' ? '⭐ Strong' : 'Moderate'}
                    </span>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                      {sub.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {sub.name}
                </h3>
                {sub.teacher && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Instructor: {sub.teacher} • {sub.credits} Credits
                  </p>
                )}

                {/* Progress Visual */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Syllabus Completion</span>
                    <span className="text-slate-900 dark:text-white font-mono">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>{doneTopics} of {totalTopics} Topics Completed</span>
                    <span>Mastery: {avgMastery}%</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('syllabus')}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <ListTree className="h-3.5 w-3.5" />
                  <span>View Syllabus</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(sub)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    title="Edit Subject"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  {subjects.length > 1 && (
                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Delete Subject"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Subject Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingSubject ? 'Edit Subject Details' : 'Add New Academic Subject'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Machine Learning"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS-405"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Instructor / Professor
                  </label>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    placeholder="e.g. Dr. A. Sen"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confidence
                  </label>
                  <select
                    value={strengthLevel}
                    onChange={(e) => setStrengthLevel(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="weak">⚠️ Weak Area</option>
                    <option value="moderate">Moderate</option>
                    <option value="strong">⭐ Strong</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={credits}
                    onChange={(e) => setCredits(parseInt(e.target.value) || 4)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25"
                >
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
